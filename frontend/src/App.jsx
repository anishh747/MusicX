import { useState } from 'react'
import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import './App.css'
import BottomMusicPlayer from './components/BottomMusicPlayer'
import Navbar from './components/Navbar'
import HomeScreen from './screen/HomeScreen';
import AlbumScreen from './screen/AlbumScreen';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <BrowserRouter>
          <Navbar />
          <div className="container overflow-hidden">
            <Routes>
              <Route exact path='/' element={<HomeScreen/>} />
              <Route exact path='/album/:id' element={<AlbumScreen/>} />
            </Routes>
          <BottomMusicPlayer />
          </div>
        </BrowserRouter>
    </>
  )
}

export default App
