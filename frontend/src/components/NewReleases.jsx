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
import SongText from "./SongText";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "../App.css";
import "./TrendingCard/trendingCard.css";
// import s from "../utils/socket";
import { io } from "socket.io-client";
import { FaPlayCircle } from "react-icons/fa";

const NewReleases = (props) => {
  const [newReleasesData, setNewReleasesData] = useState(props.newReleases);
  const [socket, setSocket] = useState(null);
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
      <div className="swiper-container px-3">
        <div className="container-title">
          <h1>New Releases</h1>
        </div>

        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          navigation={true}
          loop={true}
          modules={[Pagination, Navigation]}
          breakpoints={{
            620: {
              slidesPerView: 2,
            },
            922: {
              slidesPerView: 3,
            },
            1212: {
              slidesPerView: 4,
            },
            1464: {
              slidesPerView: 5,
            },
            1732: {
              slidesPerView: 6,
            },
            2591: {
              slidesPerView: 7,
            }
          }}
        >
          {
            newReleasesData.map((items, key) => (
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
                    <SongText title={items.name} mode="white" card={true} />

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
            ))
          }
        </Swiper>
      </div >
    </>
  );
};

export default NewReleases;
