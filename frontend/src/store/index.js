import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./slices/userSlice"
import projectReducer from "./slices/projectSlice"
import themeReducer from "./slices/themeSlice"
import uiReducer from "./slices/uiSlice"
import notificationReducer from "./slices/notificationSlice" 
import chatReducer from "./slices/chatSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    projects: projectReducer,
    theme: themeReducer,
    ui: uiReducer,
    notifications: notificationReducer, 
    chat: chatReducer
  },
})

export default store
