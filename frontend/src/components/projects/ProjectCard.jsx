"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { FiMoreHorizontal, FiClock, FiCheck, FiCalendar, FiStar } from "react-icons/fi"
import { addToRecent, updateProject, toggleProjectImportant } from "../../store/slices/projectSlice"

const ProjectCard = ({ project }) => {
  const dispatch = useDispatch()
  const [projectMenuOpen, setProjectMenuOpen] = useState(false)

  const handleProjectClick = () => {
    dispatch(addToRecent(project.id))
  }

  const toggleProjectStatus = () => {
    const newStatus = project.status === "finished" ? "active" : "finished"
    dispatch(
      updateProject({
        id: project.id,
        projectData: { ...project, status: newStatus },
      }),
    )
    setProjectMenuOpen(false)
  }

  const handleToggleImportant = () => {
    dispatch(toggleProjectImportant(project.id))
    setProjectMenuOpen(false)
  }

  // Format deadline date
  const formatDeadline = (deadline) => {
    if (!deadline) return "No deadline"

    const date = new Date(deadline)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Check if deadline is today
    if (date.toDateString() === today.toDateString()) {
      return "Today"
    }

    // Check if deadline is tomorrow
    if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    }

    // Otherwise return formatted date
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: today.getFullYear() !== date.getFullYear() ? "numeric" : undefined,
    })
  }

  // Calculate days remaining
  const getDaysRemaining = (deadline) => {
    if (!deadline) return null

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const deadlineDate = new Date(deadline)
    deadlineDate.setHours(0, 0, 0, 0)

    const diffTime = deadlineDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }

  const daysRemaining = project.deadline ? getDaysRemaining(project.deadline) : null

  return (
    <div className="bg-bg-secondary border border-border rounded-lg shadow-sm overflow-hidden relative">
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <h3 className="font-medium">{project.name}</h3>
            {project.important && <FiStar className="ml-2 text-warning" title="Important project" />}
          </div>
          <button
            onClick={() => setProjectMenuOpen(!projectMenuOpen)}
            className="text-text-secondary hover:text-accent transition-all duration-300 ease-in-out"
          >
            <FiMoreHorizontal />
          </button>
        </div>
        <p className="text-sm text-text-secondary mb-4">{project.description}</p>

        {project.deadline && project.status !== "finished" && (
          <div className="mb-3 flex items-center text-xs text-text-secondary">
            <FiCalendar className="mr-1" />
            <span>
              {formatDeadline(project.deadline)}
              {daysRemaining !== null && (
                <span
                  className={`ml-1 ${daysRemaining <= 3 ? "text-danger" : daysRemaining <= 7 ? "text-warning" : ""}`}
                >
                  ({daysRemaining} day{daysRemaining !== 1 ? "s" : ""} left)
                </span>
              )}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-text-secondary">
          <div className="flex items-center">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full ${
                project.status === "finished" ? "bg-success/10 text-success" : "bg-accent/10 text-accent"
              }`}
            >
              {project.status === "finished" ? (
                <>
                  <FiCheck className="mr-1" /> Finished
                </>
              ) : (
                <>
                  <FiClock className="mr-1" /> Ongoing
                </>
              )}
            </span>
          </div>
          <Link to={`/projects/${project.id}`} onClick={handleProjectClick} className="text-accent hover:underline">
            View Details
          </Link>
        </div>
      </div>
      {projectMenuOpen && (
        <div className="absolute right-0 top-full bg-bg-secondary border border-border rounded-lg shadow-sm w-48 mt-2 z-10">
          <ul className="py-2">
            <li>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-accent/10 text-text-primary"
                onClick={handleToggleImportant}
              >
                {project.important ? "Remove from Important" : "Mark as Important"}
              </button>
            </li>
            <li>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-accent/10 text-text-primary"
                onClick={toggleProjectStatus}
              >
                {project.status === "finished" ? "Mark as Ongoing" : "Mark as Finished"}
              </button>
            </li>
            <li>
              <button className="block w-full text-left px-4 py-2 hover:bg-accent/10 text-text-primary">Edit</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default ProjectCard