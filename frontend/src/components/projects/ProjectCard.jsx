"use client"

import { useNavigate } from "react-router-dom"
import { FiCheckCircle, FiClock } from "react-icons/fi"

const ProjectCard = ({ project }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-bg-secondary border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
      <p className="text-sm text-text-secondary mb-3">{project.description}</p>
      {project.deadline && (
        <div className="flex items-center text-xs text-text-secondary mb-2">
          <FiClock className="mr-1" />
          <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
        </div>
      )}
      <div className="flex justify-between items-center">
        {project.status === "finished" ? (
          <div className="flex items-center text-xs text-green-500">
            <FiCheckCircle className="mr-1" />
            <span>Finished</span>
          </div>
        ) : (
          <button onClick={() => navigate(`/projects/${project._id}`)} className="btn-primary btn-sm">
            View Project
          </button>
        )}
      </div>
    </div>
  )
}

export default ProjectCard
