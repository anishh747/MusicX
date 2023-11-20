import { useState, useEffect } from "react";
import { useHomePageDataMutation, useSongDataMutation } from "../slices/songApiSlice";
import { Link } from "react-router-dom";
import { setCurrentSong } from "../slices/songPlayerSlice";
import { useDispatch } from "react-redux";

const TrendingCard = () => {
  const [lang, setLanguage] = useState("english");
  const [loading, setLoading] = useState(true);
  const [albumsData, setAlbumsData] = useState([]); // Use state to manage the data
  const [songsData, setSongsData] = useState([]);
  const [fetchHomePageData, { isLoading }] = useHomePageDataMutation();
  const [fetchSongData] = useSongDataMutation();
  const dispatch = useDispatch();

  async function fetchData() {
    try {
      const response = await fetchHomePageData({ lang }).unwrap();
      setAlbumsData(response.trending.albums);
      setSongsData(response.trending.songs);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }


  async function handleSongClick(item){
    try {
      const response = await fetchSongData({ songId: item.id }).unwrap();
      // console.log(response[0])
      dispatch(setCurrentSong({ item: response[0] }));
    } catch (error) {
      console.error("Error fetching data:", error);
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
            <h1>Songs</h1>
          <div className="mt-12 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {songsData.map((items, key) => (
              <article onClick={()=>{handleSongClick(items)}} key={key} className="max-w-md mx-auto mt-4 shadow-lg border rounded-md duration-300 hover:shadow-sm">
                <img
                  src={items.image[2].link}
                  loading="lazy"
                  alt={items.image[2].link}
                  className="w-full h-48 rounded-t-md"
                />
                <div className="pt-3 ml-4 mr-2 mb-3">
                  <h3 className="text-xl text-gray-900">{items.name}</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {items.primaryArtists[0].name}
                  </p>
                </div>
              </article>
            ))}
            <br />
            <h1>Albums</h1>
            {albumsData.map((items, key) => (
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
