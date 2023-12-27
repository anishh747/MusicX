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
// import { useSocket } from '../utils/socketContext';

const TrendingCard = (props) => {
  const [loading, setLoading] = useState(true);
  const [albumsData, setAlbumsData] = useState(props.data.albums); // Use state to manage the data
  const [songsData, setSongsData] = useState(props.data.songs);
  const [socket, setSocket] = useState(null);
  // const socket = useSocket();
  const [fetchSongData] = useSongDataMutation();
  const dispatch = useDispatch();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const roomInfo = useSelector((state) => state.room.roomInfo);
  const songPlayerInfo = useSelector((state) => state.songPlayer);

  useEffect(() => {
    const s = io(import.meta.env.VITE_REACT_API_URL);
    setSocket(s);
  }, []);

  useEffect(() => {
    if (socket !== null && roomInfo) {
      socket.emit("joinRoomCode", roomInfo?.room_id);
    }
  }, [socket, roomInfo]);

  const handleSongClick = async (item) => {
    try {
      if (songPlayerInfo?.roomMode && songPlayerInfo?.isRoomHost) {
        console.log("host clicked");
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
  };

  return (
    <>
      <div className="swiper-container px-3">
        <div className="container-title">
          <h1>Trending</h1>
        </div>

        <div className="swiper-caption">
          <h2>Songs</h2>
        </div>

        <Swiper
          slidesPerView={5}
          spaceBetween={30}
          navigation={true}
          loop={true}
          modules={[Pagination, Navigation]}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            942: {
              slidesPerView: 3,
            },
            1186: {
              slidesPerView: 4,
            },
            1430: {
              slidesPerView: 5,
            },
          }}
        >
          {/* Map through songsData */}
          {songsData.map((items, key) => (
            <SwiperSlide key={key} className="swiper-slide">
              <div className="card" onClick={() => handleSongClick(items)}>
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
                        className="full-text"
                        dangerouslySetInnerHTML={{
                          __html: items.name,
                        }}
                      />
                    )}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {items.primaryArtists[0].name}
                  </p>
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

        <div className="swiper-caption">
          <br />
          <h2>Albums</h2>
        </div>

        <Swiper
          slidesPerView={5}
          spaceBetween={30}
          navigation={true}
          loop={true}
          modules={[Pagination, Navigation]}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            942: {
              slidesPerView: 3,
            },
            1186: {
              slidesPerView: 4,
            },
            1430: {
              slidesPerView: 5,
            },
          }}
        >
          {/* Map through albumsData */}
          {albumsData.map((items, key) => (
            <SwiperSlide key={key} className="swiper-slide">
              <Link to={`album/${items.id}`}>
                <div className="card">
                  <div>
                    <img
                      src={items.image[2].link}
                      loading="lazy"
                      alt={items.image[2].link}
                      className="w-full h-48 rounded-t-md"
                    />
                    {hoveredIndex === key && (
                      <div className="play-overlay">
                        <button onClick={() => handleSongClick(items)}>
                          <FaPlayCircle className="play-button" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="pt-3 ml-4 mr-2 mb-3">
                    <h3 className="text-xl text-white-900">
                      {items.name.length > 18 ? (
                        <span
                          className="full-text"
                          dangerouslySetInnerHTML={{
                            __html: `${items.name.slice(0, 18)}...`,
                          }}
                        />
                      ) : (
                        <span
                          className="full-text"
                          dangerouslySetInnerHTML={{
                            __html: items.name,
                          }}
                        />
                      )}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {items.artists[0].name}
                    </p>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default TrendingCard;
