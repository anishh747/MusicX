import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useAlbumsDataMutation,
  useSongDataMutation,
} from "../slices/songApiSlice";
import { useGetPlaylistsMutation } from "../slices/playlistApiSlice";
import {
  setCurrentSong,
  playPause,
  addToQueue,
  playNextSong,
} from "../slices/songPlayerSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { FaCirclePlay } from "react-icons/fa6";
import Options from "../components/Options/Options";

const AlbumScreen = () => {
  const { id: albumId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [fetchAlbumsData, { isLoading }] = useAlbumsDataMutation();
  const [fetchSongData] = useSongDataMutation();
  const [fetchPlaylistsData] = useGetPlaylistsMutation();
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
    for (let index = 0; index < data.songs.length; index++) {
      dispatch(addToQueue({ item: data.songs[index] }));
    }
    dispatch(playNextSong());
  };

  return (
    <>
      {loading ? (
        <div className="loading"></div>
      ) : (
        <div>
          <div className="max-w-2xl mx-auto px-4">
            <FaCirclePlay
              onClick={handleBigPlayButton}
              className="text-6xl text-green-500 mx-auto hover:cursor-pointer"
            />
            <div className="items-start justify-between sm:flex">
              <div>
                <h4 className="text-gray-800 text-xl font-semibold">Songs</h4>
              </div>
            </div>
            <ul className="mt-12 divide-y">
              {data.songs.map((item, idx) => (
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
                      <span className="block text-sm text-gray-700 font-semibold">
                        {item.name}
                      </span>
                      <span className="block text-sm text-gray-600">
                        {item.primaryArtists}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-center items-center gap-4 my-auto">
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
