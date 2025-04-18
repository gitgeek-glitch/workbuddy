import { configureStore } from "@reduxjs/toolkit"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage" // defaults to localStorage for web
import { combineReducers } from "redux"
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist"

// Import reducers
import userReducer from "./slices/userSlice"
import projectReducer from "./slices/projectSlice"
import themeReducer from "./slices/themeSlice"
import uiReducer from "./slices/uiSlice"
import notificationReducer from "./slices/notificationSlice"
import chatReducer from "./slices/chatSlice"

// Configure persist options
const persistConfig = {
  key: "root",
  storage,
  // Whitelist specific reducers you want to persist
  // If you want to persist everything, remove the whitelist
  whitelist: ["user", "theme", "ui"],
  // Alternatively, you can blacklist reducers you don't want to persist
  // blacklist: ['notifications']
}

// Combine all reducers
const rootReducer = combineReducers({
  user: userReducer,
  projects: projectReducer,
  theme: themeReducer,
  ui: uiReducer,
  notifications: notificationReducer,
  chat: chatReducer,
})

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Configure store with persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types to avoid serialization errors
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

// Create persistor
export const persistor = persistStore(store)

export default store
