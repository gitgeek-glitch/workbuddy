"use client"

import { useState } from "react"
import { FiPlus, FiFilter } from "react-icons/fi"
import { useProjects } from "../context/ProjectContext"
import ProjectCard from "../components/projects/ProjectCard"

const Dashboard = () => {
  const { projects, loading, error } = useProjects()
  const [filter, setFilter] = useState("all")

  if (loading) {
    return <div>Loading projects...</div>
  }

  if (error) {
    return <div>Error loading projects: {error}</div>
  }

  const filteredProjects = filter === "all" ? projects : projects.filter((project) => project.status === filter)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button className="btn-primary flex items-center">
          <FiPlus className="mr-1" /> New Project
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="flex items-center space-x-2">
          <FiFilter />
          <span>Filter:</span>
        </div>
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded-md text-sm ${filter === "all" ? "bg-accent text-white" : "bg-bg-secondary"}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-3 py-1 rounded-md text-sm ${filter === "active" ? "bg-accent text-white" : "bg-bg-secondary"}`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter("archived")}
          className={`px-3 py-1 rounded-md text-sm ${filter === "archived" ? "bg-accent text-white" : "bg-bg-secondary"}`}
        >
          Archived
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}

export default Dashboard