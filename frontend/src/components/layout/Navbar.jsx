"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { FiMenu } from "react-icons/fi"
import { setMobileMenuOpen } from "../../store/slices/uiSlice"
import ThemeToggle from "../ui/ThemeToggle"
import NotificationBell from "../NotificationBell"
import UserDropdown from "./UserDropdown"
import MobileNavigation from "./MobileNavigation"

const Navbar = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { isAuthenticated } = useSelector((state) => state.user)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-10 bg-white dark:bg-gray-800 shadow-sm transition-all duration-200 ${
          scrolled ? "py-2" : "py-3"
        } px-4 md:px-6 lg:px-12`}
      >
        <div className="flex items-center justify-between">
          {/* Mobile menu button (only visible on mobile) */}
          <div className="flex items-center lg:hidden">
            <button
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => dispatch(setMobileMenuOpen(true))}
              aria-label="Toggle mobile menu"
            >
              <FiMenu size={24} />
            </button>
          </div>

          {/* Logo and navigation */}
          <div className="hidden lg:flex items-center">
            <Link to="/" className="flex items-center space-x-2 mr-8">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center text-white font-bold">
                TC
              </div>
              <span className="font-bold text-lg">TeamCollab</span>
            </Link>

            {/* Desktop navigation */}
            {isAuthenticated && (
              <div className="flex space-x-1">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActivePath(link.to)
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Center logo for mobile */}
          <div className="lg:hidden flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center text-white font-bold">
                TC
              </div>
              <span className="font-bold text-lg">TeamCollab</span>
            </Link>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />

            {isAuthenticated ? (
              <>
                <NotificationBell />
                <UserDropdown />
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isAuthenticated && <MobileNavigation />}

      {/* Spacer to prevent content from being hidden under the navbar */}
      <div className="h-16"></div>
    </>
  )
}

export default Navbar
