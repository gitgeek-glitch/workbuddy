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

  const [projectsExpanded, setProjectsExpanded] = useState(true)
  const [starredExpanded, setStarredExpanded] = useState(true)
  const [recentExpanded, setRecentExpanded] = useState(true)
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
    return location.pathname === path
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
    <aside ref={sidebarRef} className={`sidebar ${sidebarCollapsed ? "w-16" : "w-64"}`}>
      <div className="sidebar-header">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center text-white font-bold flex-shrink-0">
            TC
          </div>
          <span
            className={`font-bold text-lg transition-opacity duration-200 ${sidebarCollapsed ? "opacity-0 w-0" : "opacity-100"}`}
          >
            TeamCollab
          </span>
        </Link>

        <button
          onClick={() => dispatch(toggleSidebar())}
          className={`p-1 rounded-md hover:bg-bg-primary text-text-secondary transition-transform duration-300 ${
            sidebarCollapsed ? "rotate-180" : ""
          }`}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <FiChevronLeft size={16} />
        </button>
      </div>

      <nav className={`p-2 h-[calc(100vh-65px)] overflow-y-auto ${sidebarCollapsed ? "overflow-x-hidden" : ""}`}>
        <ul className="space-y-1">
          <li>
            <Link
              to="/dashboard"
              className={`sidebar-link ${isActive("/dashboard") ? "sidebar-link-active" : "sidebar-link-inactive"}`}
              onMouseEnter={() => setHoveredItem("dashboard")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <FiHome
                size={18}
                className={`flex-shrink-0 ${isActive("/dashboard") ? "text-accent z-10" : sidebarCollapsed ? "text-text-secondary" : ""}`}
              />
              <span className={`transition-opacity duration-200 ${sidebarCollapsed ? "opacity-0 w-0" : "opacity-100"}`}>
                Dashboard
              </span>

              {sidebarCollapsed && hoveredItem === "dashboard" && <div className="tooltip left-16">Dashboard</div>}
            </Link>
          </li>

          {/* Projects Section */}
          <li>
            <button
              onClick={() => {
                if (sidebarCollapsed) {
                  dispatch(setSidebarCollapsed(false))
                } else {
                  setProjectsExpanded(!projectsExpanded)
                }
              }}
              className={`sidebar-section ${sidebarCollapsed ? "hover:bg-bg-primary" : "hover:bg-bg-primary"}`}
              onMouseEnter={() => setHoveredItem("projects")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="flex items-center space-x-3">
                <FiFolder size={18} className={`flex-shrink-0 ${sidebarCollapsed ? "text-text-secondary" : ""}`} />
                <span
                  className={`transition-opacity duration-200 ${sidebarCollapsed ? "opacity-0 w-0" : "opacity-100"}`}
                >
                  Projects
                </span>
              </div>

              {!sidebarCollapsed && (
                <>
                  {projectsExpanded ? (
                    <FiChevronDown size={16} className="text-text-secondary" />
                  ) : (
                    <FiChevronRight size={16} className="text-text-secondary" />
                  )}
                </>
              )}

              {sidebarCollapsed && hoveredItem === "projects" && <div className="tooltip left-16">Projects</div>}
            </button>

            {/* Only show project list when sidebar is expanded and projects section is expanded */}
            {!sidebarCollapsed && projectsExpanded && (
              <ul className="mt-1 space-y-1 pl-6">
                {projects.map((project) => (
                  <li key={project.id} className="project-menu-container relative">
                    <Link
                      to={`/projects/${project.id}`}
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-colors duration-200 group ${
                        isActive(`/projects/${project.id}`)
                          ? "bg-accent bg-opacity-10 text-accent"
                          : "hover:bg-bg-primary text-text-primary"
                      }`}
                      onClick={() => handleProjectClick(project.id)}
                    >
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          project.status === "active" ? "bg-success" : "bg-warning"
                        }`}
                      ></span>

                      <span className="truncate">{project.name}</span>

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
                      <div className="dropdown-menu right-0 mt-1 w-48">
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm hover:bg-bg-primary text-left"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            navigate(`/projects/${project.id}`)
                            setProjectMenuOpen(null)
                          }}
                        >
                          <FiFolder className="mr-2" />
                          View project
                        </button>
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm hover:bg-bg-primary text-left"
                          onClick={(e) => handleStarProject(project.id, e)}
                        >
                          <FiStar className="mr-2" />
                          {starredProjects.some((p) => p.id === project.id) ? "Unstar project" : "Star project"}
                        </button>
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm hover:bg-bg-primary text-left"
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
                    )}
                  </li>
                ))}

                <li>
                  <button className="flex items-center space-x-2 px-3 py-1.5 rounded-md text-text-secondary hover:bg-bg-primary hover:text-text-primary transition-colors duration-200 w-full">
                    <FiPlus size={14} />
                    <span>New Project</span>
                  </button>
                </li>
              </ul>
            )}
          </li>

          {/* Starred Projects Section */}
          <li>
            <button
              onClick={() => {
                if (sidebarCollapsed) {
                  dispatch(setSidebarCollapsed(false))
                } else {
                  setStarredExpanded(!starredExpanded)
                }
              }}
              className={`sidebar-section ${sidebarCollapsed ? "hover:bg-bg-primary" : "hover:bg-bg-primary"} mt-2`}
              onMouseEnter={() => setHoveredItem("starred")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="flex items-center space-x-3">
                <FiStar size={18} className={`flex-shrink-0 ${sidebarCollapsed ? "text-text-secondary" : ""}`} />
                <span
                  className={`transition-opacity duration-200 ${sidebarCollapsed ? "opacity-0 w-0" : "opacity-100"}`}
                >
                  Starred
                </span>
              </div>

              {!sidebarCollapsed && (
                <>
                  {starredExpanded ? (
                    <FiChevronDown size={16} className="text-text-secondary" />
                  ) : (
                    <FiChevronRight size={16} className="text-text-secondary" />
                  )}
                </>
              )}

              {sidebarCollapsed && hoveredItem === "starred" && <div className="tooltip left-16">Starred</div>}
            </button>

            {!sidebarCollapsed && starredExpanded && (
              <ul className="mt-1 space-y-1 pl-6">
                {starredProjects.length > 0 ? (
                  starredProjects.map((project) => (
                    <li key={project.id}>
                      <Link
                        to={`/projects/${project.id}`}
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-colors duration-200 ${
                          isActive(`/projects/${project.id}`)
                            ? "bg-accent bg-opacity-10 text-accent"
                            : "hover:bg-bg-primary text-text-primary"
                        }`}
                        onClick={() => handleProjectClick(project.id)}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            project.status === "active" ? "bg-success" : "bg-warning"
                          }`}
                        ></span>
                        <span className="truncate">{project.name}</span>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-2 text-text-secondary text-sm">No starred projects</li>
                )}
              </ul>
            )}
          </li>

          {/* Recent Projects Section */}
          <li>
            <button
              onClick={() => {
                if (sidebarCollapsed) {
                  dispatch(setSidebarCollapsed(false))
                } else {
                  setRecentExpanded(!recentExpanded)
                }
              }}
              className={`sidebar-section ${sidebarCollapsed ? "hover:bg-bg-primary" : "hover:bg-bg-primary"} mt-2`}
              onMouseEnter={() => setHoveredItem("recent")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="flex items-center space-x-3">
                <FiGitCommit size={18} className={`flex-shrink-0 ${sidebarCollapsed ? "text-text-secondary" : ""}`} />
                <span
                  className={`transition-opacity duration-200 ${sidebarCollapsed ? "opacity-0 w-0" : "opacity-100"}`}
                >
                  Recent
                </span>
              </div>

              {!sidebarCollapsed && (
                <>
                  {recentExpanded ? (
                    <FiChevronDown size={16} className="text-text-secondary" />
                  ) : (
                    <FiChevronRight size={16} className="text-text-secondary" />
                  )}
                </>
              )}

              {sidebarCollapsed && hoveredItem === "recent" && <div className="tooltip left-16">Recent</div>}
            </button>

            {!sidebarCollapsed && recentExpanded && (
              <ul className="mt-1 space-y-1 pl-6">
                {recentProjects.length > 0 ? (
                  recentProjects.map((project) => (
                    <li key={project.id}>
                      <Link
                        to={`/projects/${project.id}`}
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-colors duration-200 ${
                          isActive(`/projects/${project.id}`)
                            ? "bg-accent bg-opacity-10 text-accent"
                            : "hover:bg-bg-primary text-text-primary"
                        }`}
                        onClick={() => handleProjectClick(project.id)}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            project.status === "active" ? "bg-success" : "bg-warning"
                          }`}
                        ></span>
                        <span className="truncate">{project.name}</span>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-2 text-text-secondary text-sm">No recent projects</li>
                )}
              </ul>
            )}
          </li>

          <li>
            <Link
              to="/chat"
              className={`sidebar-link ${isActive("/chat") ? "sidebar-link-active" : "sidebar-link-inactive"}`}
              onMouseEnter={() => setHoveredItem("chat")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <FiMessageSquare
                size={18}
                className={`flex-shrink-0 ${isActive("/chat") ? "text-accent z-10" : sidebarCollapsed ? "text-text-secondary" : ""}`}
              />
              <span className={`transition-opacity duration-200 ${sidebarCollapsed ? "opacity-0 w-0" : "opacity-100"}`}>
                Chat
              </span>

              {sidebarCollapsed && hoveredItem === "chat" && <div className="tooltip left-16">Chat</div>}
            </Link>
          </li>

          <li>
            <Link
              to="/team"
              className={`sidebar-link ${isActive("/team") ? "sidebar-link-active" : "sidebar-link-inactive"}`}
              onMouseEnter={() => setHoveredItem("team")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <FiUsers
                size={18}
                className={`flex-shrink-0 ${isActive("/team") ? "text-accent z-10" : sidebarCollapsed ? "text-text-secondary" : ""}`}
              />
              <span className={`transition-opacity duration-200 ${sidebarCollapsed ? "opacity-0 w-0" : "opacity-100"}`}>
                Team
              </span>

              {sidebarCollapsed && hoveredItem === "team" && <div className="tooltip left-16">Team</div>}
            </Link>
          </li>
        </ul>

        <div className="mt-6 pt-6 border-t border-border">
          <ul className="space-y-1">
            <li>
              <Link
                to="/profile"
                className={`sidebar-link ${isActive("/profile") ? "sidebar-link-active" : "sidebar-link-inactive"}`}
                onMouseEnter={() => setHoveredItem("profile")}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <FiSettings
                  size={18}
                  className={`flex-shrink-0 ${isActive("/profile") ? "text-accent z-10" : sidebarCollapsed ? "text-text-secondary" : ""}`}
                />
                <span
                  className={`transition-opacity duration-200 ${sidebarCollapsed ? "opacity-0 w-0" : "opacity-100"}`}
                >
                  Profile
                </span>

                {sidebarCollapsed && hoveredItem === "profile" && <div className="tooltip left-16">Profile</div>}
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar