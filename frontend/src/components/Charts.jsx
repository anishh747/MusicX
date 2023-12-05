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
            <h1 className="text-2xl px-28">Top Charts</h1>
            <div className="bot px-28 space-x-4">
              {chartsData.map((items, key) => (
                <article
                  key={key}
                  className="max-w-xl mx-auto mt-4 flex shadow-lg border rounded-md duration-300 hover:shadow-sm w-screen"
                >
                  <Link to={`playlist/${items.id}`} className="flex">
                    <img
                      src={items.image[2].link}
                      loading="lazy"
                      alt={items.image[2].link}
                      className="w-1/3 h-24 rounded-l-md ml-4"
                    />
                    <div className="flex-1 p-4">
                      <h3 className="text-xl text-gray-900">{items.title}</h3>
                      {/* Additional information can be added here */}
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
