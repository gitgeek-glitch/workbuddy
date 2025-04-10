"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { FiMoreHorizontal, FiClock, FiCheck } from "react-icons/fi"
import { addToRecent, updateProject } from "../../store/slices/projectSlice"

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

  return (
    <div className="bg-bg-secondary border border-border rounded-lg shadow-sm overflow-hidden relative">
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">{project.name}</h3>
          <button
            onClick={() => setProjectMenuOpen(!projectMenuOpen)}
            className="text-text-secondary hover:text-accent transition-all duration-300 ease-in-out"
          >
            <FiMoreHorizontal />
          </button>
        </div>
        <p className="text-sm text-text-secondary mb-4">{project.description}</p>

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
                onClick={toggleProjectStatus}
              >
                {project.status === "finished" ? "Mark as Ongoing" : "Mark as Finished"}
              </button>
            </li>
            <li>
              <button className="block w-full text-left px-4 py-2 hover:bg-accent/10 text-text-primary">Edit</button>
            </li>
            <li>
              <button className="block w-full text-left px-4 py-2 hover:bg-accent/10 text-text-primary">Archive</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default ProjectCard