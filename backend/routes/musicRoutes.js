import express from "express";
import { getHomeData, getSongData, getPlaylistData, getAlbumData, getSearchData, getArtistData, addToFavourites, getFavourites } from "../controllers/musicController.js";

const router = express.Router();

router.post('/home',getHomeData);

router.post('/songs',getSongData);

router.post('/playlists',getPlaylistData);

router.post('/albums',getAlbumData);

router.post('/search',getSearchData);

router.post('/artist',getArtistData);

router.post('/favourite',addToFavourites);

router.get('/favourite',getFavourites);

export default router;