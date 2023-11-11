import React, { useState, useEffect, useRef } from "react";
import {
  BsFillPlayFill,
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
import { FiRepeat } from "react-icons/fi";
import { useSelector } from "react-redux";

function BottomMusicPlayer() {
  const [play, setPlay] = useState(false);
  const [mute, setMute] = useState(false);
  const [currentProgressBarTime, setCurrentProgressBarTime] = useState(0);
  const [currentProgressTime, setCurrentProgressTime] = useState("0:00");
  const [playingNow, setplayingNow] = useState(null); 
  const audioRef = useRef(null);
  const songAvatarRef = useRef(null);
  const currentSong = useSelector((state) => state.songPlayer.currentSong);
  
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
    if (currentSong !== undefined) {
      setplayingNow(currentSong?.item?.downloadUrl[0].link);
      console.log(currentSong?.item);
    }
  }, [currentSong]);

  useEffect(() => {
    if (playingNow !== null) {
      const audioElement = audioRef.current;
      const songAvatarImage = songAvatarRef.current;
  
      if (play) {
        audioElement.play();
        songAvatarImage.classList.add("song-avatar-rotate");
      } else {
        audioElement.pause();
        songAvatarImage.classList.remove("song-avatar-rotate");
      }
   
    }
    // return () => {
    //   audioElement.pause();
    // };
  }, [play]);

  const handleTimeUpdate = () => {
    if (playingNow !== null) {
      const currentTime = audioRef.current.currentTime;
      setCurrentProgressTime(songDurationToTime(currentTime));
      const duration = audioRef.current.duration;
      const progressBar = document.getElementById("progressBar");
      if (progressBar) {
        progressBar.value = (currentTime / duration) * 100;
        setCurrentProgressBarTime(progressBar.value);
      } 
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={playingNow}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setPlay(false)}
      />

      <div className="bottom-music-bar flex flex-row justify-around bg-gray-200 absolute w-screen bottom-0 right-0 z-50">
        <div className="left-player flex flex-row items-center gap-4">
          <img
            ref={songAvatarRef}
            className="song-avatar w-[6rem] h-[6rem] rounded-full"
            src="https://img.fruugo.com/product/2/42/492286422_max.jpg"
            alt="Song thumbnail"
          ></img>
          <div className="song-info">
            <p className="song-title">Song title</p>
            <p className="song-artist">Song artist</p>
          </div>
        </div>

        <div className="middle-player flex flex-col justify-between">
          <div className="flex items-center justify-center py-4">
            <div className="text-3xl mx-2">
              <AiOutlineHeart className="text-black" />
            </div>

            <div className="text-4xl mx-2">
              <BiSkipPrevious className="text-black" />
            </div>

            <div
              className="text-4xl cursor-pointer mx-2"
              onClick={() => setPlay(!play)}
            >
              <BsFillPlayFill className="text-black" />
            </div>

            <div className="text-4xl mx-2">
              <BiSkipNext className="text-black" />
            </div>

            <div className="text-3xl mx-2">
              <FiRepeat className="text-black" />
            </div>
          </div>

          <div className="musicProgressBar flex flex-row gap-2 justify-center items-center">
            <div className="text-3xl mx-2">
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
            <div className="text-3xl mx-2">
              <AiOutlineForward className="text-black" />
            </div>
          </div>
        </div>

        <div className="right-player flex flex-row items-center">
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
          <input type="range" className="volumeBar w-[100px]" />
        </div>
      </div>
    </>
  );
}

export default BottomMusicPlayer;
