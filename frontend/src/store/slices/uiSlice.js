import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  darkMode: true,
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  notifications: [],
  unreadNotificationsCount: 3, // Mock count for now
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen
    },
    setMobileMenuOpen: (state, action) => {
      state.mobileMenuOpen = action.payload
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload
      state.unreadNotificationsCount = action.payload.filter((n) => !n.read).length
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload)
      if (!action.payload.read) {
        state.unreadNotificationsCount += 1
      }
    },
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find((n) => n.id === action.payload)
      if (notification && !notification.read) {
        notification.read = true
        state.unreadNotificationsCount -= 1
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach((notification) => {
        notification.read = true
      })
      state.unreadNotificationsCount = 0
    },
  },
})

export const {
  toggleDarkMode,
  setDarkMode,
  toggleSidebar,
  setSidebarCollapsed,
  toggleMobileMenu,
  setMobileMenuOpen,
  setNotifications,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = uiSlice.actions

export default uiSlice.reducer