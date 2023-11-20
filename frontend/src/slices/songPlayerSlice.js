import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
    songsQueue: [],
    currentIndex: -1,
    isPlaying: false,
    currentSong: null,
  };


const songPlayerSlice = createSlice({
    name: 'songPlayer',
    initialState,
    reducers:{
        setCurrentSong:(state,action)=>{
                state.isPlaying = false;
                state.currentSong = action.payload;
                state.currentIndex++;
                state.songsQueue[state.currentIndex] = action.payload;
                state.isPlaying = true;   
        },

        playPause:(state,action)=>{
            state.isPlaying = action.payload;
        },
        
        addToQueue:(state,action)=>{
            state.songsQueue.push(action.payload);
            if (state.currentIndex === -1) {
                state.currentSong = action.payload;
                state.isPlaying = true;
                state.currentIndex++;
            }
        },

        playPreviousSong:(state)=>{
            if (state.currentIndex > 0) {
                state.isPlaying = false;
                state.currentIndex--;
                state.currentSong = state.songsQueue[state.currentIndex];
                state.isPlaying = true;
            }
        },

        playNextSong:(state)=>{
            if (state.currentIndex < state.songsQueue.length - 1) {
                state.isPlaying = false;
                state.currentIndex++;
                state.currentSong = state.songsQueue[state.currentIndex];
                state.isPlaying = true;
            }
        },
    }
})

export const {setCurrentSong,playPause,addToQueue,playPreviousSong,playNextSong} = songPlayerSlice.actions;

export default songPlayerSlice.reducer;