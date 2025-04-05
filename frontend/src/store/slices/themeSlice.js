import { createSlice } from "@reduxjs/toolkit"

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("theme")
  return savedTheme ? savedTheme === "dark" : true // Default to dark mode
}

const initialState = {
  darkMode: getInitialTheme(),
}

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode
      localStorage.setItem("theme", state.darkMode ? "dark" : "light")

      // Apply theme to document
      if (state.darkMode) {
        document.documentElement.classList.remove("light-theme")
      } else {
        document.documentElement.classList.add("light-theme")
      }
    },
    setTheme: (state, action) => {
      state.darkMode = action.payload === "dark"
      localStorage.setItem("theme", action.payload)

      // Apply theme to document
      if (state.darkMode) {
        document.documentElement.classList.remove("light-theme")
      } else {
        document.documentElement.classList.add("light-theme")
      }
    },
  },
})

export const { toggleTheme, setTheme } = themeSlice.actions

export default themeSlice.reducer