"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { FiMenu, FiChevronLeft } from "react-icons/fi"
import { setMobileMenuOpen, toggleSidebar } from "../../store/slices/uiSlice"
import ThemeToggle from "../ui/ThemeToggle"
import NotificationBell from "../NotificationBell"
import UserDropdown from "./UserDropdown"
import MobileNavigation from "./MobileNavigation"

const Navbar = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { isAuthenticated } = useSelector((state) => state.user)
  const { sidebarCollapsed } = useSelector((state) => state.ui)
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

  // Check if current route is a dashboard route
  const isDashboardRoute = () => {
    return (
      location.pathname.includes("/dashboard") ||
      location.pathname.includes("/projects") ||
      location.pathname.includes("/team") ||
      location.pathname.includes("/profile")
    )
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
        className={`fixed top-0 left-0 right-0 z-10 bg-bg-secondary border-b border-border/30 transition-all duration-200 ${
          scrolled ? "py-2" : "py-3"
        } px-4 md:px-6 lg:px-12`}
      >
        <div className="flex items-center justify-between">
          {/* Mobile menu button (only visible on mobile) */}
          <div className="flex items-center lg:hidden">
            <button
              className="p-2 rounded-md hover:bg-bg-primary/80 text-text-primary"
              onClick={() => dispatch(setMobileMenuOpen(true))}
              aria-label="Toggle mobile menu"
            >
              <FiMenu size={24} />
            </button>
          </div>

          {/* Logo and navigation */}
          <div className="flex items-center">
            {/* Sidebar toggle button (visible only on desktop AND on dashboard routes when authenticated) */}
            {isAuthenticated && isDashboardRoute() && (
              <button
                onClick={() => dispatch(toggleSidebar())}
                className="hidden lg:flex p-2 mr-4 rounded-full bg-bg-primary/80 hover:bg-bg-primary text-text-secondary hover:text-accent transition-all duration-300 ease-in-out transform hover:scale-105"
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <FiChevronLeft
                  size={16}
                  className={`transition-transform duration-300 ${sidebarCollapsed ? "rotate-180" : ""}`}
                />
              </button>
            )}

            {/* Logo - always visible */}
            <Link to="/" className="flex items-center space-x-2 mr-8">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center text-white font-bold">
                TC
              </div>
              <span className="font-bold text-lg">TeamCollab</span>
            </Link>

            {/* Desktop navigation */}
            {isAuthenticated && (
              <div className="hidden lg:flex space-x-1">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActivePath(link.to)
                        ? "bg-bg-primary text-text-primary"
                        : "text-text-secondary hover:bg-bg-primary hover:text-text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
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
                  className="text-text-secondary hover:text-accent px-3 py-2 text-sm font-medium transition-colors duration-200"
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