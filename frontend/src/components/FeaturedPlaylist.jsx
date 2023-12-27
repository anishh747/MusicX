import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Charts/charts.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./TrendingCard/trendingCard.css";

const FeaturedPlaylist = (props) => {
  const [featuredPlaylistData, setfeaturedPlaylistData] = useState(
    props.featuredPlaylist
  ); // Use state to manage the data

  return (
    <>
      <div className="charts-container">
        <div className="px-4">
          <div className="container-title">
            <h1 className="text-3xl font-bold mb-4">Featured Playlists</h1>
          </div>
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            loop={true}
            navigation={true}
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
            {featuredPlaylistData.map((items, key) => (
              <SwiperSlide key={key} className="swiper-slide">
                <Link to={`playlist/${items.id}`}>
                  <div className="card">
                    <img
                      src={items.image[2].link}
                      loading="lazy"
                      alt={items.image[2].link}
                      className="w-full h-32 object-cover mb-2"
                    />
                    <div className="full-text py-3">
                      <h3>
                        {items.title.length > 20 ? (
                          <span
                            className="full-text"
                            dangerouslySetInnerHTML={{
                              __html: `${items.title.slice(0, 20)}...`,
                            }}
                          />
                        ) : (
                          <span
                            className="full-text"
                            dangerouslySetInnerHTML={{
                              __html: items.title,
                            }}
                          />
                        )}
                      </h3>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default FeaturedPlaylist;
