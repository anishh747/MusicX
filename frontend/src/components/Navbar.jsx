import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { useGetPlaylistsMutation, useCreatePlaylistMutation } from "../slices/playlistApiSlice";
import "./Navbar/navbar.css";
import { MdPlaylistAdd } from "react-icons/md";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [playlistName, setPlaylistName] = useState("");
  const [userPlaylists, setUserPlaylists] = useState();
  const [fetchPlaylistsData] = useGetPlaylistsMutation();
  const [createPlaylist] = useCreatePlaylistMutation();
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
      try {
        const playlistResponse = await fetchPlaylistsData(userInfo.id).unwrap();
        setUserPlaylists(playlistResponse.rows);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

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
      const res = await createPlaylist({ playlistName,userId: userInfo.id }).unwrap();
      console.log(res);
      closeModal();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="sidebar">
      <div className="logo">
        <Link to={`/`}>
          <img src="../src/assets/musicx-logo.png" />
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
          </ul>
        </div>

        <div className="playlist-content">
          <div className="playlist-caption">
            <h2>My playlists</h2>
            <button className="text-2xl" onClick={openModal}>
              <MdPlaylistAdd />
            </button>
            {isModalOpen && (
              <div className="modal-content">
                <span className="close" onClick={closeModal}>
                  &times;
                </span>
                <h3>Create Playlist</h3>
                <form onSubmit={submitCreatePlaylist}>
                  <label htmlFor="playlistName">Playlist Name:</label>
                  <input
                    type="text"
                    id="playlistName"
                    name="playlistName"
                    placeholder="Enter playlist name"
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                  />
                  <div className="button-container">
                    <button type="submit">Submit</button>
                    <button type="button" onClick={closeModal}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
          <div className="playlist-list">
            <ul>
              {
                userPlaylists && userPlaylists.map((item) => (
                  <li key={item.playlist_id}>
                    <Link to={`myPlaylist/${item.playlist_id}`}>{item.title}</Link>
                  </li>
                ))
              }
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

        <div className="profile-section">
          <div className="profile-info">
            <img
              src="https://randomuser.me/api/portraits/women/79.jpg"
              className="profile-img"
            />
            <div>
              <span>Alivika Tony</span>
              <a href="">View profile</a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
