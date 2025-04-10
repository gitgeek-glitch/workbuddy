"use client"

import { useState, useEffect, useRef } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { FiPlus, FiX, FiSearch, FiCalendar, FiUser, FiUsers, FiInfo, FiClock } from "react-icons/fi"
import axios from "axios"
import { addProject } from "../../store/slices/projectSlice"
import DatePicker from "react-datepicker" // We'll use react-datepicker
import "react-datepicker/dist/react-datepicker.css" // Import styles

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeStep, setActiveStep] = useState(1) // 1: Basic Info, 2: Deadline, 3: Collaborators
  const searchRef = useRef(null)
  const calendarRef = useRef(null)

  // Create a state to hold the selected date as a Date object
  const [selectedDate, setSelectedDate] = useState(null)

  // Handle input change for form fields
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle date selection from calendar
  const handleDateChange = (date) => {
    setSelectedDate(date)

    if (date) {
      // Format date for display (DD-MM-YYYY)
      const day = date.getDate().toString().padStart(2, "0")
      const month = (date.getMonth() + 1).toString().padStart(2, "0")
      const year = date.getFullYear()
      const formattedDisplayDate = `${day}-${month}-${year}`

      // Format date for API (YYYY-MM-DD)
      const formattedApiDate = `${year}-${month}-${day}`

      setFormData((prev) => ({
        ...prev,
        deadline: formattedDisplayDate,
        deadlineForApi: formattedApiDate, // Store API format separately
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        deadline: "",
        deadlineForApi: null,
      }))
    }
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

  // Navigate between steps
  const nextStep = () => {
    if (activeStep === 1 && !formData.name.trim()) {
      toast.error("Project name is required")
      return
    }

    if (activeStep < 3) {
      setActiveStep(activeStep + 1)
    }
  }

  const prevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1)
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (!formData.name.trim()) {
      toast.error("Project name is required")
      return
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")

      // Prepare data for API
      const projectData = {
        name: formData.name,
        description: formData.description,
        deadline: formData.deadlineForApi || null, // Use the API format date
        collaborators: formData.collaborators.map((collab) => collab.username),
      }

      // Create project API call
      const response = await axios.post(`${API_URL}/api/project`, projectData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Dispatch action to add project to Redux store
      await dispatch(addProject(response.data.data[0]))

      toast.success("Project created successfully!")

      // Close modal and navigate to the projects page
      if (onClose) onClose()
    } catch (error) {
      console.error("Error creating project:", error)
      toast.error(error.response?.data?.message || "Failed to create project. Please try again.")
    } finally {
      setIsSubmitting(false)
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
    <div className="bg-bg-primary border border-border rounded-lg shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent to-accent-dark p-6 text-white">
        <h2 className="text-2xl font-bold">Create New Project</h2>
        <p className="text-white/80 mt-1">Let's build something amazing together</p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between px-6 pt-6">
        <div className="flex flex-col items-center w-1/3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
              activeStep >= 1 ? "bg-accent text-white" : "bg-bg-secondary text-text-secondary"
            }`}
          >
            <FiInfo size={18} />
          </div>
          <span className={`text-xs ${activeStep >= 1 ? "text-accent font-medium" : "text-text-secondary"}`}>
            Basic Info
          </span>
        </div>
        <div className="flex flex-col items-center w-1/3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
              activeStep >= 2 ? "bg-accent text-white" : "bg-bg-secondary text-text-secondary"
            }`}
          >
            <FiClock size={18} />
          </div>
          <span className={`text-xs ${activeStep >= 2 ? "text-accent font-medium" : "text-text-secondary"}`}>
            Timeline
          </span>
        </div>
        <div className="flex flex-col items-center w-1/3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
              activeStep >= 3 ? "bg-accent text-white" : "bg-bg-secondary text-text-secondary"
            }`}
          >
            <FiUsers size={18} />
          </div>
          <span className={`text-xs ${activeStep >= 3 ? "text-accent font-medium" : "text-text-secondary"}`}>Team</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 mt-4">
        <div className="w-full bg-bg-secondary rounded-full h-2">
          <div
            className="bg-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${(activeStep / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {/* Step 1: Basic Info */}
        {activeStep === 1 && (
          <div className="space-y-4">
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
                className="w-full bg-bg-secondary border border-border rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
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
                rows="4"
                className="w-full bg-bg-secondary border border-border rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                placeholder="Describe your project goals, scope, and vision"
              ></textarea>
              <p className="text-xs text-text-secondary mt-1">
                A good description helps team members understand the project's purpose
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Timeline */}
        {activeStep === 2 && (
          <div className="space-y-4">
            <div className="mb-4">
              <label htmlFor="deadline" className="block text-sm font-medium mb-1">
                Project Deadline
              </label>
              <div className="relative" ref={calendarRef}>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="dd-MM-yyyy"
                  minDate={new Date()}
                  placeholderText="Select a deadline"
                  className="w-full bg-bg-secondary border border-border rounded-md py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all cursor-pointer"
                  customInput={<input id="deadline" name="deadline" value={formData.deadline} readOnly />}
                />
                <FiCalendar
                  className="absolute left-4 top-3.5 text-text-secondary calendar-icon cursor-pointer"
                  size={18}
                />
              </div>
              <p className="text-xs text-text-secondary mt-1">Setting a deadline helps keep your project on track</p>
            </div>

            <div className="bg-bg-secondary border border-border rounded-lg p-4 mt-4">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <FiInfo className="mr-2 text-accent" /> Timeline Tips
              </h3>
              <ul className="text-xs text-text-secondary space-y-2">
                <li>• Set realistic deadlines to avoid unnecessary pressure</li>
                <li>• Consider breaking down your project into smaller milestones</li>
                <li>• Remember to account for potential delays and obstacles</li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 3: Team */}
        {activeStep === 3 && (
          <div className="space-y-4">
            <div className="mb-4">
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
                      className="w-full bg-bg-secondary border border-border rounded-md py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                      placeholder="Search by username or name"
                    />
                    <FiSearch className="absolute left-4 top-3.5 text-text-secondary" size={18} />
                  </div>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-bg-primary border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.map((user) => (
                      <div
                        key={user._id}
                        className="p-3 hover:bg-bg-secondary cursor-pointer flex items-center justify-between border-b border-border last:border-0"
                        onClick={() => addCollaborator(user)}
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-accent bg-opacity-10 rounded-full flex items-center justify-center mr-3">
                            <FiUser className="text-accent" size={18} />
                          </div>
                          <div>
                            <p className="font-medium">{user.fullName}</p>
                            <p className="text-xs text-text-secondary">@{user.username}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="text-accent hover:text-accent-dark bg-accent bg-opacity-10 hover:bg-opacity-20 rounded-full p-1.5 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            addCollaborator(user)
                          }}
                        >
                          <FiPlus size={16} />
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
              <p className="text-xs text-text-secondary mt-1">You can add up to 7 collaborators to your project</p>
            </div>

            {/* Selected Collaborators */}
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-3">Selected Team Members:</h3>
              {formData.collaborators.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {formData.collaborators.map((collab) => (
                    <div
                      key={collab._id}
                      className="flex items-center justify-between bg-bg-secondary border border-border rounded-lg py-2 px-3"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-accent bg-opacity-10 rounded-full flex items-center justify-center mr-2">
                          <FiUser className="text-accent" size={14} />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{collab.fullName}</p>
                          <p className="text-xs text-text-secondary">@{collab.username}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCollaborator(collab._id)}
                        className="text-text-secondary hover:text-danger bg-bg-primary hover:bg-danger hover:bg-opacity-10 rounded-full p-1.5 transition-colors"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-bg-secondary border border-border rounded-lg p-4 text-center">
                  <p className="text-sm text-text-secondary">No team members added yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <div>
            {activeStep > 1 && (
              <button type="button" onClick={prevStep} className="btn-secondary">
                Back
              </button>
            )}
          </div>

          <div className="flex space-x-3">
            {onClose && (
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
            )}

            {activeStep < 3 ? (
              <button type="button" onClick={nextStep} className="btn-primary">
                Continue
              </button>
            ) : (
              <button type="submit" className="btn-primary flex items-center" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <FiPlus className="mr-2" /> Create Project
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

export default NewProjectForm