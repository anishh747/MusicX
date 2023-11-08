import express from "express";
import { getSongData, getPlaylistData, getAlbumData, getSearchData, getArtistData } from "../controllers/musicController.js";

const router = express.Router();

router.get('/songs',getSongData);

router.get('/playlists',getPlaylistData);

router.get('/albums',getAlbumData);

router.get('/search',getSearchData);

router.get('/artist',getArtistData);

export default router;