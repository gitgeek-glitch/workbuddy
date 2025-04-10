"use client"

import { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { FiChevronDown } from "react-icons/fi"
import { logoutUser } from "../../store/slices/userSlice"

const UserDropdown = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentUser } = useSelector((state) => state.user)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate("/login")
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center space-x-1 focus:outline-none"
        aria-label="User menu"
      >
        <img
          src={currentUser?.avatar || "/avatar.png"}
          alt="Profile"
          className="w-8 h-8 rounded-full border-2 border-transparent hover:border-accent transition-colors duration-200"
        />
        <FiChevronDown
          className={`text-text-secondary transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
        />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium">{currentUser?.fullName || "User"}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {currentUser?.email || "user@example.com"}
            </p>
          </div>

          <Link
            to="/dashboard/profile"
            className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setDropdownOpen(false)}
          >
            Your profile
          </Link>
          <Link
            to="/dashboard/projects"
            className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setDropdownOpen(false)}
          >
            Your projects
          </Link>
          <Link
            to="/dashboard/settings"
            className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setDropdownOpen(false)}
          >
            Settings
          </Link>

          <div className="border-t border-gray-200 dark:border-gray-700 mt-1 pt-1"></div>

          <button
            onClick={() => {
              handleLogout()
              setDropdownOpen(false)
            }}
            className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

export default UserDropdown
