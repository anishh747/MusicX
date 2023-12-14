import express from "express";
import {createPlaylist, deletePlaylist, getPlaylists, addSongToPlaylist, removeSongFromPlaylist, getPlaylistSongs} from "../controllers/userPlaylistController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/createplaylist',createPlaylist);

router.delete('/deleteplaylist',deletePlaylist);

router.get('/getplaylists/:userId',getPlaylists);

router.post('/addsongtoplaylist',addSongToPlaylist);

router.delete('/removesongfromplaylist',removeSongFromPlaylist);

router.get('/getplaylistsongs/:playlistId',getPlaylistSongs);

export default router;