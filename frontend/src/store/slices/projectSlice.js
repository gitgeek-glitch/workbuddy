import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import {
  fetchProjects,
  fetchProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../../services/projectService"

// Async thunks for project actions
export const getProjects = createAsyncThunk("projects/getAll", async (_, { rejectWithValue }) => {
  try {
    const projects = await fetchProjects()
    return projects
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const getProjectById = createAsyncThunk("projects/getById", async (id, { rejectWithValue }) => {
  try {
    const project = await fetchProjectById(id)
    return project
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const addProject = createAsyncThunk("projects/add", async (projectData, { rejectWithValue }) => {
  try {
    const newProject = await createProject(projectData)
    return newProject
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const editProject = createAsyncThunk("projects/edit", async ({ id, projectData }, { rejectWithValue }) => {
  try {
    const updatedProject = await updateProject(id, projectData)
    return updatedProject
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const removeProject = createAsyncThunk("projects/remove", async (id, { rejectWithValue }) => {
  try {
    await deleteProject(id)
    return id
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

const initialState = {
  projects: [],
  currentProject: null,
  starredProjects: [],
  recentProjects: [],
  loading: false,
  error: null,
}

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    starProject: (state, action) => {
      const projectId = action.payload
      const project = state.projects.find((p) => p.id === projectId)

      if (project && !state.starredProjects.some((p) => p.id === projectId)) {
        state.starredProjects.push(project)
      }
    },
    unstarProject: (state, action) => {
      const projectId = action.payload
      state.starredProjects = state.starredProjects.filter((p) => p.id !== projectId)
    },
    addToRecent: (state, action) => {
      const projectId = action.payload
      const project = state.projects.find((p) => p.id === projectId)

      if (project) {
        // Remove if already exists to avoid duplicates
        state.recentProjects = state.recentProjects.filter((p) => p.id !== projectId)
        // Add to the beginning of the array
        state.recentProjects.unshift(project)
        // Limit to 5 recent projects
        if (state.recentProjects.length > 5) {
          state.recentProjects.pop()
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all projects
      .addCase(getProjects.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.loading = false
        state.projects = action.payload

        // Initialize starred and recent projects
        if (state.starredProjects.length === 0) {
          state.starredProjects = action.payload.filter((_, index) => index < 2)
        }

        if (state.recentProjects.length === 0) {
          state.recentProjects = action.payload.filter((_, index) => index < 3)
        }
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Get project by ID
      .addCase(getProjectById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getProjectById.fulfilled, (state, action) => {
        state.loading = false
        state.currentProject = action.payload
      })
      .addCase(getProjectById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Add project
      .addCase(addProject.fulfilled, (state, action) => {
        state.projects.push(action.payload)
      })
      // Edit project
      .addCase(editProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex((p) => p.id === action.payload.id)
        if (index !== -1) {
          state.projects[index] = action.payload
        }

        // Update in starred projects if exists
        const starredIndex = state.starredProjects.findIndex((p) => p.id === action.payload.id)
        if (starredIndex !== -1) {
          state.starredProjects[starredIndex] = action.payload
        }

        // Update in recent projects if exists
        const recentIndex = state.recentProjects.findIndex((p) => p.id === action.payload.id)
        if (recentIndex !== -1) {
          state.recentProjects[recentIndex] = action.payload
        }

        // Update current project if it's the same
        if (state.currentProject && state.currentProject.id === action.payload.id) {
          state.currentProject = action.payload
        }
      })
      // Remove project
      .addCase(removeProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((p) => p.id !== action.payload)
        state.starredProjects = state.starredProjects.filter((p) => p.id !== action.payload)
        state.recentProjects = state.recentProjects.filter((p) => p.id !== action.payload)

        if (state.currentProject && state.currentProject.id === action.payload) {
          state.currentProject = null
        }
      })
  },
})

export const { starProject, unstarProject, addToRecent } = projectSlice.actions

export default projectSlice.reducer