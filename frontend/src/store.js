import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'


const store = configureStore({
    reducer:{
        auth: authReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
        chatRoom: chatRoomReducer,
    },
    middleware:(getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
})

export default store;