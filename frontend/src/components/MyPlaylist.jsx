import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetPlaylistSongsMutation } from "../slices/playlistApiSlice";
import { useSongDataMutation } from "../slices/songApiSlice";
import { setCurrentSong } from "../slices/songPlayerSlice";
import { useDispatch } from "react-redux";

const MyPlaylist = () => {
  const { id: playlistId } = useParams();
  const [playlistSongs, setPlaylistSongs] = useState();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchPlaylistsData] = useGetPlaylistSongsMutation();
  const [fetchSongData] = useSongDataMutation();
  const dispatch = useDispatch();

  function songDurationToTime(duration) {
    const minutes = Math.floor(duration / 60);
    const remainingSeconds = duration % 60;
    const beforeDecimal = remainingSeconds.toString().split(".")[0];

    return `${minutes}:${
      beforeDecimal.length === 1 ? `0${beforeDecimal}` : beforeDecimal
    }`;
  }

  const handleOnClick = async (song) => {
    try {
      dispatch(setCurrentSong({ item: song }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  async function fetchData() {
    try {
      const playlistResponse = await fetchPlaylistsData(playlistId).unwrap();
      // setPlaylistSongs(playlistResponse.rows);
      for (let index = 0; index < playlistResponse.rows.length; index++) {
        const response = await fetchSongData({
          songId: playlistResponse.rows[index].song_id,
        }).unwrap();
        let newObj = response[0];
        setData((prev) => [...prev, newObj]);
      }
      console.log(playlistResponse.rows);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div>
        {loading ? (
          <h1>LOADING</h1>
        ) : (
          <div>
            <div className="max-w-2xl mx-auto px-4">
              <div className="items-start justify-between sm:flex">
                <div>
                  <h4 className="text-gray-800 text-xl font-semibold">Songs</h4>
                </div>
              </div>
              <ul className="mt-12 divide-y">
                {data.map((item, idx) => (
                  <li
                    key={idx}
                    className="py-5 flex items-start justify-between hover:bg-gray-400"
                  >
                    <div
                      onClick={() => {
                        handleOnClick(item);
                      }}
                      className="flex gap-3 my-auto"
                    >
                      <h3>{idx + 1}</h3>
                      <img
                        src={item.image[2].link}
                        className="flex-none w-12 h-12"
                      />
                      <div>
                        <span className="block text-sm text-white-700 font-semibold">
                          {item.name}
                          {item.song_id}
                        </span>
                        <span className="block text-sm text-gray-600">
                          {item.primaryArtists}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-center items-center gap-4 my-auto">
                      <h3>{songDurationToTime(item.duration)}</h3>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MyPlaylist;
