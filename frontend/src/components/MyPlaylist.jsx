import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetPlaylistSongsMutation, useGetPlaylistNameMutation } from "../slices/playlistApiSlice";
import { useSongDataMutation } from "../slices/songApiSlice";
import { setCurrentSong, addToQueue, clearQueue } from "../slices/songPlayerSlice";
import { useDispatch, useSelector } from "react-redux";
import "../screen/screen.css";
import { FaCirclePlay } from "react-icons/fa6";
import Options from "./Options/Options";
import SkeletonLoaderSong from "./SkeletonLoaders/SkeletonLoaderSong";

const MyPlaylist = () => {
  const { id: playlistId } = useParams();
  const [playlistName, setPlaylistName] = useState("PLAYLIST NAME");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchPlaylistsData] = useGetPlaylistSongsMutation();
  const [fetchPlaylistName] = useGetPlaylistNameMutation();
  const [fetchSongData] = useSongDataMutation();
  const dispatch = useDispatch();
  const songPlayerInfo = useSelector((state) => state.songPlayer);

  function songDurationToTime(duration) {
    const minutes = Math.floor(duration / 60);
    const remainingSeconds = duration % 60;
    const beforeDecimal = remainingSeconds.toString().split(".")[0];

    return `${minutes}:${beforeDecimal.length === 1 ? `0${beforeDecimal}` : beforeDecimal
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
      const fetchPlaylistNameResponse = await fetchPlaylistName(playlistId).unwrap();
      setPlaylistName(fetchPlaylistNameResponse.rows[0].title);
      const playlistResponse = await fetchPlaylistsData(playlistId).unwrap();
      for (let index = 0; index < playlistResponse.rows.length; index++) {
        const response = await fetchSongData({
          songId: playlistResponse.rows[index].song_id,
        }).unwrap();
        let newObj = response[0];
        setData((prev) => [...prev, newObj]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setData([]);
    fetchData();
  }, [playlistId]);

  useEffect(() => {
    console.log(data);
  }, [data])

  const handleBigPlayButton = () => {
    dispatch(clearQueue());
    for (let index = 0; index < data.length; index++) {
      if (songPlayerInfo?.songsQueue?.length === 19) {
        toast.info("Queue is full")
        return;
      }
      dispatch(addToQueue({ item: data[index] }));
    }
  };

  return (
    <>
      <div>
        {loading ? (
          <SkeletonLoaderSong />
        ) : (
          <div>
            <div className="max-w-2xl mx-auto px-4">
              <div className="album-name">
                <h4 className="text-white-800 text-xl py-8 font-semibold">
                  {playlistName}
                </h4>
              </div>
              <FaCirclePlay
                onClick={handleBigPlayButton}
                className="text-6xl text-green-500 mx-auto hover:cursor-pointer"
              />
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
                      {
                        songPlayerInfo?.currentSong?.item?.id === item.id ? (
                          <>
                            <img className={songPlayerInfo?.isPlaying ? (`w-[25px]`) : (``)} src={songPlayerInfo?.isPlaying ? (`https://m.media-amazon.com/images/G/01/digital/music/player/web/EQ_accent.gif`) : (item.image[0].link)} alt="" />
                            <div>
                              <p className="text-sm font-bold text-green-400">{item.name}</p>
                              <p className="text-xs text-green-500 font-medium">{item.primaryArtists}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <img src={item.image[2].link} />
                            <div>
                              <p className="text-sm font-bold text-white">{item.name}</p>
                              <p className="text-xs text-white font-medium">{item.primaryArtists}</p>
                            </div>
                          </>
                        )
                      }
                    </div>
                    <div>
                      <h3>{songDurationToTime(item.duration)}</h3>
                      <Options index={idx} song={item} myPlaylist={true} />
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
