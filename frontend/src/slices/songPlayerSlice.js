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
};

const songPlayerSlice = createSlice({
  name: "songPlayer",
  initialState,
  reducers: {
    setCurrentSong: (state, action) => {
      state.isPlaying = false;
      state.currentSong = action.payload;
      state.currentIndex++;
      state.songsQueue[state.currentIndex] = action.payload;
      state.isPlaying = true;
    },

    playPause: (state, action) => {
      if (state.roomMode === false) {
        state.isPlaying = action.payload;
      } else if (state.roomMode && state.isRoomHost) {
        state.isPlaying = action.payload;
      }
    },

    addToQueue: (state, action) => {
      if (state.roomMode === false) {
        state.songsQueue.push(action.payload);
        if (state.currentIndex === -1) {
          state.currentIndex++;
          state.currentSong = state.songsQueue[state.currentIndex];
          state.isPlaying = true;
        }
      } else if (state.roomMode && state.isRoomHost) {
        state.songsQueue.push(action.payload);
        if (state.currentIndex === -1) {
          state.currentIndex++;
          state.currentSong = state.songsQueue[state.currentIndex];
          state.isPlaying = true;
        }
      }
    },

    clearQueue: (state) => {
      state.songsQueue = [];
      state.currentIndex = -1;
      state.currentSong = null;
      state.isPlaying = false;
    },

    playPreviousSong: (state) => {
      if (state.roomMode === false) {
        if (state.currentIndex > 0) {
          state.isPlaying = false;
          state.currentIndex--;
          state.currentSong = state.songsQueue[state.currentIndex];
          state.isPlaying = true;
        }
      } else if (state.roomMode && state.isRoomHost) {
        if (state.currentIndex > 0) {
          state.isPlaying = false;
          state.currentIndex--;
          state.currentSong = state.songsQueue[state.currentIndex];
          state.isPlaying = true;
        }
      }
    },

    playNextSong: (state) => {
      if (state.roomMode === false) {
        if (state.currentIndex < state.songsQueue.length - 1) {
          state.isPlaying = false;
          state.currentIndex++;
          state.currentSong = state.songsQueue[state.currentIndex];
          state.isPlaying = true;
        }
      } else if (state.roomMode && state.isRoomHost) {
        if (state.currentIndex < state.songsQueue.length - 1) {
          state.isPlaying = false;
          state.currentIndex++;
          state.currentSong = state.songsQueue[state.currentIndex];
          state.isPlaying = true;
        }
      }
    },

    setRoomMode: (state, action) => {
      state.roomMode = action.payload;
    },

    setHost: (state, action) => {
      state.isRoomHost = action.payload;
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
} = songPlayerSlice.actions;

export default persistedReducer;
