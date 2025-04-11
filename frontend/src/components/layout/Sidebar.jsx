"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { FiHome, FiFolder, FiMessageSquare, FiUsers, FiSettings } from "react-icons/fi"

import { setSidebarCollapsed } from "../../store/slices/uiSlice"
import { starProject, unstarProject, addToRecent } from "../../store/slices/projectSlice"

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { projects, starredProjects, recentProjects } = useSelector((state) => state.projects)
  const { sidebarCollapsed } = useSelector((state) => state.ui)

  // Set sidebar to collapsed by default when component mounts
  useEffect(() => {
    dispatch(setSidebarCollapsed(true))
  }, [dispatch])

  // Initialize all sections as collapsed
  const [projectsExpanded, setProjectsExpanded] = useState(false)
  const [starredExpanded, setStarredExpanded] = useState(false)
  const [recentExpanded, setRecentExpanded] = useState(false)
  const [hoveredItem, setHoveredItem] = useState(null)
  const [projectMenuOpen, setProjectMenuOpen] = useState(null)
  const sidebarRef = useRef(null)

  // Close project menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (projectMenuOpen && !event.target.closest(".project-menu-container")) {
        setProjectMenuOpen(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [projectMenuOpen])

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard"
    } else if (path === "/dashboard/chat") {
      return location.pathname.includes("/chat") || location.pathname === "/dashboard/chat"
    } else if (path === "/dashboard/projects") {
      return location.pathname === "/dashboard/projects"
    } else {
      return location.pathname === path || location.pathname.startsWith(path)
    }
  }

  const handleProjectClick = (projectId) => {
    dispatch(addToRecent(projectId))
  }

  const handleStarProject = (projectId, event) => {
    event.preventDefault()
    event.stopPropagation()

    if (starredProjects.some((p) => p.id === projectId)) {
      dispatch(unstarProject(projectId))
    } else {
      dispatch(starProject(projectId))
    }

    setProjectMenuOpen(null)
  }

  const NavItem = ({ to, icon: Icon, label }) => (
    <Link
      to={to}
      className={`relative flex items-center rounded-xl px-4 py-3 transition-all duration-300 group overflow-hidden ${
        isActive(to)
          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-md"
          : "hover:bg-bg-primary text-text-primary"
      }`}
      onMouseEnter={() => setHoveredItem(label.toLowerCase())}
      onMouseLeave={() => setHoveredItem(null)}
    >
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-xl ${
          isActive(to)
            ? "bg-white bg-opacity-20 text-white"
            : "bg-bg-primary text-text-secondary group-hover:text-accent"
        } transition-all duration-300`}
      >
        <Icon size={18} />
      </div>
      <span
        className={`ml-3 relative z-10 transition-all duration-300 ${
          sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
        }`}
      >
        {label}
      </span>

      {sidebarCollapsed && hoveredItem === label.toLowerCase() && (
        <div className="absolute left-16 bg-bg-secondary text-text-primary px-3 py-2 rounded-lg shadow-lg min-w-max z-50 border border-border animate-in fade-in slide-in-from-left-5 duration-200">
          {label}
        </div>
      )}
    </Link>
  )

  return (
    <aside
      ref={sidebarRef}
      className={`sidebar fixed h-screen bg-bg-secondary backdrop-blur-lg transition-all duration-300 ease-in-out border-r border-border ${
        sidebarCollapsed ? "w-[5.5rem]" : "w-72"
      } z-10`}
    >
      <div className="sidebar-header px-4 h-16 flex items-center justify-between border-b border-border">
        {!sidebarCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
              TC
            </div>
            <span className="font-bold text-lg">TeamCollab</span>
          </div>
        )}
      </div>

      <nav
        className={`p-3 h-[calc(100vh-64px)] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent ${
          sidebarCollapsed ? "overflow-x-hidden" : ""
        }`}
      >
        <div className="space-y-2 py-3">
          <NavItem to="/dashboard" icon={FiHome} label="Dashboard" />
          <NavItem to="/dashboard/projects" icon={FiFolder} label="Projects" />
          <NavItem to="/dashboard/chat" icon={FiMessageSquare} label="Chat" />
          <NavItem to="/team" icon={FiUsers} label="Team" />
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <NavItem to="/dashboard/profile" icon={FiSettings} label="Profile" />
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar