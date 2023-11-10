import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    songsQueue: [],
    currentIndex: 0,
    isPlaying: false,
    currentSong: "",
  };


const songPlayerSlice = createSlice({
    name: 'songPlayer',
    initialState,
    reducers:{
        setCurrentSong:(state,action)=>{
            if(action.payload.song){
                state.currentSong = action.payload.song;
                state.isPlaying = true;
            }
        },

        playPause:(state,action)=>{
            state.isPlaying = action.payload.isPlaying;
        },
    }

})

export const {setCurrentSong,playPause} = songPlayerSlice.actions;

export default songPlayerSlice.reducer;
