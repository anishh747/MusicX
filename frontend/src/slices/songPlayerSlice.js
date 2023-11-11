import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    songsQueue: [],
    currentIndex: 0,
    isPlaying: false,
    currentSong: {},
  };


const songPlayerSlice = createSlice({
    name: 'songPlayer',
    initialState,
    reducers:{
        setCurrentSong:(state,action)=>{
            state.currentSong = action.payload;
        },

        playPause:(state,action)=>{
            state.isPlaying = action.payload.isPlaying;
        },
    }

})

export const {setCurrentSong,playPause} = songPlayerSlice.actions;

export default songPlayerSlice.reducer;
