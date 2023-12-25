import { pool } from "../db.js"; 
import expressAsyncHandler from "express-async-handler";

const createPlaylist = expressAsyncHandler(async(req,res) =>{
    try {
        const {playlistName,userId} = req.body;
        const checkPlaylist = await pool.query("SELECT * FROM user_playlists WHERE title = ($1) AND user_id = ($2)",[playlistName,userId])
        if (checkPlaylist.rowCount !== 0) {
            throw new Error("Playlist Already Exists")
        }else{
            const createPlaylist = await pool.query("INSERT INTO user_playlists (user_id,title) VALUES ($1,$2)",[userId,playlistName])
            res.status(201);
            res.json(createPlaylist);
        }
        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const deletePlaylist = expressAsyncHandler(async(req,res) =>{
    try {
        const {playlistId} = req.body;
        const deletePlaylist = await pool.query("DELETE FROM user_playlists WHERE playlist_id = ($1)",[playlistId])
        res.status(201);
        res.json(deletePlaylist);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const getPlaylists = expressAsyncHandler(async(req,res) =>{
    try {
        const {userId} = req.params;
        const getPlaylists = await pool.query("SELECT * FROM user_playlists WHERE user_id = ($1)",[userId])
        res.status(201);
        res.json(getPlaylists);
        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const addSongToPlaylist = expressAsyncHandler(async(req,res) =>{
    try {
        const {playlistId,songId} = req.body;
        const checkSong = await pool.query("SELECT * FROM playlist_songs WHERE playlist_id = ($1) AND song_id = ($2)",[playlistId,songId])
        if (checkSong.rowCount !== 0) {
            throw new Error("Song Already Exists")
        }else{
            const addSong = await pool.query("INSERT INTO playlist_songs (playlist_id,song_id) VALUES ($1,$2)",[playlistId,songId])
            res.status(201);
            res.json(addSong);
        }
        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const removeSongFromPlaylist = expressAsyncHandler(async(req,res) =>{
    try {
        const {playlistId,songId} = req.body;
        const removeSong = await pool.query("DELETE FROM playlist_songs WHERE playlist_id = ($1) AND song_id = ($2)",[playlistId,songId]);
        res.status(201);
        res.json(removeSong);
        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const getPlaylistSongs = expressAsyncHandler(async(req,res) =>{
    try {
        const {playlistId} = req.params;
        const getPlaylistSongs = await pool.query("SELECT * FROM playlist_songs WHERE playlist_id = ($1)",[playlistId])
        res.status(201);
        res.json(getPlaylistSongs);
    } catch (error) {
        
    }
})

const getPlaylistTitle = expressAsyncHandler(async(req,res) =>{
    try {
        const {playlistId} = req.params;
        const getPlaylistTitle = await pool.query("SELECT * FROM user_playlists WHERE playlist_id = ($1)",[playlistId])
        res.status(201);
        res.json(getPlaylistTitle);
    } catch (error) {
        
    }
})


export {createPlaylist, deletePlaylist, getPlaylists, addSongToPlaylist, removeSongFromPlaylist, getPlaylistSongs, getPlaylistTitle}

// CREATE TABLE user_playlists (
//     playlist_id SERIAL PRIMARY KEY,
//     user_id INT NOT NULL,
//     title VARCHAR(100),
//     foreign KEY (user_id) references users(id)
// );

// CREATE TABLE playlist_songs(
//   playlist_id INT NOT NULL,
//   song_id VARCHAR(20),
//   foreign KEY (playlist_id) references user_playlists(playlist_id)
// );