import React, { useEffect, useState } from "react";
import {
  useGetFavouritesMutation,
  useSongDataMutation,
} from "../slices/songApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { clearQueue, setCurrentSong, addToQueue } from "../slices/songPlayerSlice";
import Options from "../components/Options/Options";
import { useNavigate } from "react-router-dom";
import { FaCirclePlay } from "react-icons/fa6";
import SkeletonLoaderSong from "../components/SkeletonLoaders/SkeletonLoaderSong";

const Favourites = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [fetchFavourites, { isLoading }] = useGetFavouritesMutation();
  const [fetchSongInfo] = useSongDataMutation();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const songPlayerInfo = useSelector((state) => state.songPlayer);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo]);

  async function getSongData(item) {
    try {
      const response = await fetchSongInfo({ songId: item }).unwrap();
      let newObj = response[0];
      setData((prev) => [...prev, newObj]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetchFavourites(userInfo.id).unwrap();
        for (let index = 0; index < response.length; index++) {
          getSongData(response[index].song_id);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  function songDurationToTime(duration) {
    const minutes = Math.floor(duration / 60);
    const remainingSeconds = duration % 60;
    const beforeDecimal = remainingSeconds.toString().split(".")[0];

    return `${minutes}:${beforeDecimal.length === 1 ? `0${beforeDecimal}` : beforeDecimal
      }`;
  }

  const handleOnClick = async (song) => {
    try {
      dispatch(setCurrentSong({ item: song }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleBigPlayButton = () => {
    dispatch(clearQueue());
    for (let index = 0; index < data.length; index++) {
      if (songPlayerInfo?.songsQueue?.length === 19) {
        toast.info("Queue is full")
        return;
      }
      dispatch(addToQueue({ item: data[index] }));
    }
  };

  return (
    <>
      <>
        {loading ? (
          <SkeletonLoaderSong />
        ) : (
          <div>
            <div className="max-w-2xl mx-auto px-4">
              <div className="album-name">
                <h4 className="text-white text-xl py-8 font-semibold">
                  Favourites
                </h4>
              </div>
              <FaCirclePlay
                onClick={handleBigPlayButton}
                className="text-6xl text-green-500 mx-auto hover:cursor-pointer"
              />
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
                {data.map((item, idx) => (
                  <li key={idx} className="album-song-list">
                    <div
                      onClick={() => {
                        handleOnClick(item);
                      }}
                    >
                      <h3>{idx + 1}</h3>

                      {
                        songPlayerInfo?.currentSong?.item?.id === item.id ? (
                          <>
                            <img className={songPlayerInfo?.isPlaying ? (`w-[25px]`) : (``)} src={songPlayerInfo?.isPlaying ? (`https://m.media-amazon.com/images/G/01/digital/music/player/web/EQ_accent.gif`) : (item.image[0].link)} alt="" />
                            <div>
                              <p className="text-sm font-bold text-green-400">{item.name}</p>
                              <p className="text-xs text-green-500 font-medium">{item.primaryArtists}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <img src={item.image[2].link} />
                            <div>
                              <p className="text-sm font-bold text-white">{item.name}</p>
                              <p className="text-xs text-white font-medium">{item.primaryArtists}</p>
                            </div>
                          </>
                        )
                      }
                    </div>
                    <div>
                      <h3>{songDurationToTime(item.duration)}</h3>
                      <Options index={idx} song={item} favourites={true} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </>
    </>
  );
};

export default Favourites;
