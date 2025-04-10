"use client"

import { useState, useEffect, useRef } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { FiPlus, FiX, FiSearch, FiCalendar, FiUser } from "react-icons/fi"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7000"

const NewProjectForm = ({ onClose }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    deadline: "",
    collaborators: [],
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchTimeout, setSearchTimeout] = useState(null)
  const searchRef = useRef(null)

  // Handle input change for form fields
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle search input change with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    // Set new timeout for debounce
    if (value.trim()) {
      const timeout = setTimeout(() => {
        searchUsers(value)
      }, 300) // 300ms debounce
      setSearchTimeout(timeout)
    } else {
      setSearchResults([])
      setIsSearching(false)
    }
  }

  // Search users API call
  const searchUsers = async (query) => {
    if (!query.trim()) return

    setIsSearching(true)
    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")

      const response = await axios.get(`${API_URL}/api/user/search`, {
        params: { query },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Filter out users that are already added as collaborators
      const filteredResults = response.data.data.filter(
        (user) => !formData.collaborators.some((collab) => collab._id === user._id),
      )

      setSearchResults(filteredResults)
    } catch (error) {
      console.error("Error searching users:", error)
      toast.error("Failed to search users. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }

  // Add collaborator to the list
  const addCollaborator = (user) => {
    // Check if maximum collaborators reached (8 total including project creator)
    if (formData.collaborators.length >= 7) {
      toast.warning("Maximum of 7 collaborators can be added (8 total including you)")
      return
    }

    // Check if user is already added
    if (formData.collaborators.some((collab) => collab._id === user._id)) {
      return
    }

    setFormData((prev) => ({
      ...prev,
      collaborators: [...prev.collaborators, user],
    }))

    // Clear search results and term
    setSearchResults([])
    setSearchTerm("")
  }

  // Remove collaborator from the list
  const removeCollaborator = (userId) => {
    setFormData((prev) => ({
      ...prev,
      collaborators: prev.collaborators.filter((collab) => collab._id !== userId),
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (!formData.name.trim()) {
      toast.error("Project name is required")
      return
    }

    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")

      // Prepare data for API
      const projectData = {
        name: formData.name,
        description: formData.description,
        deadline: formData.deadline || null,
        collaborators: formData.collaborators.map((collab) => collab.username),
      }

      // Create project API call
      const response = await axios.post(`${API_URL}/api/project`, projectData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      toast.success("Project created successfully!")

      // Close modal and navigate to the new project
      if (onClose) onClose()
      navigate(`/projects/${response.data.data[0]._id}`)
    } catch (error) {
      console.error("Error creating project:", error)
      toast.error(error.response?.data?.message || "Failed to create project. Please try again.")
    }
  }

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([])
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="bg-bg-primary border border-border rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-6">Create New Project</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Project Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-bg-secondary border border-border rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Enter project name"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full bg-bg-secondary border border-border rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Describe your project"
          ></textarea>
        </div>

        <div className="mb-6">
          <label htmlFor="deadline" className="block text-sm font-medium mb-1">
            Deadline
          </label>
          <div className="relative">
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full bg-bg-secondary border border-border rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-accent"
              min={new Date().toISOString().split("T")[0]} // Set min date to today
            />
            <FiCalendar className="absolute left-3 top-2.5 text-text-secondary" />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Add Collaborators ({formData.collaborators.length}/7)
          </label>
          <div className="relative" ref={searchRef}>
            <div className="flex items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full bg-bg-secondary border border-border rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="Search by username or name"
                />
                <FiSearch className="absolute left-3 top-2.5 text-text-secondary" />
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-bg-primary border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((user) => (
                  <div
                    key={user._id}
                    className="p-2 hover:bg-bg-secondary cursor-pointer flex items-center justify-between"
                    onClick={() => addCollaborator(user)}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-accent bg-opacity-10 rounded-full flex items-center justify-center mr-2">
                        <FiUser className="text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">{user.fullName}</p>
                        <p className="text-xs text-text-secondary">@{user.username}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="text-accent hover:text-accent-dark"
                      onClick={(e) => {
                        e.stopPropagation()
                        addCollaborator(user)
                      }}
                    >
                      <FiPlus />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {isSearching && (
              <div className="absolute z-10 mt-1 w-full bg-bg-primary border border-border rounded-md shadow-lg p-4 text-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-accent mx-auto"></div>
                <p className="mt-2 text-sm">Searching users...</p>
              </div>
            )}
          </div>

          {/* Selected Collaborators */}
          {formData.collaborators.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium mb-2">Selected Collaborators:</p>
              <div className="flex flex-wrap gap-2">
                {formData.collaborators.map((collab) => (
                  <div
                    key={collab._id}
                    className="flex items-center bg-bg-secondary border border-border rounded-full py-1 px-3"
                  >
                    <span className="text-sm mr-2">@{collab.username}</span>
                    <button
                      type="button"
                      onClick={() => removeCollaborator(collab._id)}
                      className="text-text-secondary hover:text-danger"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          {onClose && (
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary flex items-center">
            <FiPlus className="mr-1" /> Create Project
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewProjectForm
