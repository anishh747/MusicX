import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import BottomMusicPlayer from "../components/BottomMusicPlayer";
import { useHomePageDataMutation } from "../slices/songApiSlice";

const HomeScreen = () => {
  const [loading, setLoading] = useState(true);
  const [lang, setLanguage] = useState("english");
  const [data, setData] = useState("");
  const [fetchHomePageData, { isLoading }] = useHomePageDataMutation();

  const fetchData = async () =>{
    const response = await fetchHomePageData({lang}).unwrap();
    console.log(response);
  }

  useEffect(() => {
    fetchData();
  }, [lang]);

  return <>

  </>;
};

export default HomeScreen;
