"use client"

import { useNavigate } from "react-router-dom"
import { FiCheckCircle, FiClock, FiStar } from "react-icons/fi"

const ProjectCard = ({ project }) => {
  const navigate = useNavigate()

  // Format date to a readable format
  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <div className="bg-bg-secondary border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{project.name}</h3>
        {project.important && <FiStar className="text-warning" />}
      </div>
      <p className="text-sm text-text-secondary mb-3 line-clamp-2">{project.description}</p>

      {project.deadline && (
        <div className="flex items-center text-xs text-text-secondary mb-2">
          <FiClock className="mr-1" />
          <span>Deadline: {formatDate(project.deadline)}</span>
        </div>
      )}

      <div className="flex justify-between items-center mt-3">
        {project.status === "Finished" ? (
          <div className="flex items-center text-xs text-green-500">
            <FiCheckCircle className="mr-1" />
            <span>Finished</span>
          </div>
        ) : (
          <button onClick={() => navigate(`/projects/${project._id}`)} className="btn-primary btn-sm">
            View Project
          </button>
        )}

        <div className="text-xs text-text-secondary">
          {project.members?.length || 0} member{project.members?.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  )
}

export default ProjectCard