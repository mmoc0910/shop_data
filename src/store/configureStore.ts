import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice";
import satisfySlice from "./satisfy/satisfySlice";
import commisionSlice from "./commision/commisionSlice";
import collabSlice from "./collab/collabSlice";
import languageSlice from "./lang/languageSlice";
import serverSlice from "./server/serverSlice";
import currencySlice from "./currency/currencySlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "lang", "server", "currency"],
  blacklist: ["satisfy", "commision", "collab"],
};

const rootReducer = combineReducers({
  auth: authSlice,
  satisfy: satisfySlice,
  commision: commisionSlice,
  collab: collabSlice,
  lang: languageSlice,
  server: serverSlice,
  currency: currencySlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// ...

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
