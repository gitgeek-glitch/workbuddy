import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7000"

const initialState = {
  projects: [],
  starredProjects: [],
  recentProjects: [],
  loading: false,
  error: null,
}

// Get all projects for the authenticated user
export const getProjects = createAsyncThunk("projects/getProjects", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")

    const response = await axios.get(`${API_URL}/api/project/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data.data[0].projects
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch projects")
  }
})

// Add a new project
export const addProject = createAsyncThunk("projects/addProject", async (project, { rejectWithValue }) => {
  try {
    // The project is already created in the NewProjectForm component
    // Here we just need to return it to update the Redux store
    return project
  } catch (error) {
    return rejectWithValue(error.message || "Failed to add project")
  }
})

// Update a project
export const updateProjectAsync = createAsyncThunk(
  "projects/updateProjectAsync",
  async ({ projectId, projectData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")

      const response = await axios.patch(`${API_URL}/api/project/${projectId}`, projectData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return response.data.data[0]
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update project")
    }
  },
)

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    starProject: (state, action) => {
      const projectId = action.payload
      const project = state.projects.find((p) => p._id === projectId)
      if (project && !state.starredProjects.some((p) => p._id === projectId)) {
        state.starredProjects.push(project)
      }
    },
    unstarProject: (state, action) => {
      const projectId = action.payload
      state.starredProjects = state.starredProjects.filter((p) => p._id !== projectId)
    },
    addToRecent: (state, action) => {
      const projectId = action.payload
      const project = state.projects.find((p) => p._id === projectId)

      if (project) {
        const existingIndex = state.recentProjects.findIndex((p) => p._id === projectId)
        if (existingIndex !== -1) {
          // If it exists, move to the beginning
          state.recentProjects.splice(existingIndex, 1)
        }
        state.recentProjects.unshift(project)

        // Keep only the 5 most recent projects
        state.recentProjects = state.recentProjects.slice(0, 5)
      }
    },
    updateProject: (state, action) => {
      const { id, projectData } = action.payload
      const projectIndex = state.projects.findIndex((project) => project._id === id)
      if (projectIndex !== -1) {
        state.projects[projectIndex] = { ...state.projects[projectIndex], ...projectData }

        // Also update in starred and recent projects if present
        const starredIndex = state.starredProjects.findIndex((p) => p._id === id)
        if (starredIndex !== -1) {
          state.starredProjects[starredIndex] = { ...state.starredProjects[starredIndex], ...projectData }
        }

        const recentIndex = state.recentProjects.findIndex((p) => p._id === id)
        if (recentIndex !== -1) {
          state.recentProjects[recentIndex] = { ...state.recentProjects[recentIndex], ...projectData }
        }
      }
    },
    toggleProjectImportant: (state, action) => {
      const projectId = action.payload
      const projectIndex = state.projects.findIndex((project) => project._id === projectId)

      if (projectIndex !== -1) {
        const currentImportant = state.projects[projectIndex].important || false
        state.projects[projectIndex].important = !currentImportant

        // Also update in starred and recent projects if present
        const starredIndex = state.starredProjects.findIndex((p) => p._id === projectId)
        if (starredIndex !== -1) {
          state.starredProjects[starredIndex].important = !currentImportant
        }

        const recentIndex = state.recentProjects.findIndex((p) => p._id === projectId)
        if (recentIndex !== -1) {
          state.recentProjects[recentIndex].important = !currentImportant
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProjects.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.loading = false
        state.projects = action.payload
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })
      .addCase(addProject.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.loading = false
        state.projects.push(action.payload)
      })
      .addCase(addProject.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })
      .addCase(updateProjectAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProjectAsync.fulfilled, (state, action) => {
        state.loading = false
        const index = state.projects.findIndex((p) => p._id === action.payload._id)
        if (index !== -1) {
          state.projects[index] = action.payload
        }
      })
      .addCase(updateProjectAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })
  },
})

export const { starProject, unstarProject, addToRecent, updateProject, toggleProjectImportant } = projectSlice.actions

export default projectSlice.reducer