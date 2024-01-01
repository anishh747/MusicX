import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdOutlinePlaylistRemove } from 'react-icons/md';
import { clearQueue } from '../slices/songPlayerSlice';

const NowPlaying = (props) => {
  const songPlayerInfo = useSelector((state) => state.songPlayer);
  const dispatch = useDispatch();

  const handleClearQueue = () => {
    dispatch(clearQueue());
  };

  const songAvatarRef = useRef(null);

  useEffect(() => {
    const songAvatarImage = songAvatarRef.current;


    if (songAvatarImage) {
      if (songPlayerInfo.isPlaying) {
        songAvatarImage.classList.add('song-avatar-shake');
      } else {
        songAvatarImage.classList.remove('song-avatar-shake');
      }
    }
  }, [songPlayerInfo.isPlaying]);

  return (
    <>
      {songPlayerInfo?.currentSong ? (
        <div className={`${props.display} h-[calc(100dvh-6rem)] w-[25rem]`}>
          <div className="text-white text-center">
            <h1 className="text-2xl mb-2">Now Playing</h1>
            <div className="relative inline-block">
              <img
                ref={songAvatarRef}
                src={songPlayerInfo?.currentSong?.item?.image[1].link}
                alt=""
                className="rounded-full object-cover mt-4"
              />
              <div className="absolute inset-0 flex items-center justify-center"></div>
            </div>
            <p className="mt-2 text-lg font-bold">{songPlayerInfo?.currentSong?.item.name}</p>
            <p className="text-sm">{songPlayerInfo?.currentSong?.item.primaryArtists}</p>
          </div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl text-white">Queue</h1>
            <MdOutlinePlaylistRemove
              onClick={handleClearQueue}
              className="text-4xl text-green-500 hover:cursor-pointer"
            />
          </div>
          <div className="max-h-72 overflow-y-auto">
            {songPlayerInfo?.songsQueue?.map((song, idx) => (
              <div key={idx} className="border-solid border-2 border-gray-400 hover:border-dotted flex cursor-pointer p-2">
                <img src={song?.item.image[0].link} alt="" className="rounded-full mr-2" />
                <div>
                  <p className="text-sm font-bold text-white">{song?.item.name}</p>
                  <p className="text-xs text-gray-900 font-medium">{song?.item.primaryArtists}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default NowPlaying;
