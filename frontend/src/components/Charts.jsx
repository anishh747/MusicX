import React from "react";
import { useRef, useState, useEffect } from "react";
import {
  useHomePageDataMutation,
  useSongDataMutation,
} from "../slices/songApiSlice";
import { Link } from "react-router-dom";
import { setCurrentSong } from "../slices/songPlayerSlice";
import { useDispatch } from "react-redux";

const Charts = () => {
  const [lang, setLanguage] = useState("english");
  const [loading, setLoading] = useState(true);
  const [chartsData, setChartsData] = useState([]); // Use state to manage the data
  const [fetchHomePageData, { isLoading }] = useHomePageDataMutation();
  const [fetchSongData] = useSongDataMutation();
  const dispatch = useDispatch();

  async function fetchData() {
    try {
      const response = await fetchHomePageData({ lang }).unwrap();
      setChartsData(response.charts);
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
        <div>
          <section className="mt-12 mx-auto px-4 max-w-screen-xl md:px-8">
            <h1 className="text-2xl"> Top Charts</h1>
            <div className="bot">
              {chartsData.map((items, key) => (
                <article
                  key={key}
                  className="max-w-md mx-auto mt-4 shadow-lg border rounded-md duration-300 hover:shadow-sm"
                >
                  <Link to={`playlist/${items.id}`}>
                    <img
                      src={items.image[2].link}
                      loading="lazy"
                      alt={items.image[2].link}
                      className="w-full h-48 rounded-t-md"
                    />
                    <div className="pt-3 ml-4 mr-2 mb-3">
                      <h3 className="text-xl text-gray-900">{items.title}</h3>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default Charts;
