import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useAlbumsDataMutation,
  useSongDataMutation,
} from "../slices/songApiSlice";
import {
  setCurrentSong,
  addToQueue,
  clearQueue,
} from "../slices/songPlayerSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { FaCirclePlay } from "react-icons/fa6";
import Options from "../components/Options/Options";
import SkeletonLoaderSong from "../components/SkeletonLoaders/SkeletonLoaderSong";

const AlbumScreen = () => {
  const { id: albumId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [fetchAlbumsData, { isLoading }] = useAlbumsDataMutation();
  const [fetchSongData] = useSongDataMutation();
  const dispatch = useDispatch();
  const songPlayerInfo = useSelector((state) => state.songPlayer);

  async function fetchData() {
    try {
      const response = await fetchAlbumsData({ albumId }).unwrap();
      setData(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  function songDurationToTime(duration) {
    const minutes = Math.floor(duration / 60);
    const remainingSeconds = duration % 60;
    const beforeDecimal = remainingSeconds.toString().split(".")[0];

    return `${minutes}:${
      beforeDecimal.length === 1 ? `0${beforeDecimal}` : beforeDecimal
    }`;
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
    dispatch(clearQueue())
    for (let index = 0; index < data.songs.length; index++) {
      if (songPlayerInfo.songsQueue.length === 19) {
        toast.info("Queue is full")
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
            <div className="items-start justify-between sm:flex">
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
                    <img src={item.image[2].link} />
                    <div>
                      <span>{item.name}</span>
                      <span>{item.primaryArtists}</span>
                    </div>
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

export default AlbumScreen;
