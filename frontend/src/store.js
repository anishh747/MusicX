import {configureStore, combineReducers, getDefaultMiddleware} from '@reduxjs/toolkit';
import { persistReducer, persistStore } from "redux-persist";
import { apiSlice } from './slices/apiSlice';
import songPlayerReducer from './slices/songPlayerSlice';
import authReducer from './slices/authSlice';
import roomreducer from './slices/roomSlice';
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    songPlayer: songPlayerReducer,
    room: roomreducer,
  });

  const persistConfig = {
    key: "root", // key for localStorage
    storage,
  };

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  export const store = configureStore({
    reducer: persistedReducer,
    middleware:(getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),
    devTools: true,
  });

  export const persistor = persistStore(store);
