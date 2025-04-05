import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  sidebarCollapsed: false,
  sidebarVisible: true,
  mobileMenuOpen: false,
  activeSection: null,
  notifications: [],
  unreadNotificationsCount: 0,
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
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
    setActiveSection: (state, action) => {
      state.activeSection = action.payload
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
    clearNotifications: (state) => {
      state.notifications = []
      state.unreadNotificationsCount = 0
    },
  },
})

export const {
  toggleSidebar,
  setSidebarCollapsed,
  toggleMobileMenu,
  setMobileMenuOpen,
  setActiveSection,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotifications,
} = uiSlice.actions

export default uiSlice.reducer