"use client"

import { FiSun, FiMoon } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { toggleTheme } from "../../store/slices/themeSlice"

const ThemeToggle = () => {
  const dispatch = useDispatch()
  const { darkMode } = useSelector((state) => state.theme)

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="relative p-2 rounded-full overflow-hidden group transition-all duration-300 hover:shadow-md hover:shadow-accent/20"
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10 flex items-center justify-center w-6 h-6">
        {darkMode ? (
          <FiSun size={18} className="text-yellow-400 group-hover:animate-spin-slow" />
        ) : (
          <FiMoon size={18} className="text-accent group-hover:animate-pulse" />
        )}
      </div>
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
    </button>
  )
}

export default ThemeToggle