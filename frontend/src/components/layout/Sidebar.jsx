"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  FiHome,
  FiFolder,
  FiMessageSquare,
  FiUsers,
  FiSettings,
  FiChevronDown,
  FiChevronRight,
  FiPlus,
  FiStar,
  FiGitCommit,
  FiGitBranch,
  FiMoreHorizontal,
  FiChevronLeft,
  FiArrowRight,
} from "react-icons/fi"

import { toggleSidebar, setSidebarCollapsed } from "../../store/slices/uiSlice"
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

  return (
    <aside
      ref={sidebarRef}
      className={`sidebar fixed h-screen bg-gradient-to-b from-bg-secondary/80 to-bg-secondary backdrop-blur-md transition-all duration-300 ease-in-out border-r border-border/30 ${
        sidebarCollapsed ? "w-20" : "w-72"
      } z-10`}
    >
      <div className="sidebar-header px-4 h-16 flex items-center justify-between border-b border-border/20">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className={`p-2 rounded-full bg-bg-primary/80 hover:bg-bg-primary text-text-secondary hover:text-accent transition-all duration-300 ease-in-out transform hover:scale-105 ${
            sidebarCollapsed ? "rotate-180" : ""
          }`}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <FiChevronLeft size={16} />
        </button>
      </div>

      <nav
        className={`p-3 h-[calc(100vh-64px)] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent ${
          sidebarCollapsed ? "overflow-x-hidden" : ""
        }`}
      >
        <ul className="space-y-2 py-2">
          <li>
            <Link
              to="/dashboard"
              className={`relative flex items-center rounded-xl px-4 py-3 transition-all duration-200 group overflow-hidden ${
                isActive("/dashboard")
                  ? "bg-accent text-white font-medium shadow-md shadow-accent/20"
                  : "hover:bg-bg-primary/80 text-text-primary"
              }`}
              onMouseEnter={() => setHoveredItem("dashboard")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {isActive("/dashboard") && (
                <span className="absolute inset-0 bg-gradient-to-r from-accent to-accent/80 opacity-100"></span>
              )}
              <FiHome
                size={20}
                className={`flex-shrink-0 relative z-10 ${
                  isActive("/dashboard") ? "text-white" : sidebarCollapsed ? "text-text-secondary" : ""
                }`}
              />
              <span
                className={`ml-3 relative z-10 transition-all duration-200 ${
                  sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                }`}
              >
                Dashboard
              </span>

              {sidebarCollapsed && hoveredItem === "dashboard" && (
                <div className="absolute left-16 bg-bg-secondary text-text-primary px-3 py-2 rounded-md shadow-lg min-w-max z-50">
                  Dashboard
                </div>
              )}
            </Link>
          </li>

          {/* Projects Section */}
          <li className="mt-2">
            <button
              onClick={() => {
                if (sidebarCollapsed) {
                  dispatch(setSidebarCollapsed(false))
                } else {
                  setProjectsExpanded(!projectsExpanded)
                }
              }}
              className={`w-full flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-200 ${
                sidebarCollapsed ? "hover:bg-bg-primary/80" : "hover:bg-bg-primary/80"
              }`}
              onMouseEnter={() => setHoveredItem("projects")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="flex items-center space-x-3">
                <FiFolder size={20} className={`flex-shrink-0 ${sidebarCollapsed ? "text-text-secondary" : ""}`} />
                <span
                  className={`transition-all duration-200 font-medium ${
                    sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                  }`}
                >
                  Projects
                </span>
              </div>

              {!sidebarCollapsed && (
                <div className="h-5 w-5 flex items-center justify-center">
                  {projectsExpanded ? (
                    <FiChevronDown size={16} className="text-text-secondary" />
                  ) : (
                    <FiChevronRight size={16} className="text-text-secondary" />
                  )}
                </div>
              )}

              {sidebarCollapsed && hoveredItem === "projects" && (
                <div className="absolute left-16 bg-bg-secondary text-text-primary px-3 py-2 rounded-md shadow-lg min-w-max z-50">
                  Projects
                </div>
              )}
            </button>

            {/* Only show project list when sidebar is expanded and projects section is expanded */}
            {!sidebarCollapsed && projectsExpanded && (
              <ul className="mt-2 space-y-1 pl-4">
                {projects.map((project) => (
                  <li key={project.id} className="project-menu-container relative">
                    <Link
                      to={`/projects/${project.id}`}
                      className={`flex items-center rounded-lg px-4 py-2.5 transition-all duration-200 group ${
                        isActive(`/projects/${project.id}`)
                          ? "bg-accent/10 text-accent font-medium"
                          : "hover:bg-bg-primary/90 text-text-primary hover:text-accent/80"
                      }`}
                      onClick={() => handleProjectClick(project.id)}
                    >
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          project.status === "active" ? "bg-success" : "bg-warning"
                        }`}
                      ></span>

                      <span className="truncate ml-3">{project.name}</span>

                      <button
                        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-md hover:bg-bg-primary"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setProjectMenuOpen(projectMenuOpen === project.id ? null : project.id)
                        }}
                      >
                        <FiMoreHorizontal size={14} className="text-text-secondary" />
                      </button>
                    </Link>

                    {projectMenuOpen === project.id && (
                      <div className="absolute right-0 mt-1 z-20 w-56 rounded-lg overflow-hidden bg-bg-secondary/95 backdrop-blur-md border border-border/30 shadow-xl">
                        <div className="p-2">
                          <button
                            className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-bg-primary/80 hover:text-accent transition-colors text-left"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              navigate(`/projects/${project.id}`)
                              setProjectMenuOpen(null)
                            }}
                          >
                            <FiArrowRight className="mr-2" />
                            View project
                          </button>
                          <button
                            className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-bg-primary/80 hover:text-accent transition-colors text-left"
                            onClick={(e) => handleStarProject(project.id, e)}
                          >
                            <FiStar className="mr-2" />
                            {starredProjects.some((p) => p.id === project.id) ? "Unstar project" : "Star project"}
                          </button>
                          <button
                            className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-bg-primary/80 hover:text-accent transition-colors text-left"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setProjectMenuOpen(null)
                            }}
                          >
                            <FiGitBranch className="mr-2" />
                            Create branch
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}

                <li>
                  <button className="flex items-center space-x-2 w-full rounded-lg px-4 py-2.5 text-text-secondary hover:bg-bg-primary/90 hover:text-accent/80 transition-all duration-200 group">
                    <div className="h-6 w-6 rounded-full bg-bg-primary flex items-center justify-center group-hover:bg-accent/10">
                      <FiPlus size={14} className="group-hover:text-accent" />
                    </div>
                    <span>New Project</span>
                  </button>
                </li>
              </ul>
            )}
          </li>

          {/* Starred Projects Section */}
          <li className="mt-2">
            <button
              onClick={() => {
                if (sidebarCollapsed) {
                  dispatch(setSidebarCollapsed(false))
                } else {
                  setStarredExpanded(!starredExpanded)
                }
              }}
              className={`w-full flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-200 ${
                sidebarCollapsed ? "hover:bg-bg-primary/80" : "hover:bg-bg-primary/80"
              }`}
              onMouseEnter={() => setHoveredItem("starred")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="flex items-center space-x-3">
                <FiStar size={20} className={`flex-shrink-0 ${sidebarCollapsed ? "text-text-secondary" : ""}`} />
                <span
                  className={`transition-all duration-200 font-medium ${
                    sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                  }`}
                >
                  Starred
                </span>
              </div>

              {!sidebarCollapsed && (
                <div className="h-5 w-5 flex items-center justify-center">
                  {starredExpanded ? (
                    <FiChevronDown size={16} className="text-text-secondary" />
                  ) : (
                    <FiChevronRight size={16} className="text-text-secondary" />
                  )}
                </div>
              )}

              {sidebarCollapsed && hoveredItem === "starred" && (
                <div className="absolute left-16 bg-bg-secondary text-text-primary px-3 py-2 rounded-md shadow-lg min-w-max z-50">
                  Starred
                </div>
              )}
            </button>

            {!sidebarCollapsed && starredExpanded && (
              <ul className="mt-2 space-y-1 pl-4">
                {starredProjects.length > 0 ? (
                  starredProjects.map((project) => (
                    <li key={project.id}>
                      <Link
                        to={`/projects/${project.id}`}
                        className={`flex items-center rounded-lg px-4 py-2.5 transition-all duration-200 group ${
                          isActive(`/projects/${project.id}`)
                            ? "bg-accent/10 text-accent font-medium"
                            : "hover:bg-bg-primary/90 text-text-primary hover:text-accent/80"
                        }`}
                        onClick={() => handleProjectClick(project.id)}
                      >
                        <span
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            project.status === "active" ? "bg-success" : "bg-warning"
                          }`}
                        ></span>
                        <span className="truncate ml-3">{project.name}</span>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-3 text-text-secondary text-sm italic rounded-lg bg-bg-primary/50">
                    No starred projects
                  </li>
                )}
              </ul>
            )}
          </li>

          {/* Recent Projects Section */}
          <li className="mt-2">
            <button
              onClick={() => {
                if (sidebarCollapsed) {
                  dispatch(setSidebarCollapsed(false))
                } else {
                  setRecentExpanded(!recentExpanded)
                }
              }}
              className={`w-full flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-200 ${
                sidebarCollapsed ? "hover:bg-bg-primary/80" : "hover:bg-bg-primary/80"
              }`}
              onMouseEnter={() => setHoveredItem("recent")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="flex items-center space-x-3">
                <FiGitCommit size={20} className={`flex-shrink-0 ${sidebarCollapsed ? "text-text-secondary" : ""}`} />
                <span
                  className={`transition-all duration-200 font-medium ${
                    sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                  }`}
                >
                  Recent
                </span>
              </div>

              {!sidebarCollapsed && (
                <div className="h-5 w-5 flex items-center justify-center">
                  {recentExpanded ? (
                    <FiChevronDown size={16} className="text-text-secondary" />
                  ) : (
                    <FiChevronRight size={16} className="text-text-secondary" />
                  )}
                </div>
              )}

              {sidebarCollapsed && hoveredItem === "recent" && (
                <div className="absolute left-16 bg-bg-secondary text-text-primary px-3 py-2 rounded-md shadow-lg min-w-max z-50">
                  Recent
                </div>
              )}
            </button>

            {!sidebarCollapsed && recentExpanded && (
              <ul className="mt-2 space-y-1 pl-4">
                {recentProjects.length > 0 ? (
                  recentProjects.map((project) => (
                    <li key={project.id}>
                      <Link
                        to={`/projects/${project.id}`}
                        className={`flex items-center rounded-lg px-4 py-2.5 transition-all duration-200 group ${
                          isActive(`/projects/${project.id}`)
                            ? "bg-accent/10 text-accent font-medium"
                            : "hover:bg-bg-primary/90 text-text-primary hover:text-accent/80"
                        }`}
                        onClick={() => handleProjectClick(project.id)}
                      >
                        <span
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            project.status === "active" ? "bg-success" : "bg-warning"
                          }`}
                        ></span>
                        <span className="truncate ml-3">{project.name}</span>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-3 text-text-secondary text-sm italic rounded-lg bg-bg-primary/50">
                    No recent projects
                  </li>
                )}
              </ul>
            )}
          </li>

          <li className="mt-2">
            <Link
              to="/dashboard/chat"
              className={`relative flex items-center rounded-xl px-4 py-3 transition-all duration-200 group overflow-hidden ${
                isActive("/dashboard/chat")
                  ? "bg-accent text-white font-medium shadow-md shadow-accent/20"
                  : "hover:bg-bg-primary/80 text-text-primary"
              }`}
              onMouseEnter={() => setHoveredItem("chat")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {isActive("/dashboard/chat") && (
                <span className="absolute inset-0 bg-gradient-to-r from-accent to-accent/80 opacity-100"></span>
              )}
              <FiMessageSquare
                size={20}
                className={`flex-shrink-0 relative z-10 ${
                  isActive("/dashboard/chat") ? "text-white" : sidebarCollapsed ? "text-text-secondary" : ""
                }`}
              />
              <span
                className={`ml-3 relative z-10 transition-all duration-200 ${
                  sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                }`}
              >
                Chat
              </span>

              {sidebarCollapsed && hoveredItem === "chat" && (
                <div className="absolute left-16 bg-bg-secondary text-text-primary px-3 py-2 rounded-md shadow-lg min-w-max z-50">
                  Chat
                </div>
              )}
            </Link>
          </li>

          <li className="mt-2">
            <Link
              to="/team"
              className={`relative flex items-center rounded-xl px-4 py-3 transition-all duration-200 group overflow-hidden ${
                isActive("/team")
                  ? "bg-accent text-white font-medium shadow-md shadow-accent/20"
                  : "hover:bg-bg-primary/80 text-text-primary"
              }`}
              onMouseEnter={() => setHoveredItem("team")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {isActive("/team") && (
                <span className="absolute inset-0 bg-gradient-to-r from-accent to-accent/80 opacity-100"></span>
              )}
              <FiUsers
                size={20}
                className={`flex-shrink-0 relative z-10 ${
                  isActive("/team") ? "text-white" : sidebarCollapsed ? "text-text-secondary" : ""
                }`}
              />
              <span
                className={`ml-3 relative z-10 transition-all duration-200 ${
                  sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                }`}
              >
                Team
              </span>

              {sidebarCollapsed && hoveredItem === "team" && (
                <div className="absolute left-16 bg-bg-secondary text-text-primary px-3 py-2 rounded-md shadow-lg min-w-max z-50">
                  Team
                </div>
              )}
            </Link>
          </li>
        </ul>

        <div className="mt-8 pt-6 border-t border-border/20">
          <ul className="space-y-2 py-2">
            <li>
              <Link
                to="/dashboard/profile"
                className={`relative flex items-center rounded-xl px-4 py-3 transition-all duration-200 group overflow-hidden ${
                  isActive("/profile")
                    ? "bg-accent text-white font-medium shadow-md shadow-accent/20"
                    : "hover:bg-bg-primary/80 text-text-primary"
                }`}
                onMouseEnter={() => setHoveredItem("profile")}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {isActive("/profile") && (
                  <span className="absolute inset-0 bg-gradient-to-r from-accent to-accent/80 opacity-100"></span>
                )}
                <FiSettings
                  size={20}
                  className={`flex-shrink-0 relative z-10 ${
                    isActive("/profile") ? "text-white" : sidebarCollapsed ? "text-text-secondary" : ""
                  }`}
                />
                <span
                  className={`ml-3 relative z-10 transition-all duration-200 ${
                    sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                  }`}
                >
                  Profile
                </span>

                {sidebarCollapsed && hoveredItem === "profile" && (
                  <div className="absolute left-16 bg-bg-secondary text-text-primary px-3 py-2 rounded-md shadow-lg min-w-max z-50">
                    Profile
                  </div>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar