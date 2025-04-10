"use client"

import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { FiX } from "react-icons/fi"
import { setMobileMenuOpen } from "../../store/slices/uiSlice"
import { logoutUser } from "../../store/slices/userSlice"

const MobileNavigation = () => {
  const dispatch = useDispatch()
  const { mobileMenuOpen } = useSelector((state) => state.ui)
  const { currentUser } = useSelector((state) => state.user)

  const handleLogout = () => {
    dispatch(logoutUser())
    dispatch(setMobileMenuOpen(false))
  }

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className="block px-4 py-2 text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
      onClick={() => dispatch(setMobileMenuOpen(false))}
    >
      {children}
    </Link>
  )

  return (
    <div
      className={`lg:hidden fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity duration-300 ${
        mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-white dark:bg-gray-800 w-64 h-full overflow-y-auto transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center text-white font-bold">
              TC
            </div>
            <span className="font-bold text-lg">TeamCollab</span>
          </div>
          <button
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => dispatch(setMobileMenuOpen(false))}
          >
            <FiX size={20} />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <NavLink to="/dashboard">Dashboard</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/projects">Projects</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/chat">Chat</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/notifications">Notifications</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/profile">Profile</NavLink>
            </li>
          </ul>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center px-3 py-2">
              <img src={currentUser?.avatar || "/avatar.png"} alt="Profile" className="w-8 h-8 rounded-full" />
              <div className="ml-3">
                <p className="text-sm font-medium">{currentUser?.fullName || "User"}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {currentUser?.email || "user@example.com"}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md mt-2"
            >
              Sign out
            </button>
          </div>
        </nav>
      </div>
    </div>
  )
}

export default MobileNavigation
