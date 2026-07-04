import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./feature/authSlice";
import themeReducer from "./feature/themeSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { baseApi } from "./api/baseApi";
import { Platform } from "react-native";
import secureStorage from "./feature/secureStorage";

// const storage = Platform.OS === "web" ? webStorage : AsyncStorage;
const getStorage = () => {
  if (Platform.OS === "web") {
    return require("redux-persist/lib/storage").default;
  }
  return secureStorage;
};
const persistConfig = {
  key: "auth",
  storage: getStorage(),
  whitelist: ["token", "user"],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const themePersistConfig = {
  key: "theme",
  storage: getStorage(),
  whitelist: ["mode"],
};

const persistedThemeReducer = persistReducer(themePersistConfig, themeReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    theme: persistedThemeReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
