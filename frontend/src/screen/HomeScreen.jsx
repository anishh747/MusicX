import React, { useEffect, useState } from "react";
import TrendingCard from "../components/TrendingCard";
import Charts from "../components/Charts";

const HomeScreen = () => {
  return (
    <>
      <TrendingCard />
      <Charts />
    </>
  );
};

export default HomeScreen;
