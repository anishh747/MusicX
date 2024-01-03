import React, { useEffect, useState } from "react";
import "./Options.css";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import {
  useAddSongToPlaylistMutation,
  useGetPlaylistsMutation,
  useRemoveSongFromPlaylistMutation
} from "../../slices/playlistApiSlice";
import {
  useAddToFavouritesMutation,
  useRemoveFromFavouritesMutation
} from "../../slices/songApiSlice";
import { addToQueue } from "../../slices/songPlayerSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";

const Options = (props) => {
  const dispatch = useDispatch();
  const [userPlaylists, setUserPlaylists] = useState();
  const [addSongToPlaylist] = useAddSongToPlaylistMutation();
  const [removeSongFromPlaylist] = useRemoveSongFromPlaylistMutation();
  const [fetchPlaylistsData] = useGetPlaylistsMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [addToFavourites] = useAddToFavouritesMutation();
  const [removeFromFavourites] = useRemoveFromFavouritesMutation();
  const [socket, setSocket] = useState(null);
  const roomInfo = useSelector((state) => state.room.roomInfo);

  useEffect(() => {
    const s = io(import.meta.env.VITE_REACT_API_URL);
    setSocket(s);
  }, []);

  useEffect(() => {
    if (socket !== null && roomInfo) {
      socket.emit("joinRoomCode", {room_id: roomInfo?.room_id, username: userInfo?.name});
    }
  }, [socket, roomInfo]);

  async function fetchData() {
    try {
      if (userInfo) {
        const playlistResponse = await fetchPlaylistsData(userInfo.id).unwrap();
        setUserPlaylists(playlistResponse.rows);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const handleAddToQueue = (item) => {
    if(roomInfo) {
      socket.emit("addToQueue", {item});
    }else {
      console.log("ADDD TO QUEUEUEUE")
      dispatch(addToQueue({ item }));
    }
  };


  const handleAddToPlaylist = async (playlist, item) => {
    try {
      const response = await addSongToPlaylist({
        songId: item.id,
        playlistId: playlist.playlist_id,
      }).unwrap();
      console.log(response);
      toast.success("Song added to playlist");
    } catch (error) {
      toast.error("Song already exists");
      console.log(error.message);
    }
  };

  const handleAddToFavourites = async () => {
    const add = await addToFavourites({ songId: props.song.id, userId: userInfo.id }).unwrap();
    toast.success("Song added to favourites");
  }

  const handleRemoveFromFavourites = async () => {
    const remove = await removeFromFavourites({ songId: props.song.id, userId: userInfo.id }).unwrap();
    toast.success("Song removed to favourites");
  }

  const handleRemoveSongFromPlaylist = async () => {
    const remove = await removeSongFromPlaylist({playlistId: props.playlistID , songId: props.song.id}).unwrap();
    toast.success("Song removed from playlist");
  }

  useEffect(() => {
    fetchData();
  }, []);

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
        {
          props.favourites ? (
            <button onClick={handleRemoveFromFavourites} className="block text-gray-600 lg:hover:bg-gray-50 lg:p-2.5">
              Remove from  Favourites
            </button>
          ) : (
            <button onClick={handleAddToFavourites} className="block text-gray-600 lg:hover:bg-gray-50 lg:p-2.5">
              Add to Favourites
            </button>
          )
        }

        {
          props.myPlaylist ? (
            <button onClick={handleRemoveSongFromPlaylist} className="block text-gray-600 lg:hover:bg-gray-50 lg:p-2.5">
              Remove from Playlist
            </button>
          ) : (
            <button className="block text-gray-600 lg:hover:bg-gray-50 lg:p-2.5">
              <div className="playlist-dropdown">
                Add to Playlist
                <div className="playlist-dropdown-content">
                  {userPlaylists?.map((playlist, idx) => (
                    <p
                      key={idx}
                      onClick={() => handleAddToPlaylist(playlist, props.song)}
                      className="block text-gray-600 lg:hover:bg-gray-50 lg:p-2.5"
                    >
                      {playlist.title}
                    </p>
                  ))}
                </div>
              </div>
            </button>
          )
        }
      </div>
    </div>
  );
};

export default Options;
