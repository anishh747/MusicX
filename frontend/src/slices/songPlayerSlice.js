// Import necessary libraries and modules
import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Initial state of the song player
const initialState = {
  songsQueue: [],
  currentIndex: -1,
  isPlaying: false,
  currentSong: null,
  roomMode: false,
  isRoomHost: false,
  nowPlayingView: false,
  isShuffleMode: false,
};

// Create a slice for the song player
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
        state.currentIndex =
          (state.currentIndex + state.songsQueue.length - 1) %
          state.songsQueue.length;
        state.currentSong = state.songsQueue[state.currentIndex];
        state.isPlaying = true;
      }
    },

    playNextSong: (state) => {
      if (state.isShuffleMode) {
        // If shuffle mode is enabled, play a random song
        const randomIndex = Math.floor(Math.random() * state.songsQueue.length);
        state.isPlaying = false;
        state.currentIndex = randomIndex;
        state.currentSong = state.songsQueue[state.currentIndex];
        state.isPlaying = true;
      } else {
        // If shuffle mode is disabled, play the next song in the queue
        if (state.currentIndex < 19) {
          state.isPlaying = false;
          state.currentIndex = (state.currentIndex + 1) % state.songsQueue.length;
          state.currentSong = state.songsQueue[state.currentIndex];
          state.isPlaying = true;
        }
      }
    },

    toggleShuffle: (state) => {
      // Toggle the shuffle mode
      state.isShuffleMode = !state.isShuffleMode;
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

// Configuration for persisting the state
const persistConfig = {
  key: "songPlayer",
  storage,
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, songPlayerSlice.reducer);

// Export actions
export const {
  setCurrentSong,
  playPause,
  addToQueue,
  clearQueue,
  playPreviousSong,
  playNextSong,
  setHost,
  setRoomMode,
  isNowPlayingView,
  toggleShuffle,
} = songPlayerSlice.actions;

// Export the persisted reducer
export default persistedReducer;
