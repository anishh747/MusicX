import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  usePlaylistDataMutation,
  useSongDataMutation,
} from "../slices/songApiSlice";
import {
  setCurrentSong,
  playPause,
  addToQueue,
  playNextSong,
  clearQueue,
} from "../slices/songPlayerSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaCirclePlay } from "react-icons/fa6";
import Options from "../components/Options/Options";
import "./screen.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SkeletonLoaderSong from "../components/SkeletonLoaders/SkeletonLoaderSong";

const PlaylistScreen = () => {
  const { id: playlistId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [fetchPlaylistData, { isLoading }] = usePlaylistDataMutation();
  const dispatch = useDispatch();
  const [fetchSongData] = useSongDataMutation();
  const songPlayerInfo = useSelector((state) => state.songPlayer);

  function songDurationToTime(duration) {
    const minutes = Math.floor(duration / 60);
    const remainingSeconds = duration % 60;
    const beforeDecimal = remainingSeconds.toString().split(".")[0];

    return `${minutes}:${beforeDecimal.length === 1 ? `0${beforeDecimal}` : beforeDecimal
      }`;
  }

  async function fetchData() {
    try {
      const response = await fetchPlaylistData({ playlistId }).unwrap();
      setData(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleOnClick = async (item) => {
    try {
      if (songPlayerInfo.roomMode && songPlayerInfo.isRoomHost) {
        const response = await fetchSongData({ songId: item.id }).unwrap();
        socket.emit("playSong", response[0]);
      } else if (songPlayerInfo.roomMode && !songPlayerInfo.isRoomHost) {
        toast.error("You are not the host of the room");
      } else {
        const response = await fetchSongData({ songId: item.id }).unwrap();
        // console.log({ item: response[0] })
        dispatch(setCurrentSong({ item: response[0] }));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleBigPlayButton = () => {
    dispatch(clearQueue());
    for (let index = 0; index < data.songs.length; index++) {
      if (songPlayerInfo.songsQueue.length === 19) {
        toast.info("Queue is full");
        return;
      }
      dispatch(addToQueue({ item: data.songs[index] }));
    }
  };

  return (
    <>
      {loading ? (
        <SkeletonLoaderSong />
) : (
        <div>
          <div className="max-w-2xl mx-auto px-4">
            <FaCirclePlay
              onClick={handleBigPlayButton}
              className="text-6xl text-green-500 mx-auto hover:cursor-pointer"
            />
            <div className="album-name">
              <h4 className="text-white-800 text-xl py-8 font-semibold">
                {data.name}
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

              {data.songs.map((item, idx) => (
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
                    <Options index={idx} song={item} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default PlaylistScreen;