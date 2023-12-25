import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdOutlinePlaylistRemove } from "react-icons/md";
import { clearQueue } from '../slices/songPlayerSlice';

const NowPlaying = (props) => {
    const songPlayerInfo = useSelector((state) => state.songPlayer);
    const dispatch = useDispatch();

    const handleClearQueue = () => {
        dispatch(clearQueue());
    }

    return (
        <>
            {songPlayerInfo?.currentSong ? (
                <div className={`${props.display} h-[calc(100dvh-6rem)]`}>

                <div>
                    <h1 className='text-2xl'>Now Playing</h1>
                    <img src={songPlayerInfo?.currentSong?.item?.image[2].link} alt="" />
                    <p>{songPlayerInfo?.currentSong?.item.name}</p>
                    <p>{songPlayerInfo?.currentSong?.item.primaryArtists}</p>
                </div>
                <div className='flex justify-center'>
                    <h1 className='text-2xl'>Queue</h1>
                    <MdOutlinePlaylistRemove
                        onClick={handleClearQueue}
                        className="text-4xl text-green-500 mx-auto hover:cursor-pointer"
                    />
                </div>
                <div >
                    {
                        songPlayerInfo?.songsQueue?.map((song, idx) => {
                            return (
                                <div key={idx} className='border-2 flex'>
                                    <img src={song?.item.image[0].link} alt="" />
                                    <div>
                                        <p>{song?.item.name}</p>
                                        <p>{song?.item.primaryArtists}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            ) : (
                <></>
            )}
        </>


    )
}

export default NowPlaying