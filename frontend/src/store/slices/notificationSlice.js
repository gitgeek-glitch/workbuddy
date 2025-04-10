import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

// Async thunks
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")

      const response = await axios.get(`${API_URL}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })

      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch notifications")
    }
  }
)

export const markNotificationRead = createAsyncThunk(
  "notifications/markNotificationRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")

      const response = await axios.patch(
        `${API_URL}/api/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      )

      return { notificationId, data: response.data.data[0] }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to mark notification as read")
    }
  }
)

export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllNotificationsRead",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")

      await axios.patch(
        `${API_URL}/api/notifications/read-all`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      )

      return true
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to mark all notifications as read")
    }
  }
)

// Notification slice
const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload)
      state.unreadCount += 1
    },
    clearNotifications: (state) => {
      state.notifications = []
      state.unreadCount = 0
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload
        state.unreadCount = action.payload.filter((notification) => !notification.read).length
        state.loading = false
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Mark notification as read
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(
          (notification) => notification._id === action.payload.notificationId
        )
        if (index !== -1) {
          state.notifications[index].read = true
          state.unreadCount = state.notifications.filter((notification) => !notification.read).length
        }
      })

      // Mark all notifications as read
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.notifications.forEach((notification) => {
          notification.read = true
        })
        state.unreadCount = 0
      })
  },
})

export const { addNotification, clearNotifications } = notificationSlice.actions

export default notificationSlice.reducer
