"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { fetchProjects } from "../services/projectService"

const ProjectContext = createContext()

export const useProjects = () => useContext(ProjectContext)

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getProjects = async () => {
      try {
        // In a real app, this would fetch from your API
        const data = await fetchProjects()
        setProjects(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    getProjects()
  }, [])

  const addProject = (project) => {
    setProjects([...projects, project])
  }

  const updateProject = (updatedProject) => {
    setProjects(projects.map((project) => (project.id === updatedProject.id ? updatedProject : project)))
  }

  const deleteProject = (projectId) => {
    setProjects(projects.filter((project) => project.id !== projectId))
  }

  return (
    <ProjectContext.Provider
      value={{
        projects,
        loading,
        error,
        addProject,
        updateProject,
        deleteProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}