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


function App() {
  const shouldShowBottomPlayer = !["/login", "/register"].includes(
    window.location.pathname
  );

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <div className="container overflow-hidden mx-auto">
          <Routes>
            <Route exact path="/" element={<HomeScreen />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path='/create-join' element={<CreateJoinRoom/>} />
            <Route exact path='/room/:id' element={<Room/>} />
            <Route exact path="/album/:id" element={<AlbumScreen />} />
            <Route exact path="/playlist/:id" element={<PlaylistScreen />} />
            <Route exact path="/artist/:id" element={<ArtistDetails />} />
            <Route exact path="/search/q/:query" element={<SearchResult />} />
          </Routes>
          {shouldShowBottomPlayer && <BottomMusicPlayer />}
        </div>
      </BrowserRouter>
      <ToastContainer />

    </>
  );
}

export default App;
