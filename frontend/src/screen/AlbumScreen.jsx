import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useAlbumsDataMutation,
  useSongDataMutation,
} from "../slices/songApiSlice";
import {
  setCurrentSong,
  playPause,
  addToQueue,
  playNextSong,
} from "../slices/songPlayerSlice";
import { useDispatch, useSelector } from "react-redux";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { FaCirclePlay } from "react-icons/fa6";
import "./albumScreen.css";

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

  const handleTripleDotClick = (key) => {
    for (let index = 0; index < data.songs.length; index++) {
      document.querySelector(`.dropdown-ul-${index}`).classList.add("hidden");
    }
    document.querySelector(`.dropdown-ul-${key}`).classList.toggle("hidden");
  };

  const handleAddToQueue = (item) => {
    console.log(item);
    dispatch(addToQueue({ item }));
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

                    {/* <BiDotsHorizontalRounded
                      onClick={() => {
                        handleTripleDotClick(idx);
                      }}
                      className=" text-2xl text-black-500"
                    />

                    <ul
                      className={`dropdown-ul-${idx} bg-white lg:absolute lg:border lg:rounded-md lg:text-sm lg:w-52 lg:shadow-md lg:space-y-0 lg:mt-0 hidden`}
                    >
                      <li>
                        <button
                          onClick={() => {
                            handleAddToQueue(item);
                          }}
                          className="block text-gray-600 lg:hover:bg-gray-50 lg:p-2.5"
                        >
                          Add to Queue
                        </button>
                        <button className="block text-gray-600 lg:hover:bg-gray-50 lg:p-2.5">
                          Add to Playlist
                        </button>
                        <button className="block text-gray-600 lg:hover:bg-gray-50 lg:p-2.5">
                          Add to Favourites
                        </button>
                      </li>
                    </ul> */}

                    <div class="dropdown">
                      <button>
                        <BiDotsHorizontalRounded className=" text-2xl text-black-500" />
                      </button>
                      <div class="dropdown-content">
                        <button
                          onClick={() => {
                            handleAddToQueue(item);
                          }}
                          className="block text-gray-600 lg:hover:bg-gray-50 lg:p-2.5"
                        >
                          Add to Queue
                        </button>
                        <button className="block text-gray-600 lg:hover:bg-gray-50 lg:p-2.5">
                          Add to Favourites
                        </button>
                        <button className="block text-gray-600 lg:hover:bg-gray-50 lg:p-2.5">
                          <div className="playlist-dropdown">
                            Add to Playlist
                            <div class="playlist-dropdown-content">
                              <button>p1</button>
                              <button>p1</button>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
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
