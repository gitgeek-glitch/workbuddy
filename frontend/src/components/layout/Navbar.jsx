"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  FiBell,
  FiPlus,
  FiSearch,
  FiMenu,
  FiX,
  FiChevronDown,
  FiGithub,
  FiStar,
  FiGitPullRequest,
} from "react-icons/fi"

import { logoutUser } from "../../store/slices/userSlice"
import { toggleMobileMenu, setMobileMenuOpen, markAllNotificationsAsRead } from "../../store/slices/uiSlice"
import ThemeToggle from "../ui/ThemeToggle"

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const { currentUser, isAuthenticated } = useSelector((state) => state.user)
  const { mobileMenuOpen } = useSelector((state) => state.ui)
  const { notifications, unreadNotificationsCount } = useSelector((state) => state.ui)

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [createMenuOpen, setCreateMenuOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen || notificationsOpen || createMenuOpen) {
        if (!event.target.closest(".dropdown-container")) {
          setDropdownOpen(false)
          setNotificationsOpen(false)
          setCreateMenuOpen(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [dropdownOpen, notificationsOpen, createMenuOpen])

  // Handle keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/" && !searchFocused) {
        e.preventDefault()
        document.querySelector('input[type="text"][placeholder="Search..."]')?.focus()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [searchFocused])

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate("/login")
  }

  // Mock notifications for now
  const mockNotifications = [
    {
      id: 1,
      title: "New comment on your pull request",
      message: "John Doe commented on your PR #123",
      time: "5 minutes ago",
      read: false,
      icon: <FiGitPullRequest />,
    },
    {
      id: 2,
      title: "Your project was starred",
      message: "Alice Williams starred your project",
      time: "1 hour ago",
      read: false,
      icon: <FiStar />,
    },
    {
      id: 3,
      title: "New pull request",
      message: "Bob Johnson opened PR #124",
      time: "3 hours ago",
      read: true,
      icon: <FiGitPullRequest />,
    },
  ]

  // Use mock notifications until we implement real ones
  const displayNotifications = notifications.length > 0 ? notifications : mockNotifications

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
        {isAuthenticated && (
          <div className="flex items-center lg:hidden">
            <button className="btn-icon" onClick={() => dispatch(toggleMobileMenu())} aria-label="Toggle mobile menu">
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        )}

        <div className="hidden lg:flex items-center">
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2 mr-8">
            <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center text-white font-bold">TC</div>
            <span className="font-bold text-lg">TeamCollab</span>
          </Link>

          {isAuthenticated && (
            <div className="flex space-x-1">
              <Link
                to="/dashboard"
                className={`navbar-link ${
                  location.pathname === "/dashboard" ? "navbar-link-active" : "navbar-link-inactive"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/dashboard/projects"
                className={`navbar-link ${
                  location.pathname.includes("/projects") ? "navbar-link-active" : "navbar-link-inactive"
                }`}
              >
                Projects
              </Link>
              <Link
                to="/dashboard/chat"
                className={`navbar-link ${
                  location.pathname.includes("/chat") ? "navbar-link-active" : "navbar-link-inactive"
                }`}
              >
                Chat
              </Link>
            </div>
          )}
        </div>

        {isAuthenticated && (
          <div className="flex-1 max-w-xl mx-4 relative">
            <div className={`relative transition-all duration-200 ${searchFocused ? "scale-105" : ""}`}>
              <input
                type="text"
                placeholder="Search..."
                className={`w-full bg-bg-primary border border-border rounded-md py-1.5 pl-10 pr-4 text-sm focus:outline-none transition-all duration-200 ${
                  searchFocused
                    ? "border-accent ring-1 ring-accent ring-opacity-50"
                    : "focus:border-accent focus:ring-1 focus:ring-accent focus:ring-opacity-50"
                }`}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              <FiSearch
                className={`absolute left-3 top-2 transition-colors duration-200 ${
                  searchFocused ? "text-accent" : "text-text-secondary"
                }`}
              />

              <div
                className={`absolute right-3 top-1.5 text-xs text-text-secondary ${searchFocused ? "opacity-100" : "opacity-0"} transition-opacity duration-200`}
              >
                Press / to focus
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              <div className="dropdown-container relative">
                <button
                  onClick={() => {
                    setCreateMenuOpen(!createMenuOpen)
                    setNotificationsOpen(false)
                    setDropdownOpen(false)
                  }}
                  className="btn-icon relative"
                  aria-label="Create new"
                >
                  <FiPlus
                    size={20}
                    className={`transform transition-transform duration-200 ${createMenuOpen ? "rotate-45" : ""}`}
                  />
                </button>

                {createMenuOpen && (
                  <div className="dropdown-menu right-0 w-56">
                    <div className="px-4 py-2 border-b border-border">
                      <h3 className="font-medium">Create new</h3>
                    </div>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-bg-primary text-left"
                      onClick={() => setCreateMenuOpen(false)}
                    >
                      <FiGithub className="mr-2" />
                      New repository
                    </button>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-bg-primary text-left"
                      onClick={() => setCreateMenuOpen(false)}
                    >
                      <FiGitPullRequest className="mr-2" />
                      New pull request
                    </button>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-bg-primary text-left"
                      onClick={() => setCreateMenuOpen(false)}
                    >
                      <FiPlus className="mr-2" />
                      New project
                    </button>
                  </div>
                )}
              </div>

              <div className="dropdown-container relative">
                <button
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen)
                    setCreateMenuOpen(false)
                    setDropdownOpen(false)
                  }}
                  className="btn-icon relative"
                  aria-label="Notifications"
                >
                  <FiBell size={20} />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full"></span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="dropdown-menu right-0 w-80">
                    <div className="px-4 py-2 border-b border-border flex justify-between items-center">
                      <h3 className="font-medium">Notifications</h3>
                      <button
                        className="text-xs text-accent hover:underline"
                        onClick={() => dispatch(markAllNotificationsAsRead())}
                      >
                        Mark all as read
                      </button>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {displayNotifications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-text-secondary">
                          <p>No notifications yet</p>
                        </div>
                      ) : (
                        displayNotifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 border-b border-border last:border-b-0 hover:bg-bg-primary transition-colors ${
                              notification.read ? "opacity-70" : ""
                            }`}
                          >
                            <div className="flex">
                              <div className="flex-shrink-0 mt-0.5">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    notification.read
                                      ? "bg-bg-primary text-text-secondary"
                                      : "bg-accent bg-opacity-10 text-accent"
                                  }`}
                                >
                                  {notification.icon}
                                </div>
                              </div>
                              <div className="ml-3 flex-1">
                                <p className="text-sm font-medium">{notification.title}</p>
                                <p className="text-xs text-text-secondary mt-1">{notification.message}</p>
                                <p className="text-xs text-text-secondary mt-1">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="px-4 py-2 border-t border-border">
                      <Link
                        to="/dashboard/notifications"
                        className="text-sm text-accent hover:underline block text-center"
                        onClick={() => setNotificationsOpen(false)}
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="dropdown-container relative">
                <button
                  onClick={() => {
                    setDropdownOpen(!dropdownOpen)
                    setNotificationsOpen(false)
                    setCreateMenuOpen(false)
                  }}
                  className="flex items-center space-x-1 focus:outline-none"
                  aria-label="User menu"
                >
                  <div className="relative">
                    <img
                      src={currentUser?.avatar || "/placeholder.svg?height=32&width=32"}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-transparent hover:border-accent transition-colors duration-200"
                    />
                    <div
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-success border-2 border-bg-secondary transform transition-transform duration-200 ${dropdownOpen ? "scale-110" : ""}`}
                    ></div>
                  </div>
                  <FiChevronDown
                    className={`text-text-secondary transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="dropdown-menu right-0 w-56">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-medium">{currentUser?.name || "User"}</p>
                      <p className="text-xs text-text-secondary truncate">{currentUser?.email || "user@example.com"}</p>
                    </div>

                    <Link to="/dashboard/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      Your profile
                    </Link>
                    <Link to="/dashboard/projects" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      Your projects
                    </Link>
                    <Link to="/dashboard/settings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      Settings
                    </Link>

                    <div className="border-t border-border mt-1 pt-1">
                      <button
                        onClick={() => {
                          handleLogout()
                          setDropdownOpen(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-bg-primary transition-colors text-danger"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-text-secondary hover:text-accent px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Sign in
              </Link>
              <Link to="/signup" className="btn-primary text-sm">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {isAuthenticated && (
        <div
          className={`lg:hidden fixed inset-0 z-20 bg-bg-primary bg-opacity-90 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className={`bg-bg-secondary w-64 h-full overflow-y-auto transform transition-transform duration-300 ease-in-out ${
              mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <Link
                to="/dashboard"
                className="flex items-center space-x-2"
                onClick={() => dispatch(setMobileMenuOpen(false))}
              >
                <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center text-white font-bold">
                  TC
                </div>
                <span className="font-bold text-lg">TeamCollab</span>
              </Link>
              <button className="btn-icon" onClick={() => dispatch(setMobileMenuOpen(false))}>
                <FiX size={20} />
              </button>
            </div>

            <nav className="p-4">
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/dashboard"
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === "/dashboard" ? "navbar-link-active" : "navbar-link-inactive"
                    }`}
                    onClick={() => dispatch(setMobileMenuOpen(false))}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/projects"
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname.includes("/projects") ? "navbar-link-active" : "navbar-link-inactive"
                    }`}
                    onClick={() => dispatch(setMobileMenuOpen(false))}
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/chat"
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === "/chat" ? "navbar-link-active" : "navbar-link-inactive"
                    }`}
                    onClick={() => dispatch(setMobileMenuOpen(false))}
                  >
                    Chat
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/profile"
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === "/profile" ? "navbar-link-active" : "navbar-link-inactive"
                    }`}
                    onClick={() => dispatch(setMobileMenuOpen(false))}
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/settings"
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === "/settings" ? "navbar-link-active" : "navbar-link-inactive"
                    }`}
                    onClick={() => dispatch(setMobileMenuOpen(false))}
                  >
                    Settings
                  </Link>
                </li>
              </ul>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center px-3 py-2">
                  <img
                    src={currentUser?.avatar || "/placeholder.svg?height=32&width=32"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium">{currentUser?.name || "User"}</p>
                    <p className="text-xs text-text-secondary truncate">{currentUser?.email || "user@example.com"}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleLogout()
                    dispatch(setMobileMenuOpen(false))
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-danger hover:bg-bg-primary rounded-md mt-2"
                >
                  Sign out
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar