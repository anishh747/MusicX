import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useAlbumsDataMutation,
  useSongDataMutation,
} from "../slices/songApiSlice";
import {
  setCurrentSong,
  addToQueue,
  clearQueue,
} from "../slices/songPlayerSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { FaCirclePlay } from "react-icons/fa6";
import Options from "../components/Options/Options";
import SkeletonLoaderSong from "../components/SkeletonLoaders/SkeletonLoaderSong";
import Song from "../components/Song";

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

  useEffect(() => {
    fetchData();
  }, []);

  const handleBigPlayButton = () => {
    dispatch(clearQueue())
    for (let index = 0; index < data.songs.length; index++) {
      if (songPlayerInfo.songsQueue.length === 19) {
        toast.info("Queue is full")
        return;
      }
      dispatch(addToQueue({ item: data.songs[index] }));
    }
  };

  return (
    <>
      {loading ? (
        <SkeletonLoaderSong />
      ) : (
        <div>
          <div className="max-w-2xl mx-auto px-4">
            <FaCirclePlay
              onClick={handleBigPlayButton}
              className="text-6xl text-green-500 mx-auto hover:cursor-pointer"
            />
            <div className="items-start justify-between sm:flex">
              <h4 className="text-white-800 text-xl py-8 font-semibold">
                {data.name}
              </h4>
            </div>
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
              {data.songs.map((item, idx) => (
                <Song data={item} _key={idx}/>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default AlbumScreen;
