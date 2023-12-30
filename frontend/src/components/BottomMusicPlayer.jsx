import React, { useState, useEffect, useRef } from "react";
import "./BottomMusicPlayer/BottomMusicPlayer.css";
import {
  BsFillPlayFill,
  BsFillPauseFill,
  BsFillVolumeMuteFill,
  BsFillVolumeUpFill,
  BsVolumeDownFill,
} from "react-icons/bs";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineForward,
  AiOutlineBackward,
} from "react-icons/ai";
import { LuMonitorPlay } from "react-icons/lu";
import { FiRepeat, FiShuffle } from "react-icons/fi";
import { TbRepeatOnce } from "react-icons/tb";

import { PiShuffleBold } from "react-icons/pi";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  setCurrentSong,
  playPause,
  playNextSong,
  playPreviousSong,
  isNowPlayingView,
  toggleShuffle,
  toggleRepeatOneMode,
} from "../slices/songPlayerSlice";
import {
  useAddToFavouritesMutation,
  useRemoveFromFavouritesMutation,
  useGetFavouritesMutation,
} from "../slices/songApiSlice";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { useSocket } from '../utils/socketContext';
import s from "../utils/socket";
function BottomMusicPlayer() {
  const [play, setPlay] = useState(false);
  const [mute, setMute] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentProgressBarTime, setCurrentProgressBarTime] = useState(0);
  const [currentProgressTime, setCurrentProgressTime] = useState("0:00");
  const [currentSongIsFavourite, setCurrentSongIsFavourite] = useState(false);
  const [playingNow, setplayingNow] = useState(null);
  const [nowPlayingView, setNowPlayingView] = useState(false);
  const [socket, setSocket] = useState(null);
  // const socket = useSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const songAvatarRef = useRef(null);
  const songPlayerInfo = useSelector((state) => state.songPlayer);
  const currentSong = useSelector((state) => state.songPlayer.currentSong);
  const isPlaying = useSelector((state) => state.songPlayer.isPlaying);
  const progressBar = document.getElementById("progressBar");
  const { userInfo } = useSelector((state) => state.auth);
  const roomInfo = useSelector((state) => state.room.roomInfo);
  const [addToFavourites] = useAddToFavouritesMutation();
  const [getFavourites] = useGetFavouritesMutation();
  const [removeFromFavourites] = useRemoveFromFavouritesMutation();
  const isShuffleMode = useSelector((state) => state.songPlayer.isShuffleMode);
  const isRepeatOneMode = useSelector(
    (state) => state.songPlayer.isRepeatOneMode
  );

  useEffect(() => {
    setNowPlayingView(songPlayerInfo.nowPlayingView);
  }, [songPlayerInfo.nowPlayingView]);

  function songDurationToTime(duration) {
    if (duration === undefined) {
      return "0:00";
    }
    const minutes = Math.floor(duration / 60);
    const remainingSeconds = duration % 60;
    const beforeDecimal = remainingSeconds.toString().split(".")[0];

    return `${minutes}:${
      beforeDecimal.length === 1 ? `0${beforeDecimal}` : beforeDecimal
    }`;
  }

  useEffect(() => {
    const s = io(import.meta.env.VITE_REACT_API_URL);
    setSocket(s);
  }, []);

  useEffect(() => {
    if (socket !== null && roomInfo) {
      socket.emit("joinRoomCode", roomInfo?.room_id);
    }
  }, [socket, roomInfo]);

  useEffect(() => {
    if (currentSong !== undefined) {
      setplayingNow(currentSong?.item?.downloadUrl[4].link);
    }
  }, [currentSong]);

  useEffect(() => {
    setPlay(isPlaying);
    console.log("Is Playing: " + isPlaying);
    if (isPlaying === false) {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (playingNow !== null) {
      const audioElement = audioRef.current;
      const songAvatarImage = songAvatarRef.current;

      audioElement.volume = volume;
      if (play) {
        audioElement.play();
        songAvatarImage.classList.add("song-avatar-rotate");
      } else {
        audioElement.pause();
        songAvatarImage.classList.remove("song-avatar-rotate");
      }
    }
  }, [play, playingNow, volume]);

  const handleTimeUpdate = () => {
    if (playingNow !== null) {
      const currentTime = audioRef.current.currentTime;
      setCurrentProgressTime(songDurationToTime(currentTime));
      const duration = audioRef.current.duration;
      if (progressBar) {
        progressBar.value = (currentTime / duration) * 100;
        setCurrentProgressBarTime(progressBar.value);
      }
    }
  };

  const handlePlayPauseClick = () => {
    try {
      if (songPlayerInfo.roomMode && songPlayerInfo.isRoomHost) {
        socket.emit("playPause");
      } else if (songPlayerInfo.roomMode && !songPlayerInfo.isRoomHost) {
        toast.error("You are not the host of the room");
      } else {
        dispatch(playPause(!play));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleForwardSong = () => {
    if (currentSong !== undefined) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      const forwardOffset = 5;

      if (currentTime + forwardOffset < duration) {
        const updatedTime = currentTime + forwardOffset;
        progressBar.value = (updatedTime / duration) * 100;
        setCurrentProgressBarTime(progressBar.value);
        audioRef.current.currentTime = updatedTime;
      }
    }
  };

  const handleBackwardSong = () => {
    if (currentSong !== undefined) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      const backwardOffset = 5;

      if (currentTime - backwardOffset > 0) {
        const updatedTime = currentTime - backwardOffset;
        progressBar.value = (updatedTime / duration) * 100;
        setCurrentProgressBarTime(progressBar.value);
        audioRef.current.currentTime = updatedTime;
      }
    }
  };

  const handleToggleRepeatOneMode = () => {
    dispatch(toggleRepeatOneMode());
  };

  const handleToggleShuffle = () => {
    dispatch(toggleShuffle());
  };

  const handleNextSongClick = () => {
    try {
      if (songPlayerInfo.roomMode && songPlayerInfo.isRoomHost) {
        socket.emit("playNextSong");
      } else if (songPlayerInfo.roomMode && !songPlayerInfo.isRoomHost) {
        toast.error("You are not the host of the room");
      } else {
        if (isRepeatOneMode) {
          audioRef.current.currentTime = 0; // Restart the current song
        } else {
          dispatch(playNextSong());
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handlePreviousSongClick = () => {
    try {
      if (songPlayerInfo.roomMode && songPlayerInfo.isRoomHost) {
        socket.emit("playPreviousSong");
      } else if (songPlayerInfo.roomMode && !songPlayerInfo.isRoomHost) {
        toast.error("You are not the host of the room");
      } else {
        if (isRepeatOneMode) {
          audioRef.current.currentTime = 0; // Restart the current song
        } else {
          dispatch(playPreviousSong());
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAfterSongEnds = () => {
    dispatch(playNextSong());
  };

  const toggleFavourite = async () => {
    if (!userInfo) {
      navigate("/login");
    } else if (currentSong !== null) {
      setCurrentSongIsFavourite(!currentSongIsFavourite);
      let songId = currentSong?.item?.id;
      let userId = userInfo?.id;
      if (currentSongIsFavourite) {
        const remove = await removeFromFavourites({ songId, userId }).unwrap();
      } else {
        const add = await addToFavourites({ songId, userId }).unwrap();
      }
      setCurrentSongIsFavourite(!currentSongIsFavourite);
    } else {
    }
  };

  useEffect(() => {
    setCurrentSongIsFavourite(false);
    async function fetchFavourites() {
      if (userInfo) {
        let userId = userInfo?.id;
        const favourites = await getFavourites(userId).unwrap();
        console.log(currentSong?.item?.id);
        if (currentSong !== null) {
          for (let index = 0; index < favourites.length; index++) {
            if (favourites[index].song_id === currentSong?.item?.id) {
              setCurrentSongIsFavourite(true);
              break;
            }
          }
        }
      }
    }
    fetchFavourites();
  }, [userInfo, currentSong]);

  useEffect(() => {
    if (mute) {
      audioRef.current.volume = 0;
    } else {
      audioRef.current.volume = volume;
    }
  }, [mute]);

  useEffect(() => {
    if (socket !== null) {
      const handlePlaySong = (data) => {
        dispatch(setCurrentSong({ item: data }));
      };

      const handlePlayPause = () => {
        console.log("playPause socket");
        console.log("Play:" + play);
        dispatch(playPause(!play));
      };

      const handlePlayNextSong = () => {
        dispatch(playNextSong());
      };

      const handlePlayPreviousSong = () => {
        dispatch(playPreviousSong());
      };

      socket.on("playSong", handlePlaySong);
      socket.on("playPause", handlePlayPause);
      socket.on("playNextSong", handlePlayNextSong);
      socket.on("playPreviousSong", handlePlayPreviousSong);

      return () => {
        // Clean up the event listeners when the component unmounts or when socket changes
        socket.off("playSong", handlePlaySong);
        socket.off("playPause", handlePlayPause);
        socket.off("playNextSong", handlePlayNextSong);
        socket.off("playPreviousSong", handlePlayPreviousSong);
      };
    }
  }, [socket, dispatch, play, playNextSong, playPreviousSong, setCurrentSong]);

  return (
    <>
      <div>
        <audio
          ref={audioRef}
          src={playingNow}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleAfterSongEnds}
        />

        <div className="bottom-music-bar">
          <div className=" h-[6rem] bottom-music-bar flex flex-row justify-around  bg-gray-200 fixed w-screen bottom-0 right-0 z-40">
            <div className="left-player flex flex-row items-center gap-4">
              {/* Display the song image in the bottom bar */}
              <img
                ref={songAvatarRef}
                className="song-avatar w-[4.5rem] h-[4.5rem] rounded-full"
                src={
                  currentSong?.item?.image[2].link ||
                  "https://img.fruugo.com/product/2/42/492286422_max.jpg"
                }
                alt="Song thumbnail"
              />
              <div className="song-info">
                <p className="song-title">{currentSong?.item?.name}</p>
                <p className="song-artist">
                  {currentSong?.item?.primaryArtists}
                </p>
              </div>
            </div>

            <div className="middle-player flex flex-col justify-between">
              <div className="flex items-center justify-center py-4">
                <div onClick={toggleFavourite} className="text-3xl mx-2">
                  {currentSongIsFavourite ? (
                    <AiFillHeart className="text-black" />
                  ) : (
                    <AiOutlineHeart className="text-black" />
                  )}
                </div>

                <div
                  onClick={handlePreviousSongClick}
                  className="text-4xl mx-2"
                >
                  <BiSkipPrevious className="text-black" />
                </div>

                <div
                  className="text-4xl cursor-pointer mx-2"
                  onClick={handlePlayPauseClick}
                >
                  {play ? (
                    <BsFillPauseFill className="text-black" />
                  ) : (
                    <BsFillPlayFill className="text-black" />
                  )}
                </div>

                <div onClick={handleNextSongClick} className="text-4xl mx-2">
                  <BiSkipNext className="text-black" />
                </div>

                {isRepeatOneMode ? (
                  <TbRepeatOnce
                    className="text-3xl mx-2 text-sky-400"
                    onClick={handleToggleRepeatOneMode}
                  />
                ) : (
                  <FiRepeat
                    className="text-3xl mx-2 text-black"
                    onClick={handleToggleRepeatOneMode}
                  />
                )}

                <div
                  onClick={handleToggleShuffle}
                  className={`text-3xl mx-2 text-black ${
                    isShuffleMode ? "font-bold text-sky-400" : ""
                  }`}
                >
                  {isShuffleMode ? <PiShuffleBold /> : <PiShuffleBold />}
                </div>
              </div>
              <div className="musicProgressBar flex flex-row gap-2 justify-center items-center">
                <div onClick={handleBackwardSong} className="text-3xl mx-2">
                  <AiOutlineBackward className="text-black" />
                </div>
                <p>{currentProgressTime}</p>
                <input
                  id="progressBar"
                  className="w-[40vw]"
                  type="range"
                  value={currentProgressBarTime}
                  onChange={(e) => {
                    const newTime =
                      (e.target.value * audioRef.current.duration) / 100;
                    audioRef.current.currentTime = newTime;
                  }}
                />
                <p>{songDurationToTime(currentSong?.item?.duration)}</p>
                <div onClick={handleForwardSong} className="text-3xl mx-2">
                  <AiOutlineForward className="text-black" />
                </div>
              </div>
            </div>

            <div className="right-player flex flex-row items-center">
              {nowPlayingView ? (
                <LuMonitorPlay
                  onClick={() => dispatch(isNowPlayingView(!nowPlayingView))}
                  className="text-3xl mr-4 text-green-600"
                />
              ) : (
                <LuMonitorPlay
                  onClick={() => dispatch(isNowPlayingView(!nowPlayingView))}
                  className="text-3xl mr-4"
                />
              )}
              <div
                className="text-3xl"
                onClick={() => {
                  setMute(!mute);
                }}
              >
                {mute ? (
                  <BsFillVolumeMuteFill className="text-black" />
                ) : (
                  <BsFillVolumeUpFill className="text-black" />
                )}
              </div>
              <input
                type="range"
                className="volumeBar w-[100px]"
                value={mute ? 0 : volume * 100}
                onChange={(e) => {
                  const newVolume = e.target.value / 100;
                  setVolume(newVolume);
                  setMute(false); // Unmute when adjusting volume
                }}
                disabled={mute}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BottomMusicPlayer;
