import { useParams, useNavigate } from "react-router-dom";
import { useSearchQueryDataMutation } from "../slices/songApiSlice";
import { useEffect, useState } from "react";
import { FaCirclePlay } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import {
  clearQueue,
  addToQueue,
  playNextSong,
  setCurrentSong,
} from "../slices/songPlayerSlice";
import { useSongDataMutation } from "../slices/songApiSlice";
import Options from "./Options/Options";
import "../screen/screen.css";
import { io } from "socket.io-client";


const SearchResult = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { query: searchQuery } = useParams();
  const [getSearchQueryData] = useSearchQueryDataMutation();
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [floatingButton, setFloatingButton] = useState(false);
  const [getSongData] = useSongDataMutation();
  const [socket, setSocket] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);
  const roomInfo = useSelector((state) => state.room.roomInfo);
  const room_id = roomInfo?.room_id;
  const songPlayerInfo = useSelector((state) => state.songPlayer);

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

  useEffect(() => {
    const s = io(import.meta.env.VITE_REACT_API_URL);
    setSocket(s);
  }, []);

  useEffect(() => {
    if (socket !== null) {
      socket.emit('joinRoomCode', { room_id: room_id, username: userInfo.name });
    }
  }, [socket, roomInfo]);

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

  const handleSongClick = async (item_id) => {
    try {
      if (songPlayerInfo?.roomMode && songPlayerInfo?.isRoomHost) {
        const response = await getSongData({ songId: item_id }).unwrap();
        console.log("HOST PLAYED SONG")
        socket.emit("playSong", response[0]);
      } else if (songPlayerInfo.roomMode && !songPlayerInfo.isRoomHost) {
        toast.error("You are not the host of the room");
      } else {
        const response = await getSongData({ songId: item_id }).unwrap();
        // console.log({ item: response[0] })
        dispatch(setCurrentSong({ item: response[0] }));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleTopQueryClick = async (item) => {
    switch (item.type) {
      case "artist":
        // navigate(`/artist/${item.id}`);
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
            <div>
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
                <div className="album-name">
                  <h4 className="text-white-800 text-xl py-4 font-semibold">
                    Search results
                  </h4>
                </div>
                <ul className="album-song-container">
                  {searchResult.songs.results.map((item, idx) => (
                    <li
                      key={idx}
                      className="album-song-list cursor-pointer py-2 border-b border-gray-300 w-1/2"
                      onClick={() => {
                        handleSongClick(item.id);
                      }}
                    >
                      {
                        songPlayerInfo?.currentSong?.item?.id === item.id ? (
                          <>
                            <img className={songPlayerInfo?.isPlaying ? (`p-2`) : (``)} src={songPlayerInfo?.isPlaying ? (`https://m.media-amazon.com/images/G/01/digital/music/player/web/EQ_accent.gif`) : (item.image[0].link)} alt="" />
                            <div>
                              <p className="text-sm font-bold text-green-400">{item.title}</p>
                              <p className="text-xs text-green-500 font-medium">{item.primaryArtists}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <img src={item.image[2].link} />
                            <div>
                            <p className="text-sm font-bold text-white">{item.title}</p>
                              <p className="text-xs text-white font-medium">{item.primaryArtists}</p>
                            </div>
                          </>
                        )
                      }
                      <div className="ml-auto">
                        <Options index={idx} song={item} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SearchResult;
