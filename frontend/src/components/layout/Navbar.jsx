"use client"

import { useState, useEffect, useRef } from "react"
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

const NavbarLink = ({ to, active, children, onClick }) => (
  <Link
    to={to}
    className={`navbar-link ${active ? "navbar-link-active" : "navbar-link-inactive"}`}
    onClick={onClick}
  >
    {children}
  </Link>
)

const DropdownMenu = ({ open, children }) => {
  if (!open) return null
  return <div className="dropdown-menu right-0">{children}</div>
}

const DropdownItem = ({ onClick, children, danger }) => (
  <button
    onClick={onClick}
    className={`block w-full text-left px-4 py-2 text-sm hover:bg-bg-primary transition-colors ${danger ? "text-danger" : ""}`}
  >
    {children}
  </button>
)

const DropdownHeader = ({ title, subtitle }) => (
  <div className="px-4 py-3 border-b border-border">
    <p className="text-sm font-medium">{title}</p>
    {subtitle && <p className="text-xs text-text-secondary truncate">{subtitle}</p>}
  </div>
)

const DropdownDivider = () => <div className="border-t border-border mt-1 pt-1"></div>

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const searchInputRef = useRef(null)

  const { currentUser, isAuthenticated } = useSelector((state) => state.user)
  const { mobileMenuOpen } = useSelector((state) => state.ui)
  const { notifications, unreadNotificationsCount } = useSelector((state) => state.ui)

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [createMenuOpen, setCreateMenuOpen] = useState(false)
  const [searchExpanded, setSearchExpanded] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Close all dropdowns
  const closeAllDropdowns = () => {
    setDropdownOpen(false)
    setNotificationsOpen(false)
    setCreateMenuOpen(false)
  }

  // Toggle search input
  const toggleSearch = () => {
    setSearchExpanded(!searchExpanded)
    if (!searchExpanded) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen || notificationsOpen || createMenuOpen) {
        if (!event.target.closest(".dropdown-container")) {
          closeAllDropdowns()
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [dropdownOpen, notificationsOpen, createMenuOpen])

  // Handle keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault()
        setSearchExpanded(true)
        setTimeout(() => {
          searchInputRef.current?.focus()
        }, 100)
      } else if (e.key === "Escape" && searchExpanded) {
        setSearchExpanded(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [searchExpanded])

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate("/login")
  }

  // Mock notifications
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

  // Check if a path is active
  const isActivePath = (path) => {
    if (path === "/dashboard") return location.pathname === "/dashboard"
    return location.pathname.includes(path)
  }

  // Navigation links
  const navigationLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/dashboard/projects", label: "Projects" },
    { to: "/dashboard/chat", label: "Chat" },
  ]

  // Brand logo
  const BrandLogo = ({ onClick }) => (
    <Link to="/" className="flex items-center space-x-2" onClick={onClick}>
      <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center text-white font-bold">
        TC
      </div>
      <span className="font-bold text-lg">TeamCollab</span>
    </Link>
  )

  // User avatar
  const UserAvatar = ({ onClick, showIndicator }) => (
    <div className="relative">
      <img
        src={currentUser?.avatar || "/avatar.png"}
        alt="Profile"
        className="w-8 h-8 rounded-full border-2 border-transparent hover:border-accent transition-colors duration-200"
        onClick={onClick}
      />
      {showIndicator && (
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-success border-2 border-bg-secondary"></div>
      )}
    </div>
  )

  // Search component
  const SearchComponent = () => (
    <div className={`search-container ${searchExpanded ? "expanded" : ""}`}>
      <button
        className={`search-icon-btn ${searchExpanded ? "hidden" : "flex"}`}
        onClick={toggleSearch}
        aria-label="Search"
      >
        <FiSearch size={20} />
      </button>
      <div className={`search-input-container ${searchExpanded ? "w-64 md:w-80" : "w-0"}`}>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search..."
          className="search-input"
          onBlur={() => setSearchExpanded(false)}
        />
        <FiSearch className="search-icon" />
        <div className="search-shortcut">
          Press / to focus
        </div>
        <button className="search-close-btn" onClick={() => setSearchExpanded(false)}>
          <FiX size={16} />
        </button>
      </div>
    </div>
  )

  // Notifications dropdown
  const NotificationsDropdown = () => (
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

      <DropdownMenu open={notificationsOpen}>
        <div className="w-80">
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
      </DropdownMenu>
    </div>
  )

  // Create menu dropdown
  const CreateMenuDropdown = () => (
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

      <DropdownMenu open={createMenuOpen}>
        <div className="w-56">
          <DropdownHeader title="Create new" />
          <DropdownItem onClick={() => setCreateMenuOpen(false)}>
            <FiGithub className="mr-2 inline-block" /> New repository
          </DropdownItem>
          <DropdownItem onClick={() => setCreateMenuOpen(false)}>
            <FiGitPullRequest className="mr-2 inline-block" /> New pull request
          </DropdownItem>
          <DropdownItem onClick={() => setCreateMenuOpen(false)}>
            <FiPlus className="mr-2 inline-block" /> New project
          </DropdownItem>
        </div>
      </DropdownMenu>
    </div>
  )

  // User dropdown
  const UserDropdown = () => (
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
        <UserAvatar showIndicator={true} />
        <FiChevronDown
          className={`text-text-secondary transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
        />
      </button>

      <DropdownMenu open={dropdownOpen}>
        <div className="w-56">
          <DropdownHeader 
            title={currentUser?.fullName || "User"} 
            subtitle={currentUser?.email || "user@example.com"} 
          />
          
          <Link to="/dashboard/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
            Your profile
          </Link>
          <Link to="/dashboard/projects" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
            Your projects
          </Link>
          <Link to="/dashboard/settings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
            Settings
          </Link>

          <DropdownDivider />
          
          <DropdownItem 
            onClick={() => {
              handleLogout()
              setDropdownOpen(false)
            }}
            danger
          >
            Sign out
          </DropdownItem>
        </div>
      </DropdownMenu>
    </div>
  )

  // Mobile navigation
  const MobileNavigation = () => (
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
          <BrandLogo onClick={() => dispatch(setMobileMenuOpen(false))} />
          <button className="btn-icon" onClick={() => dispatch(setMobileMenuOpen(false))}>
            <FiX size={20} />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {navigationLinks.map((link) => (
              <li key={link.to}>
                <NavbarLink 
                  to={link.to} 
                  active={isActivePath(link.to)}
                  onClick={() => dispatch(setMobileMenuOpen(false))}                  
                >
                  <span className="text-text-primary">{link.label}</span>
                </NavbarLink>
              </li>
            ))}
            <li>
              <NavbarLink 
                to="/dashboard/profile" 
                active={isActivePath("/profile")}
                onClick={() => dispatch(setMobileMenuOpen(false))}
              >
                Profile
              </NavbarLink>
            </li>
            <li>
              <NavbarLink 
                to="/dashboard/settings" 
                active={isActivePath("/settings")}
                onClick={() => dispatch(setMobileMenuOpen(false))}
              >
                Settings
              </NavbarLink>
            </li>
          </ul>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center px-3 py-2">
              <UserAvatar />
              <div className="ml-3">
                <p className="text-sm font-medium">{currentUser?.fullName || "User"}</p>
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
  )

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""} pr-12 pl-12`}>
        {/* Mobile menu button (only visible on mobile) */}
        <div className="flex items-center lg:hidden">
          <button 
            className="btn-icon" 
            onClick={() => dispatch(toggleMobileMenu())} 
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Logo and navigation */}
        <div className="hidden lg:flex items-center">
          <div className="mr-8">
            <BrandLogo />
          </div>

          {/* Desktop navigation */}
          {isAuthenticated && (
            <div className="flex space-x-1">
              {navigationLinks.map((link) => (
                <NavbarLink key={link.to} to={link.to} active={isActivePath(link.to)}>
                  <span className="text-text-primary">{link.label}</span>
                </NavbarLink>
              ))}
            </div>
          )}
        </div>

        {/* Search moved from center to right side, only for authenticated users */}
        {/* {isAuthenticated && (
          <div className="flex-1 flex items-center justify-center px-4 lg:hidden">
            <SearchComponent />
          </div>
        )} */}

        {/* Right side items */}
        <div className="flex items-center space-x-2">
          {/* Search now appears before ThemeToggle when authenticated */}
          {/* {isAuthenticated && (
            <div className="hidden lg:block">
              <SearchComponent />
            </div>
          )} */}
          
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              {/* <CreateMenuDropdown /> */}
              <NotificationsDropdown />
              <UserDropdown />
            </>
          ) : (
            <>
              {/* Search removed for non-authenticated users */}
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

      {/* Mobile Navigation */}
      {isAuthenticated && <MobileNavigation />}
    </>
  )
}

export default Navbar