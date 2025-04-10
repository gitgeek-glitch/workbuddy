"use client"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FiCheckCircle, FiClock, FiStar, FiTrash2, FiCheck } from "react-icons/fi"
import axios from "axios" // Make sure axios is imported

const ProjectCard = ({ project, onDelete, onFinish }) => {
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Format date to a readable format
  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }
  
  // Handle delete project
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
      try {
        setIsProcessing(true)
        
        // Call API to delete project
        await axios.delete(`/api/projects/${project._id}`)
        
        // Call the parent component's onDelete handler
        if (onDelete) {
          onDelete(project._id)
        }
      } catch (error) {
        console.error("Failed to delete project:", error)
        alert("Failed to delete project. Please try again.")
      } finally {
        setIsProcessing(false)
      }
    }
  }
  
  // Handle finish project
  const handleFinish = async () => {
    if (window.confirm(`Mark "${project.name}" as finished?`)) {
      try {
        setIsProcessing(true)
        
        // Call API to finish project
        await axios.patch(`/api/projects/${project._id}/finish`)
        
        // Call the parent component's onFinish handler
        if (onFinish) {
          onFinish(project._id)
        }
      } catch (error) {
        console.error("Failed to mark project as finished:", error)
        alert("Failed to mark project as finished. Please try again.")
      } finally {
        setIsProcessing(false)
      }
    }
  }
  
  return (
    <div className="relative border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="absolute top-2 right-2 flex space-x-2">
        {project.status !== "Finished" && (
          <button 
            className="text-green-500 hover:text-green-700 focus:outline-none"
            onClick={handleFinish}
            title="Mark as finished"
            disabled={isProcessing}
          >
            <FiCheck className="w-5 h-5" />
          </button>
        )}
        <button 
          className="text-red-500 hover:text-red-700 focus:outline-none"
          onClick={handleDelete}
          title="Delete project"
          disabled={isProcessing}
        >
          <FiTrash2 className="w-5 h-5" />
        </button>
      </div>
      
      <h3 className="font-bold text-lg">{project.name}</h3>
      {project.important && <FiStar className="text-yellow-500 inline-block ml-2" />}
      
      <p className="text-gray-600 mt-2">{project.description}</p>
      
      {project.deadline && (
        <div className="flex items-center mt-3 text-sm text-gray-500">
          <FiClock className="mr-1" />
          <span>Deadline: {formatDate(project.deadline)}</span>
        </div>
      )}
      
      <div className="mt-4 flex justify-between items-center">
        {project.status === "Finished" ? (
          <span className="flex items-center text-green-600">
            <FiCheckCircle className="mr-1" /> Finished
          </span>
        ) : (
          <button 
            onClick={() => navigate(`/projects/${project._id}`)} 
            className="btn-primary btn-sm"
          >
            View Project
          </button>
        )}
        <span className="text-sm text-gray-500">
          {project.members?.length || 0} member{project.members?.length !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  )
}

export default ProjectCard