import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const initialState = {
  songsQueue: [],
  currentIndex: -1,
  isPlaying: false,
  currentSong: null,
  roomMode: false,
  isRoomHost: false,
  nowPlayingView: false,
};

const songPlayerSlice = createSlice({
  name: "songPlayer",
  initialState,
  reducers: {
    setCurrentSong: (state, action) => {
      if (state.currentSong === action.payload) return;
      const nextIndex = (state.currentIndex + 1) % 20;

      state.songsQueue[nextIndex] = action.payload;
      state.isPlaying = false;
      state.currentIndex = nextIndex;
      state.currentSong = state.songsQueue[state.currentIndex];
      state.isPlaying = true;
    },

    playPause: (state, action) => {
      state.isPlaying = action.payload;
    },

    addToQueue: (state, action) => {
      const nextIndex = (state.currentIndex + 1) % 20;
      state.songsQueue[nextIndex] = action.payload;

      if (state.currentIndex === -1) {
        state.currentIndex = nextIndex;
        state.currentSong = state.songsQueue[state.currentIndex];
        state.isPlaying = true;
      }
    },

    clearQueue: (state) => {
      state.songsQueue = [];
      state.currentIndex = -1;
      state.currentSong = null;
      state.isPlaying = false;
    },

    playPreviousSong: (state) => {
      if (state.currentIndex !== -1) {
        state.isPlaying = false;
        state.currentIndex = (state.currentIndex + (state.songsQueue.length) - 1) % state.songsQueue.length;
        state.currentSong = state.songsQueue[state.currentIndex];
        state.isPlaying = true;
      }
    },

    playNextSong: (state) => {
      if (state.currentIndex < 19) {
        state.isPlaying = false;
        state.currentIndex = (state.currentIndex + 1) % (state.songsQueue.length);
        state.currentSong = state.songsQueue[state.currentIndex];
        state.isPlaying = true;
      }
    },
    setRoomMode: (state, action) => {
      state.roomMode = action.payload;
    },

    setHost: (state, action) => {
      state.isRoomHost = action.payload;
    },

    isNowPlayingView: (state, action) => {
      state.nowPlayingView = action.payload;
    },
  },
});

const persistConfig = {
  key: "songPlayer",
  storage,
};

const persistedReducer = persistReducer(persistConfig, songPlayerSlice.reducer);

export const {
  setCurrentSong,
  playPause,
  addToQueue,
  clearQueue,
  playPreviousSong,
  playNextSong,
  setHost,
  setRoomMode,
  isNowPlayingView
} = songPlayerSlice.actions;

export default persistedReducer;
