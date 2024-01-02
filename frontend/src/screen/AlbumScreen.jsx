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
            <div key="1" className="max-w-md mx-auto rounded-xl  overflow-hidden md:max-w-2xl">
              <div className="md:flex">
                <div className="md:flex-shrink-0">
                  <img
                    alt="Album cover"
                    className="h-36 w-full object-cover md:w-36 rounded-full mt-4"
                    height="300"
                    src={data.image[1].link}
                    style={{
                      aspectRatio: "300/300",
                      objectFit: "cover",
                    }}
                    width="300"
                  />
                </div>
                <div className="p-8 pt-12">
                  <h2 className="mt-2 text-2xl leading-7 font-bold text-white">{data.name}</h2>
                  <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:shadow-outline-green focus:border-green-700 active:bg-green-700 transition ease-in-out duration-150 rounded-lg"
                    onClick={handleBigPlayButton}>
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                      <path
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                    Play All
                  </button>
                </div>
              </div>
            </div>
            <div className="items-start justify-between sm:flex">

            </div>
            <ul className="album-song-container">
              <li className="album-song-list">
                <div>
                  <h3>S.N</h3>
                  <div className="mx-8">
                    <span>Song Name</span>
                  </div>
                </div>
                <div>
                  <h3>Song Duration</h3>
                </div>
              </li>
              {data.songs.map((item, idx) => (
                <Song data={item} _key={idx} />
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default AlbumScreen;
