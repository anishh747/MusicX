import React, { useEffect, useState } from "react";
import "./Options.css";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import {
  useAddSongToPlaylistMutation,
  useGetPlaylistsMutation,
} from "../../slices/playlistApiSlice";
import {
  useAlbumsDataMutation,
  useSongDataMutation,
} from "../../slices/songApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Options = (props) => {
  const [userPlaylists, setUserPlaylists] = useState();
  const [addSongToPlaylist] = useAddSongToPlaylistMutation();
  const [fetchAlbumsData, { isLoading }] = useAlbumsDataMutation();
  const [fetchPlaylistsData] = useGetPlaylistsMutation();
  const { userInfo } = useSelector((state) => state.auth);

  async function fetchData() {
    try {
      const playlistResponse = await fetchPlaylistsData(userInfo.id).unwrap();
      setUserPlaylists(playlistResponse.rows);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const handleAddToQueue = (item) => {
    console.log(item);
    dispatch(addToQueue({ item }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddToPlaylist = async (playlist, item) => {
    try {
      const response = await addSongToPlaylist({
        songId: item.id,
        playlistId: playlist.playlist_id,
      }).unwrap();
      console.log(response);
      toast.success("Song added to playlist");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="dropdown">
      <button>
        <BiDotsHorizontalRounded
          key={props.index}
          className=" text-2xl text-black-500"
        />
      </button>
      <div className="dropdown-content">
        <button
          onClick={() => {
            handleAddToQueue(props.song);
          }}
          className="block text-gray-600 lg:hover:bg-gray-50 lg:p-2.5"
        >
          Add to Queue
        </button>
        <button className="block text-gray-600 lg:hover:bg-gray-50 lg:p-2.5">
          Add to Favourites
        </button>
        <button className="block text-gray-600 lg:hover:bg-gray-50 lg:p-2.5">
          <div className="playlist-dropdown">
            Add to Playlist
            <div className="playlist-dropdown-content">
              {userPlaylists?.map((playlist) => (
                <p
                  key={props.index}
                  onClick={() => handleAddToPlaylist(playlist, props.song)}
                  className="block text-gray-600 lg:hover:bg-gray-50 lg:p-2.5"
                >
                  {playlist.title}
                </p>
              ))}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Options;
