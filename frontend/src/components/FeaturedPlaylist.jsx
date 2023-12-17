import React from "react";
import { useRef, useState, useEffect } from "react";
import { useHomePageDataMutation } from "../slices/songApiSlice";
import { Link } from "react-router-dom";
import "./Charts/charts.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Scrollbar } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./TrendingCard/trendingCard.css";

const FeaturedPlaylist = () => {
  const [lang, setLanguage] = useState("english");
  const [loading, setLoading] = useState(true);
  const [featuredPlaylistData, setfeaturedPlaylistData] = useState([]); // Use state to manage the data
  const [fetchHomePageData, { isLoading }] = useHomePageDataMutation();

  async function fetchData() {
    try {
      const response = await fetchHomePageData({ lang }).unwrap();
      setfeaturedPlaylistData(response.playlists);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [lang]);

  return (
    <>
      {loading ? (
        <div className="loading">
          <h1>LOADING</h1>
        </div>
      ) : (
        <div className="charts-container">
          <div className="px-4">
            <div className="container-title">
              <h1 className="text-3xl font-bold mb-4">Featured Playlists</h1>
            </div>
            <Swiper
              slidesPerView={5}
              spaceBetween={30}
              navigation={true}
              modules={[Pagination, Navigation]}
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
      )}
    </>
  );
};

export default FeaturedPlaylist;
