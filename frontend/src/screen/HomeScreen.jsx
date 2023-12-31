import React, { useEffect, useState } from "react";
import TrendingCard from "../components/TrendingCard";
import Charts from "../components/Charts";
import "../App.css";
import NewReleases from "../components/NewReleases";
import FeaturedPlaylist from "../components/FeaturedPlaylist";
import {
  useHomePageDataMutation,
} from "../slices/songApiSlice";
import SkeletonLoaderHome from "../components/SkeletonLoaders/SkeletonLoaderCard";

const HomeScreen = () => {
  const [lang, setLanguage] = useState("english");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [fetchHomePageData, { isLoading }] = useHomePageDataMutation();

  async function fetchData() {
    try {
      const response = await fetchHomePageData({ lang }).unwrap();
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

  return (
    <>
      {
        loading ? (
          <SkeletonLoaderHome />
          ) : (
          <div>
            <TrendingCard data={data.trending} />
            <Charts charts={data.charts}/>
            <NewReleases newReleases={data.albums}/>
            <FeaturedPlaylist featuredPlaylist={data.playlists}/>
          </div>
        )
      }
    </>
  );
};

export default HomeScreen;
