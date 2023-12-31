import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";
import { useLogoutMutation } from "../slices/usersApiSlice";
import {
  useGetPlaylistsMutation,
  useCreatePlaylistMutation,
  useDeletePlaylistMutation,
} from "../slices/playlistApiSlice";
import "./Navbar/navbar.css";
import { MdPlaylistAdd } from "react-icons/md";
import { MdPlaylistPlay } from "react-icons/md";
import { VscAccount } from "react-icons/vsc";
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [playlistName, setPlaylistName] = useState("");
  const [userPlaylists, setUserPlaylists] = useState();
  const [fetchPlaylistsData] = useGetPlaylistsMutation();
  const [createPlaylist] = useCreatePlaylistMutation();
  const [deletePlaylist] = useDeletePlaylistMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [logoutMutation] = useLogoutMutation();
  const roomInfo = useSelector((state) => state.room.roomInfo);

  const handleLogoutButton = async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      if (userInfo) {
        try {
          const playlistResponse = await fetchPlaylistsData(
            userInfo.id
          ).unwrap();
          setUserPlaylists(playlistResponse.rows);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    }
    fetchData();
  }, [userInfo]);

  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const submitCreatePlaylist = async (e) => {
    e.preventDefault();
    try {
      const res = await createPlaylist({
        playlistName,
        userId: userInfo.id,
      }).unwrap();
      console.log(res);
      toast.success("Playlist created successfully");
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    try {
      const response = await deletePlaylist({
        playlistId,
      });

      if (response.error) {
        console.error("Error deleting playlist:", response.error);
      } else if (response.data) {
        console.log("Playlist deleted successfully:", response.data);
        toast.success("Playlist deleted successfully");
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <Link to={`/`}>
          <img src="../assets/musicx-logo.png" />
        </Link>
      </div>
      <nav className="sidebar-content">
        <div className="top-content">
          <ul>
            <li className="nav-link">
              <Link to={`/`}>
                <button className="home-btn">Home</button>
              </Link>
            </li>
            <li className="nav-link">
              {roomInfo ? (
                <Link to={`/room/${roomInfo.room_id}`}>
                  <button className="goto-room-btn">Go to Room</button>
                </Link>
              ) : (
                <Link to="create-join">
                  <button className="join-room-btn">Join Room</button>
                </Link>
              )}
            </li>
            <li className="nav-link">
              {userInfo ? (
                <Link to={`favourites`}>
                  <button className="favourite-btn">Favourites</button>
                </Link>
              ) : (
                <Link to="/login">
                  <button className="favourite-btn">Favourites</button>
                </Link>
              )}
            </li>
          </ul>
        </div>

        <div className="playlist-content p-4 text-white rounded-md">
          <div className="playlist-caption flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">My Playlists</h2>
            <button
              className="text-2xl hover:bg-green-600 transition-colors"
              onClick={openModal}
            >
              <MdPlaylistAdd />
            </button>
            {isModalOpen && (
              <div className="modal-content">
                <span className="close" onClick={closeModal}>
                  &times;
                </span>
                <h3 className="text-lg font-bold mb-2">Create Playlist</h3>
                <form onSubmit={submitCreatePlaylist}>
                  <label htmlFor="playlistName" className="block mb-2">
                    Playlist Name:
                  </label>
                  <input
                    type="text"
                    id="playlistName"
                    name="playlistName"
                    placeholder="Enter playlist name"
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                    className="w-full p-2 border border-gray-500 rounded-md mb-4 focus:outline-none focus:border-blue-500"
                  />
                  <div className="button-container">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600 transition-colors"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
          <div className="playlist-list">
            <ul className="list-none items-start">
              {userPlaylists &&
                userPlaylists.map((item) => (
                  <li
                    key={item.playlist_id}
                    className="mb-2 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <MdPlaylistPlay className="text-gray-500 mr-2 text-2xl" />
                      <Link
                        to={`myPlaylist/${item.playlist_id}`}
                        className="text-white-300 hover:underline transition-colors"
                      >
                        {item.title}
                      </Link>
                    </div>
                    <MdDelete
                      className="text-white-500 hover:text-red-600 cursor-pointer"
                      onClick={() => handleDeletePlaylist(item.playlist_id)}
                    />
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="bottom-content">
          <ul>
            <li className="nav-link">
              {userInfo ? (
                <button onClick={handleLogoutButton} className="logout-btn">
                  Log Out
                </button>
              ) : (
                <Link to="/login">
                  <button className="signin-btn">Sign In</button>
                </Link>
              )}
            </li>
          </ul>
        </div>

        {
          userInfo ? (
            <div className="profile-section">
              <div className="profile-info">
                <img
                  src="https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg"
                  className="profile-img"
                />
                <div>
                  <span>{userInfo.name}</span>
                  <Link to="/profile">View profile</Link>
                </div>  
              </div>
            </div>
          ):(
            <>
            </>
          )
        }
      </nav>
    </div>
  );
};

export default Navbar;
