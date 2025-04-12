"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FiSearch, FiMessageSquare, FiUsers } from "react-icons/fi"
import { setActiveProject } from "../../store/slices/chatSlice"

const ProjectChatList = ({ projects, onProjectSelect }) => {
  const dispatch = useDispatch()
  const { activeProjectId, unreadCounts } = useSelector((state) => state.chat)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProjects, setFilteredProjects] = useState(projects)

  useEffect(() => {
    if (projects.length > 0 && !activeProjectId) {
      dispatch(setActiveProject(projects[0]._id))
      onProjectSelect(projects[0]._id)
    }
  }, [projects, activeProjectId, dispatch, onProjectSelect])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProjects(projects)
    } else {
      const filtered = projects.filter((project) => project.name.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilteredProjects(filtered)
    }
  }, [searchTerm, projects])

  const handleProjectClick = (projectId) => {
    dispatch(setActiveProject(projectId))
    onProjectSelect(projectId)
  }

  return (
    <div className="project-list-container">
      <div className="p-5 border-b border-border">
        <h2 className="text-xl font-semibold mb-4 flex items-center text-text-primary">
          <FiMessageSquare className="mr-2 text-accent" />
          Project Chats
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full bg-bg-primary border border-border rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-text-secondary" />
        </div>
      </div>

      {/* Project List */}
      <div className="project-list">
        {filteredProjects.length === 0 ? (
          <div className="project-list-empty">
            <div className="flex flex-col items-center">
              <FiMessageSquare size={24} className="mb-2 opacity-50" />
              {searchTerm ? "No matching projects found" : "No projects available"}
            </div>
          </div>
        ) : (
          <div className="space-y-2 p-2">
            {filteredProjects.map((project) => {
              const unreadCount = unreadCounts[project._id]?.unreadCount || 0
              const isActive = activeProjectId === project._id

              return (
                <button
                  key={project._id}
                  onClick={() => handleProjectClick(project._id)}
                  className={`project-item ${isActive ? "project-item-active" : "project-item-inactive"} hover-card`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 shadow-sm ${
                        isActive ? "bg-white bg-opacity-20" : "bg-gradient-to-br from-bg-primary to-border"
                      }`}
                    >
                      {project.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="project-item-title">
                        <div className="font-medium truncate">{project.name}</div>
                        {unreadCount > 0 && <span className="project-item-badge animate-pulse">{unreadCount}</span>}
                      </div>
                      <div
                        className={`project-item-subtitle ${
                          isActive ? "project-item-subtitle-active" : "project-item-subtitle-inactive"
                        } flex items-center`}
                      >
                        <FiUsers size={10} className="mr-1" />
                        {project.members?.length || 0} members
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectChatList
