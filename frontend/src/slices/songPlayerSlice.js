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
      if (state?.currentSong?.item?.id !== action.payload.item.id) {
        
        const existingIndex = state.songsQueue.findIndex(
          (song) => song.item.id === action.payload.item.id
          );
          
          if (existingIndex !== -1) {
            state.songsQueue.splice(existingIndex, 1);
            state.currentIndex--;
          }
          
        const nextIndex = (state.currentIndex + 1) % 20;
        state.songsQueue[nextIndex] = action.payload;
        state.isPlaying = false;
        state.currentIndex = nextIndex;
        state.currentSong = state.songsQueue[state.currentIndex];
        state.isPlaying = true;
      }
    },

    playPause: (state, action) => {
      state.isPlaying = action.payload;
    },
    // console.log(action.payload.item.id);

    addToQueue: (state, action) => {
      if (state.songsQueue.length < 20) {
        const existingIndex = state.songsQueue.findIndex(
          (song) => song.item.id === action.payload.item.id
        );

        if (existingIndex !== -1) {
          state.songsQueue.splice(existingIndex, 1);
        }
        state.songsQueue.push(action.payload);
        if (state.currentIndex === -1) {
          state.currentIndex = 0;
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
      if (state.currentIndex < 19) {
        state.isPlaying = false;
        state.currentIndex = (state.currentIndex + 1) % state.songsQueue.length;
        state.currentSong = state.songsQueue[state.currentIndex];
        state.isPlaying = true;
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
