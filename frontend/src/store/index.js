import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./slices/userSlice"
import projectReducer from "./slices/projectSlice"
import themeReducer from "./slices/themeSlice"
import uiReducer from "./slices/uiSlice"
import notificationReducer from "./slices/notificationSlice" // 👈 Add this

export const store = configureStore({
  reducer: {
    user: userReducer,
    projects: projectReducer,
    theme: themeReducer,
    ui: uiReducer,
    notifications: notificationReducer, // 👈 And this line
  },
})

export default store
