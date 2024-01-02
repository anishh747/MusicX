import React, { useState, useEffect } from 'react'
import Options from './Options/Options';
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentSong } from '../slices/songPlayerSlice';
import { useSongDataMutation } from '../slices/songApiSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { io } from "socket.io-client";
import SongText from './SongText';

const Song = (props) => {
  const songPlayerInfo = useSelector((state) => state.songPlayer);
  const dispatch = useDispatch();
  const [fetchSongData] = useSongDataMutation();
  const [socket, setSocket] = useState(null);

  function songDurationToTime(duration) {
    const minutes = Math.floor(duration / 60);
    const remainingSeconds = duration % 60;
    const beforeDecimal = remainingSeconds.toString().split(".")[0];

    return `${minutes}:${beforeDecimal.length === 1 ? `0${beforeDecimal}` : beforeDecimal
      }`;
  }

  useEffect(() => {
    const s = io(import.meta.env.VITE_REACT_API_URL);
    setSocket(s);
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
  return (
    <>
      <li onClick={() => { handleOnClick(props.data) }} key={props._key} className="album-song-list">
        <div>
          <h3>{props._key + 1}</h3>
          {
            songPlayerInfo?.currentSong?.item?.id === props.data.id ? (
              <>
                <img className={songPlayerInfo?.isPlaying ? (`p-2`) : (``)} src={songPlayerInfo?.isPlaying ? (`https://m.media-amazon.com/images/G/01/digital/music/player/web/EQ_accent.gif`) : (props.data.image[0].link)} alt="" />
                <div>
                  <SongText className="text-sm font-bold text-green-400" card={false} title={props.data.name} mode="green" />
                  <p className="text-xs text-green-500 font-medium">{props.data.primaryArtists}</p>
                </div>
              </>
            ) : (
              <>
                <img src={props.data.image[2].link} />
                <div>
                  <SongText className="text-sm font-bold text-white" card={false} title={props.data.name} />
                  <p className="text-xs text-white font-medium">{props.data.primaryArtists}</p>
                </div>
              </>
            )
          }
        </div>
        <div>
          <h3>{songDurationToTime(props.data.duration)}</h3>
          <Options index={props._key} song={props.data} />
        </div>
      </li>
    </>
  );
}

export default Song