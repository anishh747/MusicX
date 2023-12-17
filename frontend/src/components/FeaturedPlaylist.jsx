import React from "react";
import { useRef, useState, useEffect } from "react";
import {
  useHomePageDataMutation,
} from "../slices/songApiSlice";
import { Link } from "react-router-dom";
import "./Charts/charts.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Scrollbar } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

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
            <div className="grid grid-cols-4 lg-grid-cols-4 gap-10">
              {featuredPlaylistData.map((items, key) => (
                <article key={key} className="chart-card">
                  <Link to={`playlist/${items.id}`} className="flex flex-col">
                    <img
                      src={items.image[2].link}
                      loading="lazy"
                      alt={items.image[2].link}
                      className="w-full h-32 object-cover mb-2"
                    />
                    <div className="card-info">
                      <h3 className="text-lg font-semibold text-center">
                        {items.title}
                      </h3>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeaturedPlaylist;
