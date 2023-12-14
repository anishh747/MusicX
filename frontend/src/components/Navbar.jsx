import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";
import { useLogoutMutation } from "../slices/usersApiSlice";
import "./Navbar/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
              <a href="javascript:void(0)">View profile</a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;