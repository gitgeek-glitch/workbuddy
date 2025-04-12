"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { FiUsers, FiSearch, FiStar, FiCalendar, FiClock, FiCheck } from "react-icons/fi"

const Team = () => {
  const navigate = useNavigate()
  const { projects, loading, error } = useSelector((state) => state.projects)
  const [searchTerm, setSearchTerm] = useState("")

  // Filter projects based on search term
  const filteredProjects = projects.filter(
    (project) =>
      searchTerm === "" ||
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Finished":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      case "In Progress":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      case "Planning":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 my-4 shadow-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
        Error loading projects: {error}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold">Team Management</h1>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md mx-auto md:mx-0">
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full bg-bg-secondary border border-border rounded-full py-3 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-4 top-3 text-text-secondary">
            <FiSearch size={20} />
          </span>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="bg-bg-secondary border border-border rounded-xl p-12 text-center shadow-sm">
          <FiUsers size={48} className="mx-auto mb-4 text-text-secondary" />
          <h3 className="text-xl font-medium mb-3">No projects found</h3>
          <p className="text-text-secondary mb-0 max-w-md mx-auto">
            {searchTerm ? "Try a different search term" : "Create your first project to get started"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              className="bg-bg-secondary border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold truncate mr-2">{project.name}</h3>
                  {project.important && <FiStar className="text-yellow-500 flex-shrink-0" size={18} />}
                </div>
                
                <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                  {project.description || "No description provided"}
                </p>
                
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {project.status && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center ${getStatusBadgeClass(project.status)}`}>
                      {project.status === "Finished" ? (
                        <><FiCheck size={12} className="mr-1" /> {project.status}</>
                      ) : (
                        <><FiClock size={12} className="mr-1" /> {project.status}</>
                      )}
                    </span>
                  )}
                  
                  {project.deadline && formatDate(project.deadline) && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium border border-border bg-bg-primary text-text-secondary flex items-center">
                      <FiCalendar size={12} className="mr-1" /> {formatDate(project.deadline)}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <span className="text-sm text-text-secondary flex items-center">
                    <FiUsers size={16} className="mr-1" /> 
                    {project.members?.length || 0} member{project.members?.length !== 1 ? "s" : ""}
                  </span>
                  
                  <button
                    onClick={() => navigate(`/team/${project._id}`)}
                    className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                  >
                    View Team
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Team