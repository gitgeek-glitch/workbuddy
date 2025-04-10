import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { fetchProjects } from "../../services/projectService"

const initialState = {
  projects: [],
  starredProjects: [],
  recentProjects: [],
  loading: false,
  error: null,
}

export const getProjects = createAsyncThunk("projects/getProjects", async () => {
  try {
    const projects = await fetchProjects()
    return projects
  } catch (error) {
    throw error
  }
})

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
        const existingIndex = state.recentProjects.findIndex((p) => p.id === projectId)
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
      const projectIndex = state.projects.findIndex((project) => project.id === id)
      if (projectIndex !== -1) {
        state.projects[projectIndex] = { ...state.projects[projectIndex], ...projectData }
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
        state.error = action.error.message
      })
  },
})

export const { starProject, unstarProject, addToRecent, updateProject } = projectSlice.actions

export default projectSlice.reducer