import React, { useEffect, useState } from "react";
import TrendingCard from "../components/TrendingCard";
import Charts from "../components/Charts";
import "../App.css";
import NewReleases from "../components/NewReleases";
import FeaturedPlaylist from "../components/FeaturedPlaylist";

const HomeScreen = () => {
  return (
    <div>
      <TrendingCard />
      <Charts />
      <NewReleases />
      <FeaturedPlaylist />
    </div>
  );
};

export default HomeScreen;
