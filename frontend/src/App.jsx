import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import BottomMusicPlayer from "./components/BottomMusicPlayer";
import Navbar from "./components/Navbar";
import HomeScreen from "./screen/HomeScreen";
import AlbumScreen from "./screen/AlbumScreen";
import PlaylistScreen from "./screen/PlaylistScreen";
import Login from "./components/Login";
import Register from "./components/Register";
import SearchResult from "./components/SearchResult";
import ArtistDetails from "./components/ArtistDetails";
import CreateJoinRoom from './components/CreateJoinRoom';
import Room from './components/Room';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from "react-redux";
import { playPause, setHost, setRoomMode } from "./slices/songPlayerSlice";
import { useEffect } from "react";
// import { io } from "socket.io-client";
import s from "./utils/socket";

function App() {
  const dispatch = useDispatch();
  const roomInfo = useSelector((state) => state.room.roomInfo);
  const { userInfo } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(s);
  }, []);

  useEffect(() => {
    if((socket !== null) && roomInfo){
      socket.emit('joinRoomCode', roomInfo?.room_id);
    }
  }, [socket, roomInfo]);

  useEffect(() => {
    if(roomInfo){
      dispatch(setRoomMode(true));
    }
    if(userInfo?.email === roomInfo?.host_email) {
      dispatch(setHost(true));
    }
  }, [roomInfo]);


  const shouldShowBottomPlayer = !["/login", "/register"].includes(
    window.location.pathname
  );

  window.addEventListener('beforeunload', function (event) {
    dispatch(playPause(false));
  });

  return (
    <>
      <BrowserRouter>
        <div className="flex flex-row overflow-y-hidden">
          <Navbar />
          <div className="h-[100vh] overflow-x-scroll">
            <Routes>
              <Route exact path="/" element={<HomeScreen />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/register" element={<Register />} />
              <Route exact path='/create-join' element={<CreateJoinRoom />} />
              <Route exact path='/room/:id' element={<Room />} />
              <Route exact path="/album/:id" element={<AlbumScreen />} />
              <Route exact path="/playlist/:id" element={<PlaylistScreen />} />
              <Route exact path="/artist/:id" element={<ArtistDetails />} />
              <Route exact path="/search/q/:query" element={<SearchResult />} />
            </Routes>
            {shouldShowBottomPlayer && <BottomMusicPlayer />}
          </div>
        </div>
      </BrowserRouter>
      <ToastContainer />

    </>
  );
}

export default App;
