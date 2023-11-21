import expressAsyncHandler from "express-async-handler";
import { pool } from "../db.js"; 

const getHomeData = expressAsyncHandler(async (req, res) => {
  try {
    const { lang } = req.body;

    const response = await fetch(`https://saavn.me/modules?language=${lang}`);

    if (response.ok) {
      const data = await response.json();
      res.json(data.data);
    } else {
      throw new Error("Failed to fetch data");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const getSongData = expressAsyncHandler(async (req, res) => {
  try {
    const { songId } = req.body;

    const response = await fetch(`https://saavn.me/songs?id=${songId}`);

    if (response.ok) {
      const data = await response.json();
      res.json(data.data);
    } else {
      throw new Error("Failed to fetch data");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const getPlaylistData = expressAsyncHandler(async (req, res) => {
  try {
    const { playlistId } = req.body;

    const response = await fetch(`https://saavn.me/playlists?id=${playlistId}`);

    if (response.ok) {
      const data = await response.json();
      res.json(data.data);
    } else {
      throw new Error("Failed to fetch data");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const getAlbumData = expressAsyncHandler(async (req, res) => {
  try {
    const { albumId } = req.body;

    const response = await fetch(`https://saavn.me/albums?id=${albumId}`);
    if (response.ok) {
      const data = await response.json();
      res.json(data.data);
    } else {
      throw new Error("Failed to fetch data");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const getSearchData = expressAsyncHandler(async (req, res) => {
  try {
    const { query } = req.params;
    const response = await fetch(`https://saavn.me/search/all?query=${query}`);
    if (response.ok) {
      const data = await response.json();
      res.json(data.data);
    } else {
      throw new Error("Failed to fetch data");
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }

});

const getArtistData = expressAsyncHandler(async (req, res) => {
  try {
    const { artistId } = req.body;

    const response = await fetch(`https://saavn.me/artists?id=${id}`);
    if (response.ok) {
      const data = await response.json();
      res.json(data.data);
    } else {
      throw new Error("Failed to fetch data");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const addToFavourites = expressAsyncHandler(async (req, res) => {
  try {
    const { userId, songId } = req.body;
    const addToFavouriteTable = await pool.query("INSERT INTO favorite_songs(user_id, song_id) VALUES ($1,$2)",[userId, songId])
    res.status(201).json(addToFavouriteTable)
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
});

const removeFromFavourites = expressAsyncHandler(async (req, res) => {
  try {
    const { userId, songId } = req.body;
    const addToFavouriteTable = await pool.query("DELETE FROM favorite_songs WHERE user_id = ($1) AND song_id = ($2)",[userId, songId])
    res.status(201).json(addToFavouriteTable)
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
});

const getFavourites = expressAsyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const getFavouriteTable = await pool.query("SELECT song_id FROM favorite_songs WHERE user_id = $1",[userId])
    res.status(201).json(getFavouriteTable.rows)
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
});

export {
  getHomeData,
  getSongData,
  getPlaylistData,
  getAlbumData,
  getSearchData,
  getArtistData,
  addToFavourites,
  removeFromFavourites,
  getFavourites,
};
