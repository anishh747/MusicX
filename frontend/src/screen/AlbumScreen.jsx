import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAlbumsDataMutation } from "../slices/songApiSlice";

const AlbumScreen = () => {
    const { id: albumId } = useParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [fetchAlbumsData, { isLoading }] = useAlbumsDataMutation();

    async function fetchData() {
        try {
            const response = await fetchAlbumsData({ albumId }).unwrap();
            setData(response);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }

    function songDurationToTime(duration) {
        const minutes = Math.floor(duration / 60);
        const remainingSeconds = duration % 60;
        const beforeDecimal = remainingSeconds.toString().split(".")[0];
    
        return `${minutes}:${
          beforeDecimal.length === 1 ? `0${beforeDecimal}` : beforeDecimal
        }`;
      }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            {loading ? (
                <div className="loading">
                    <h1>LOADING</h1>
                </div>
            ) : (
                <div>
                    <h1>LOADED</h1>
                    <div className="max-w-2xl mx-auto px-4">
                        <div className="items-start justify-between sm:flex">
                            <div>
                                <h4 className="text-gray-800 text-xl font-semibold">Songs</h4>
                            </div>
                        </div>
                        <ul className="mt-12 divide-y">
                            {
                                data.songs.map((item, idx) => (
                                    <li key={idx} className="py-5 flex items-start justify-between">
                                        <div className="flex gap-3">
                                            <h3>{idx + 1}</h3>
                                            <img src={item.image[2].link} className="flex-none w-12 h-12" />
                                            <div>
                                                <span className="block text-sm text-gray-700 font-semibold">{item.name}</span>
                                                <span className="block text-sm text-gray-600">{item.primaryArtists}</span>
                                            </div>
                                        </div>
                                        <h3>
                                            {songDurationToTime(item.duration)}
                                        </h3>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
};

export default AlbumScreen;
