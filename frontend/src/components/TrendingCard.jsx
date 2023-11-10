import { useState, useEffect } from "react";
import { useHomePageDataMutation } from "../slices/songApiSlice";
import { Link } from "react-router-dom";

const TrendingCard = () => {
  const [lang, setLanguage] = useState("english");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]); // Use state to manage the data

  const [fetchHomePageData, { isLoading }] = useHomePageDataMutation();

  async function fetchData() {
    try {
      const response = await fetchHomePageData({ lang }).unwrap();
      setData(response.trending.albums);
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
        <section className="mt-12 mx-auto px-4 max-w-screen-xl md:px-8">
          {/* Rest of the component */}
          <div className="mt-12 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((items, key) => (
              <article
                className="max-w-md mx-auto mt-4 shadow-lg border rounded-md duration-300 hover:shadow-sm"
                key={key}
              >
                <Link to={`album/${items.id}`}>
                  <img
                    src={items.image[2].link}
                    loading="lazy"
                    alt={items.image[2].link}
                    className="w-full h-48 rounded-t-md"
                  />
                  <div className="pt-3 ml-4 mr-2 mb-3">
                    <h3 className="text-xl text-gray-900">{items.name}</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {items.artists[0].name}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default TrendingCard;
