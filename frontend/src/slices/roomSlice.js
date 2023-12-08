import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const initialState = {
    roomInfo: null
};

const roomSlice = createSlice({
    name: "room",
    initialState,
    reducers: {
        setRoomData: (state,action) => {
            state.roomInfo = action.payload;
        },
        clearRoomData: (state) => {
            state.roomInfo = null;
        },
    },
});

const persistConfig = {
    key: "room",
    storage,
  };

const persistedReducer = persistReducer(persistConfig, roomSlice.reducer);


export const { setRoomData, clearRoomData } = roomSlice.actions;

export default persistedReducer;