import { useRef, useState, useEffect } from "react";
import {
  useHomePageDataMutation,
  useSongDataMutation,
} from "../slices/songApiSlice";
import { Link } from "react-router-dom";
import { setCurrentSong } from "../slices/songPlayerSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Scrollbar } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "../App.css";
import "./TrendingCard/trendingCard.css";
// import s from "../utils/socket";
import { io } from "socket.io-client";
import { FaPlayCircle } from "react-icons/fa";

const NewReleases = () => {
  const [lang, setLanguage] = useState("english");
  const [loading, setLoading] = useState(true);
  const [newReleasesData, setNewReleasesData] = useState([]);
  const [socket, setSocket] = useState(null);
  const [fetchHomePageData, { isLoading }] = useHomePageDataMutation();
  const [fetchSongData] = useSongDataMutation();
  const dispatch = useDispatch();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const roomInfo = useSelector((state) => state.room.roomInfo);
  const songPlayerInfo = useSelector((state) => state.songPlayer);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };
  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  useEffect(() => {
    const s = io(import.meta.env.VITE_REACT_API_URL);
    setSocket(s);
  }, []);

  useEffect(() => {
    if (socket !== null && roomInfo) {
      socket.emit("joinRoomCode", roomInfo?.room_id);
    }
  }, [socket, roomInfo]);

  async function fetchData() {
    try {
      const res = await fetchHomePageData({ lang }).unwrap();
      setNewReleasesData(res.albums);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log(newReleasesData);
  }, [newReleasesData]);

  async function handleSongClick(item) {
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
  }

  return (
    <>
      {loading ? (
        <div className="loading">
          <h1>LOADING</h1>
        </div>
      ) : (
        <div className="swiper-container px-3">
          <div className="container-title">
            <h1>New Releases</h1>
          </div>

          <Swiper
            slidesPerView={5}
            spaceBetween={30}
            navigation={true}
            modules={[Pagination, Navigation]}
          >
            {newReleasesData.map((items, key) => (
              <SwiperSlide key={key} className="swiper-slide">
                <div
                  className="card"
                  onClick={() => handleSongClick(items)}
                  onMouseEnter={() => handleMouseEnter(key)}
                  onMouseLeave={() => handleMouseLeave(key)}
                >
                  <img
                    src={items.image[2].link}
                    loading="lazy"
                    alt={items.image[2].link}
                    className="w-full h-48 rounded-t-md"
                  />
                  <div className="pt-3 ml-4 mr-2 mb-3">
                    <h3 className="text-xl text-white-900">
                      {items.name.length > 12 ? (
                        <span
                          className="full-text"
                          dangerouslySetInnerHTML={{
                            __html: `${items.name.slice(0, 12)}...`,
                          }}
                        />
                      ) : (
                        <span
                          className="full-text py-3"
                          dangerouslySetInnerHTML={{
                            __html: items.name,
                          }}
                        />
                      )}
                    </h3>
                    {hoveredIndex === key && (
                      <div className="play-overlay">
                        <button onClick={() => handleSongClick(items)}>
                          <FaPlayCircle className="play-button" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </>
  );
};

export default NewReleases;
