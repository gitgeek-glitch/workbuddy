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
      className="p-1.5 rounded-md hover:bg-bg-primary"
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
    </button>
  )
}

export default ThemeToggle