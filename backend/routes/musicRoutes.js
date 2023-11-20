import express from "express";
import { getHomeData, getSongData, getPlaylistData, getAlbumData, getSearchData, getArtistData, addToFavourites, removeFromFavourites, getFavourites } from "../controllers/musicController.js";

const router = express.Router();

router.post('/home',getHomeData);

router.post('/songs',getSongData);

router.post('/playlists',getPlaylistData);

router.post('/albums',getAlbumData);

router.post('/search',getSearchData);

router.post('/artist',getArtistData);

router.post('/favourite',addToFavourites);

router.delete('/favourite',removeFromFavourites);

router.get('/favourite/userId=:userId',getFavourites);

export default router;