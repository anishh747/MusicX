import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetPlaylistSongsMutation } from "../slices/playlistApiSlice";
import { useSongDataMutation } from "../slices/songApiSlice";
import { setCurrentSong } from "../slices/songPlayerSlice";
import { useDispatch } from "react-redux";
import "../screen/screen.css";

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
              <div className="album-name">
                <h4 className="text-white-800 text-xl py-8 font-semibold">
                  Songs
                </h4>
              </div>
              <ul className="album-song-container">
                <li className="album-song-list">
                  <div>
                    <h3>S.N.</h3>
                    <div className="mx-8">
                      <span>Song Name</span>
                    </div>
                  </div>
                  <div>
                    <h3>Song Duration</h3>
                  </div>
                </li>
                {data.map((item, idx) => (
                  <li key={idx} className="album-song-list">
                    <div
                      onClick={() => {
                        handleOnClick(item);
                      }}
                    >
                      <h3>{idx + 1}</h3>
                      <img src={item.image[2].link} />
                      <div>
                        <span>
                          {item.name}
                          {item.song_id}
                        </span>
                        <span>{item.primaryArtists}</span>
                      </div>
                    </div>
                    <div>
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
