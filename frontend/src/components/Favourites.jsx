import React, { useEffect, useState } from 'react'
import { useGetFavouritesMutation, useSongDataMutation } from '../slices/songApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentSong } from '../slices/songPlayerSlice';

const Favourites = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [fetchFavourites, { isLoading }] = useGetFavouritesMutation();  
    const [fetchSongInfo] = useSongDataMutation();
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);

    
    async function getSongData(item) {
        try {
          const response = await fetchSongInfo({ songId: item }).unwrap();
          let newObj = response[0];
          setData((prev) => [ ...prev, newObj ]);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
    }
    
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetchFavourites(userInfo.id).unwrap();
                for (let index = 0; index < response.length; index++) {
                    getSongData(response[index].song_id)
                }   
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    },[])

    function songDurationToTime(duration) {
        const minutes = Math.floor(duration / 60);
        const remainingSeconds = duration % 60;
        const beforeDecimal = remainingSeconds.toString().split(".")[0];
    
        return `${minutes}:${
          beforeDecimal.length === 1 ? `0${beforeDecimal}` : beforeDecimal
        }`;
    }
      
    

    const handleOnClick = async (song) => {
        try {
            dispatch(setCurrentSong({ item: song }));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    

  return (
    <>
            <>
    {loading ? (
        <div className="loading"></div>
      ) : (
        <div>
          <div className="max-w-2xl mx-auto px-4">
            <div className="items-start justify-between sm:flex">
              <div>
                <h4 className="text-gray-800 text-xl font-semibold">Songs</h4>
              </div>
            </div>
            <ul className="mt-12 divide-y">
              {data.map((item, idx) => (
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
                        {item.song_id}
                      </span>
                      <span className="block text-sm text-gray-600">
                        {item.primaryArtists}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-center items-center gap-4 my-auto">
                    <h3>{songDurationToTime(item.duration)}</h3>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
    </>
    )
}

export default Favourites