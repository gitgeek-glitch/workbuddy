"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { FiUsers, FiSearch, FiStar } from "react-icons/fi"

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg p-4 my-4">
        Error loading projects: {error}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Team Management</h1>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full bg-bg-primary border border-border rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="absolute left-3 top-2.5 text-text-secondary" />
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="bg-bg-secondary border border-border rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No projects found</h3>
          <p className="text-text-secondary mb-4">
            {searchTerm ? "Try a different search term" : "Create your first project to get started"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              className="bg-bg-secondary border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200 hover-card"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{project.name}</h3>
                {project.important && <FiStar className="text-warning" />}
              </div>
              <p className="text-sm text-text-secondary mb-3 line-clamp-2">{project.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-text-secondary">
                  {project.members?.length || 0} member{project.members?.length !== 1 ? "s" : ""}
                </span>
                <button
                  onClick={() => navigate(`/team/${project._id}`)}
                  className="btn-primary btn-sm flex items-center"
                >
                  <FiUsers className="mr-1" /> View Team
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Team