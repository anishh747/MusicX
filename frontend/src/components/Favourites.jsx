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
import Song from "../components/Song";

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

  useEffect(() => {
    fetchData();
  }, []);

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
                  <Song data={item} _key={idx}/>
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
