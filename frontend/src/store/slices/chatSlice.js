// store/slices/chatSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  }
}

// Async thunks
export const fetchProjectMessages = createAsyncThunk(
  "chat/fetchProjectMessages",
  async ({ projectId, page = 1, limit = 50 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/messages/project/${projectId}?page=${page}&limit=${limit}`,
        getAuthHeaders()
      )
      return response.data.data[0]
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch messages" })
    }
  }
)

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ projectId, content, referenceId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/messages`,
        { projectId, content, referenceId },
        getAuthHeaders()
      )
      return response.data.data[0]
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to send message" })
    }
  }
)

export const deleteMessage = createAsyncThunk(
  "chat/deleteMessage",
  async (messageId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URL}/api/messages/${messageId}`,
        getAuthHeaders()
      )
      return { messageId, data: response.data.data[0] }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to delete message" })
    }
  }
)

export const deleteMessageForEveryone = createAsyncThunk(
  "chat/deleteMessageForEveryone",
  async ({ messageId, deletedBy }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/messages/${messageId}/soft-delete`,
        { deletedBy },
        getAuthHeaders()
      )
      return { messageId, deletedBy, data: response.data.data[0] }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to delete message" })
    }
  }
)

export const forwardMessage = createAsyncThunk(
  "chat/forwardMessage",
  async ({ content, originalSender, projectId }, { rejectWithValue }) => {
    try {
      const forwardedContent = `[Forwarded from ${originalSender}]\n${content}`
      const response = await axios.post(
        `${API_URL}/api/messages`,
        { projectId, content: forwardedContent },
        getAuthHeaders()
      )
      return response.data.data[0]
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to forward message" })
    }
  }
)

export const fetchUnreadCounts = createAsyncThunk(
  "chat/fetchUnreadCounts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/messages/unread`,
        getAuthHeaders()
      )
      return response.data.data[0]
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch unread counts" })
    }
  }
)

// Initial state
const initialState = {
  activeProjectId: null,
  messages: {},
  unreadCounts: {},
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 50,
    pages: 1,
  },
  replyToMessage: null,
}

// Slice
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveProject: (state, action) => {
      state.activeProjectId = action.payload
      // Clear reply state when changing projects
      state.replyToMessage = null
    },
    addMessage: (state, action) => {
      const { projectId, message } = action.payload
      if (!state.messages[projectId]) {
        state.messages[projectId] = []
      }
      const exists = state.messages[projectId].some((m) => m._id === message._id)
      if (!exists) {
        state.messages[projectId].push(message)
      }
    },
    updateUnreadCount: (state, action) => {
      const { projectId, count, increment = false } = action.payload
      if (state.unreadCounts[projectId]) {
        if (increment) {
          state.unreadCounts[projectId].unreadCount += count
        } else {
          state.unreadCounts[projectId].unreadCount = count
        }
      } else if (increment) {
        state.unreadCounts[projectId] = {
          projectId,
          unreadCount: count,
        }
      }
    },
    markProjectAsRead: (state, action) => {
      const projectId = action.payload
      if (state.unreadCounts[projectId]) {
        state.unreadCounts[projectId].unreadCount = 0
      }
    },
    resetChatState: () => initialState,
    setReplyToMessage: (state, action) => {
      state.replyToMessage = action.payload
    },
    clearReplyToMessage: (state) => {
      state.replyToMessage = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectMessages.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProjectMessages.fulfilled, (state, action) => {
        const { messages, pagination } = action.payload
        const projectId = state.activeProjectId
        state.messages[projectId] = messages
        state.pagination = pagination
        state.loading = false
      })
      .addCase(fetchProjectMessages.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to fetch messages"
      })
      .addCase(sendMessage.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const message = action.payload
        const projectId = message.projectId
        if (!state.messages[projectId]) {
          state.messages[projectId] = []
        }
        state.messages[projectId].push(message)
        state.loading = false
        // Clear reply state after sending a message
        state.replyToMessage = null
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to send message"
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        const { messageId } = action.payload
        const projectId = state.activeProjectId
        if (state.messages[projectId]) {
          state.messages[projectId] = state.messages[projectId].filter(
            (message) => message._id !== messageId
          )
        }
      })
      .addCase(deleteMessageForEveryone.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteMessageForEveryone.fulfilled, (state, action) => {
        const { messageId, deletedBy, data } = action.payload
        const projectId = state.activeProjectId
        
        if (state.messages[projectId]) {
          // Find the message and mark it as deleted
          const messageIndex = state.messages[projectId].findIndex(
            message => message._id === messageId
          )
          
          if (messageIndex !== -1) {
            state.messages[projectId][messageIndex] = {
              ...state.messages[projectId][messageIndex],
              isDeleted: true,
              deletedBy: deletedBy,
              // Store the original content in case we need it,
              // but set the main content to empty
              originalContent: state.messages[projectId][messageIndex].content,
              content: ""
            }
          }
        }
        
        state.loading = false
      })
      .addCase(deleteMessageForEveryone.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to delete message"
      })
      .addCase(forwardMessage.fulfilled, (state, action) => {
        const message = action.payload
        const projectId = message.projectId
        if (!state.messages[projectId]) {
          state.messages[projectId] = []
        }
        state.messages[projectId].push(message)
      })
      .addCase(fetchUnreadCounts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUnreadCounts.fulfilled, (state, action) => {
        state.unreadCounts = action.payload
        state.loading = false
      })
      .addCase(fetchUnreadCounts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to fetch unread counts"
      })
  },
})

export const {
  setActiveProject,
  addMessage,
  updateUnreadCount,
  markProjectAsRead,
  resetChatState,
  setReplyToMessage,
  clearReplyToMessage,
} = chatSlice.actions

export default chatSlice.reducer