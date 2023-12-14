import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

const NowPlaying = (props) => {
    const songPlayerInfo = useSelector((state) => state.songPlayer);

    return (
        <div className={`${props.display} h-[calc(100dvh-6rem)]`}>
            <div>
                <h1 className='text-2xl'>Now Playing</h1>
                <img src={songPlayerInfo?.currentSong?.item?.image[2].link} alt="" />
                <p>{songPlayerInfo?.currentSong?.item.name}</p>
                <p>{songPlayerInfo?.currentSong?.item.primaryArtists}</p>
            </div>
                <h1 className='text-2xl'>Queue</h1>
            <div >
                {
                    songPlayerInfo?.songsQueue?.map((song, idx) => {
                        return (
                            <div key={idx} className='border-2 flex'>
                                <img src={song.item.image[0].link} alt="" />
                                <div>
                                <p>{song.item.name}</p>
                                <p>{song.item.primaryArtists}</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>

        
    )
}

export default NowPlaying