import { useParams, useNavigate } from "react-router-dom";
import { useSearchQueryDataMutation } from "../slices/songApiSlice";
import { useEffect, useState } from "react";
import { FaCirclePlay } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import {
  clearQueue,
  addToQueue,
  playNextSong,
  setCurrentSong,
} from "../slices/songPlayerSlice";
import { useSongDataMutation } from "../slices/songApiSlice";
import Options from "./Options/Options";

const SearchResult = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { query: searchQuery } = useParams();
  const [getSearchQueryData] = useSearchQueryDataMutation();
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [floatingButton, setFloatingButton] = useState(false);
  const [getSongData] = useSongDataMutation();

  useEffect(() => {
    async function getResultFromQuery() {
      const queryResult = await getSearchQueryData(searchQuery).unwrap();
      setSearchResult(queryResult);
    }
    if (searchQuery) {
      getResultFromQuery();
    }
  }, [searchQuery]);

  useEffect(() => {
    // console.log(searchResult);
    if (searchResult !== null) {
      setLoading(false);
    }
  }, [searchResult]);

  const handleFloatingPlayButtonClick = async () => {
    dispatch(clearQueue());
    for (let index = 0; index < searchResult.songs.results.length; index++) {
      const response = await getSongData({
        songId: searchResult.songs.results[index].id,
      }).unwrap();
      dispatch(addToQueue({ item: response[0] }));
      // console.log(response[0]);
    }
  };

  const handleSongClick = async (songId) => {
    const response = await getSongData({ songId }).unwrap();
    dispatch(setCurrentSong({ item: response[0] }));
  };

  const handleTopQueryClick = async (item) => {
    switch (item.type) {
      case "artist":
        navigate(`/artist/${item.id}`);
        break;
      case "album":
        navigate(`/album/${item.id}`);
        break;
      case "song":
        handleSongClick(item.id);
        break;
      default:
        break;
    }
  };

  return (
    <>
      {loading ? (
        <>
          <h1>LOADING</h1>
        </>
      ) : (
        <>
          <div className="p-8">
            <div className="flex">
              {searchResult.topQuery.results.map((item, idx) => (
                <div
                  onClick={() => handleTopQueryClick(item)}
                  onMouseEnter={() => setFloatingButton(true)}
                  onMouseLeave={() => setFloatingButton(false)}
                  key={idx}
                  className={`flex flex-col max-w-md mt-4 shadow-lg duration-300 hover:shadow-sm w-[40vw] relative bg-amber-400`}
                >
                  <h1 className="text-2xl">Top Query</h1>
                  <img
                    src={item.image[2].link}
                    loading="lazy"
                    className="w-[max-content] h-48 rounded-full m-8"
                  />
                  <span className="block text-gray-900 ml-4">{item.title}</span>
                  <span className="block text-gray-400 ml-4 mb-4 text-sm">
                    {item.type.charAt(0).toUpperCase() +
                      item.type.slice(1).toLowerCase()}
                  </span>
                  {floatingButton ? (
                    <FaCirclePlay
                      onClick={handleFloatingPlayButtonClick}
                      className="text-7xl text-green-700 absolute bottom-0 right-0 mb-4 mr-4 z-50 hover:scale-110 duration-300 cursor-pointer"
                    />
                  ) : (
                    <></>
                  )}
                </div>
              ))}

              <div className="mt-4 ml-8">
                <h1 className="text-2xl">Songs</h1>
                {searchResult.songs.results.map((item, idx) => (
                  <li
                    key={idx}
                    className="py-5 flex items-start justify-between hover:bg-gray-400"
                  >
                    <div
                      onClick={() => {
                        handleSongClick(item.id);
                      }}
                      className="flex gap-3 my-auto"
                    >
                      <img
                        src={item.image[2].link}
                        className="flex-none w-12 h-12"
                      />
                      <div>
                        <span className="block text-sm text-gray-700 font-semibold">
                          {item.title}
                        </span>
                        <span className="block text-sm text-gray-600">
                          {item.primaryArtists}
                        </span>
                        <Options index={idx} song={item} />
                      </div>
                    </div>
                  </li>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SearchResult;
