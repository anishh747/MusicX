import expressAsyncHandler from "express-async-handler";

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

const getSearchData = expressAsyncHandler(async (req, res) => {});

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

export {
  getSongData,
  getPlaylistData,
  getAlbumData,
  getSearchData,
  getArtistData
};
