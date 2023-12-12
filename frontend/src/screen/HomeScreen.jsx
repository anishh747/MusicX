import React, { useEffect, useState } from "react";
import TrendingCard from "../components/TrendingCard";
import Charts from "../components/Charts";
import "../App.css";

const HomeScreen = () => {
  return (
    <div>
      <TrendingCard />
      <Charts />
    </div>
  );
};

export default HomeScreen;
