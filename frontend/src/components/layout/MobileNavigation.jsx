"use client"

import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { FiX, FiHome, FiFolder, FiMessageSquare, FiBell, FiUser, FiLogOut } from "react-icons/fi"
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

  const NavLink = ({ to, children, icon: Icon }) => (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-3 text-base font-medium hover:bg-bg-primary text-text-primary rounded-xl transition-all duration-300 group"
      onClick={() => dispatch(setMobileMenuOpen(false))}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-bg-primary text-text-secondary group-hover:text-accent transition-all duration-300">
        <Icon size={18} />
      </div>
      <span className="group-hover:translate-x-1 transition-transform duration-300">{children}</span>
    </Link>
  )

  return (
    <div
      className={`lg:hidden fixed inset-0 z-50 backdrop-blur-lg transition-all duration-300 ${
        mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="absolute inset-0 bg-black bg-opacity-40 dark:bg-black dark:bg-opacity-60"
        onClick={() => dispatch(setMobileMenuOpen(false))}
      ></div>
      <div
        className={`bg-bg-secondary w-[85%] max-w-sm h-full overflow-y-auto transform transition-transform duration-300 ease-out shadow-2xl ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
              TC
            </div>
            <span className="font-bold text-xl">TeamCollab</span>
          </div>
          <button
            className="p-2 rounded-full hover:bg-bg-primary text-text-primary transition-all duration-200"
            onClick={() => dispatch(setMobileMenuOpen(false))}
          >
            <FiX size={24} />
          </button>
        </div>

        <nav className="p-4">
          <div className="space-y-2 py-4">
            <NavLink to="/dashboard" icon={FiHome}>
              Dashboard
            </NavLink>
            <NavLink to="/dashboard/projects" icon={FiFolder}>
              Projects
            </NavLink>
            <NavLink to="/dashboard/chat" icon={FiMessageSquare}>
              Chat
            </NavLink>
            <NavLink to="/dashboard/notifications" icon={FiBell}>
              Notifications
            </NavLink>
            <NavLink to="/dashboard/profile" icon={FiUser}>
              Profile
            </NavLink>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center p-5 mb-6 bg-bg-primary rounded-xl">
              <div className="relative">
                <img
                  src={currentUser?.avatar || "/avatar.png"}
                  alt="Profile"
                  className="w-14 h-14 rounded-xl object-cover border-2 border-bg-secondary shadow-md"
                />
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-success rounded-full border-2 border-bg-secondary"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-primary">{currentUser?.fullName || "User"}</p>
                <p className="text-xs text-text-secondary truncate max-w-[180px]">
                  {currentUser?.email || "user@example.com"}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-base font-medium text-danger hover:bg-bg-primary rounded-xl transition-all duration-300 group"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-bg-primary text-danger">
                <FiLogOut size={18} />
              </div>
              <span className="group-hover:translate-x-1 transition-transform duration-300">Sign out</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  )
}

export default MobileNavigation