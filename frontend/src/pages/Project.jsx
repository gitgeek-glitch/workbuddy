"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { FiPlus, FiFilter, FiSearch, FiClock, FiCheck } from "react-icons/fi"
import ProjectCard from "../components/projects/ProjectCard"
import NewProjectForm from "../components/projects/NewProjectForm"
import { getProjects } from "../store/slices/projectSlice"

const Project = () => {
  const dispatch = useDispatch()
  const { projects, loading, error } = useSelector((state) => state.projects)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("ongoing") // Default to ongoing projects
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)

  // Fetch projects when component mounts
  useEffect(() => {
    dispatch(getProjects())
  }, [dispatch])

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

  // Filter and sort projects
  const filteredProjects = projects
    .filter((project) => {
      // First filter by ongoing/finished status
      if (activeTab === "ongoing") {
        return project.status !== "Finished"
      } else {
        return project.status === "Finished"
      }
    })
    .filter((project) => {
      // Then apply additional filters for ongoing projects
      if (activeTab === "ongoing") {
        if (filter === "important") {
          return project.important === true
        }
        return true // "all" filter shows everything
      }
      return true // No additional filters for finished projects
    })
    .filter(
      (project) =>
        searchTerm === "" ||
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    // Sort by deadline (ascending) - projects with no deadline come last
    .sort((a, b) => {
      if (!a.deadline) return 1
      if (!b.deadline) return -1
      return new Date(a.deadline) - new Date(b.deadline)
    })

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button className="btn-primary flex items-center" onClick={() => setShowNewProjectModal(true)}>
          <FiPlus className="mr-1" /> New Project
        </button>
      </div>

      {/* Tabs for Ongoing/Finished Projects */}
      <div className="flex border-b border-border mb-6">
        <button
          onClick={() => setActiveTab("ongoing")}
          className={`flex items-center px-4 py-2 border-b-2 ${
            activeTab === "ongoing" ? "border-accent text-accent" : "border-transparent hover:text-accent"
          }`}
        >
          <FiClock className="mr-2" /> Ongoing Projects
        </button>
        <button
          onClick={() => setActiveTab("finished")}
          className={`flex items-center px-4 py-2 border-b-2 ${
            activeTab === "finished" ? "border-accent text-accent" : "border-transparent hover:text-accent"
          }`}
        >
          <FiCheck className="mr-2" /> Finished Projects
        </button>
      </div>

      {/* Search and filters - only show filters for ongoing tab */}
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

        {activeTab === "ongoing" && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center mr-2">
              <FiFilter className="mr-1" />
              <span>Filter:</span>
            </div>
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-md text-sm ${
                filter === "all" ? "bg-accent text-white" : "bg-bg-secondary"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("important")}
              className={`px-3 py-1 rounded-md text-sm ${
                filter === "important" ? "bg-accent text-white" : "bg-bg-secondary"
              }`}
            >
              Important
            </button>
          </div>
        )}
      </div>

      {filteredProjects.length === 0 ? (
        <div className="bg-bg-secondary border border-border rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No {activeTab} projects found</h3>
          <p className="text-text-secondary mb-4">
            {searchTerm
              ? "Try a different search term or filter"
              : activeTab === "ongoing"
                ? "Create your first project to get started"
                : "Complete a project to see it here"}
          </p>
          {activeTab === "ongoing" && (
            <button className="btn-primary inline-flex items-center" onClick={() => setShowNewProjectModal(true)}>
              <FiPlus className="mr-1" /> Create Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <NewProjectForm onClose={() => setShowNewProjectModal(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Project