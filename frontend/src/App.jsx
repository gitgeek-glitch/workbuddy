"use client"

import { useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Provider, useSelector, useDispatch } from "react-redux"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { PersistGate } from "redux-persist/integration/react"

import { store, persistor } from "./store"
import { checkAuthState } from "./store/slices/userSlice"
import { getProjects } from "./store/slices/projectSlice"
import { setTheme } from "./store/slices/themeSlice"
import { fetchNotifications } from "./store/slices/notificationSlice"
import { fetchUnreadCounts } from "./store/slices/chatSlice"
import { initializeSocket, requestNotificationPermission, getSocket } from "./services/socketService"

import Layout from "./components/layout/Layout"
import Landing from "./pages/Landing"
import Dashboard from "./pages/Dashboard"
import Project from "./pages/Project"
import Team from "./pages/Team"
import TeamDetails from "./pages/TeamDetails"
import ProjectDetails from "./pages/ProjectDetails"
import ProjectChat from "./pages/ProjectChat"
import Profile from "./pages/Profile"
import Notifications from "./pages/Notifications"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import OAuthCallback from "./pages/OAuthCallback"
import LoadingScreen from "./components/ui/LoadingScreen"
import Chat from "./pages/Chat"

// Main App component that wraps everything with providers
function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <Router>
          <AppContent />
        </Router>
      </PersistGate>
    </Provider>
  )
}

// Wrapper component that handles auth state and provides context
const AppContent = () => {
  const dispatch = useDispatch()
  const { isAuthenticated, token, loading: userLoading, currentUser } = useSelector((state) => state.user)
  const { darkMode } = useSelector((state) => state.theme)
  const [socketInitialized, setSocketInitialized] = useState(false)

  console.log("🧩 AppContent mounted")
  console.log("🔑 Auth Status:", isAuthenticated, "Token:", token)
  console.log("🕒 User Loading:", userLoading)

  useEffect(() => {
    console.log("🚀 Running initial auth and notification setup")
    // Check if user is authenticated
    dispatch(checkAuthState())

    // Request notification permission
    requestNotificationPermission()
  }, [dispatch])

  // Initialize socket connection when user is authenticated
  useEffect(() => {
    let socketCheckInterval = null
    let mounted = true // Add this flag to prevent state updates after unmount

    const initSocket = () => {
      if (!mounted) return // Don't proceed if component is unmounting

      if (isAuthenticated && token) {
        console.log("🌐 Trying to initialize socket...")

        try {
          const socket = initializeSocket(token, store)
          if (socket && mounted) {
            console.log("✅ Socket initialized successfully")
            setSocketInitialized(true)

            dispatch(getProjects())
            dispatch(fetchNotifications())
            dispatch(fetchUnreadCounts())

            if (socketCheckInterval) {
              clearInterval(socketCheckInterval)
              socketCheckInterval = null
            }
          }
        } catch (error) {
          console.error("❌ Socket initialization error:", error)
        }
      }
    }

    if (isAuthenticated && token && !socketInitialized) {
      initSocket()

      socketCheckInterval = setInterval(() => {
        if (!mounted) return // Don't continue if component is unmounting

        const socket = getSocket()
        if (!socket) {
          console.log("📡 No socket found, retrying...")
          initSocket()
        } else if (!socket.connected) {
          console.log("🔌 Socket found but not connected, reconnecting...")
          socket.connect()
        } else {
          console.log("✅ Socket is active")
          clearInterval(socketCheckInterval)
        }
      }, 3000)
    }

    return () => {
      mounted = false // Set flag to prevent further state updates
      if (socketCheckInterval) {
        clearInterval(socketCheckInterval)
      }
      console.log("🔚 Cleaning up socket connection")
      // Don't disconnect socket on unmount, but prevent further state updates
    }
  }, [isAuthenticated, token, socketInitialized, dispatch])

  useEffect(() => {
    console.log("🌓 Applying theme:", darkMode ? "dark" : "light")
    dispatch(setTheme(darkMode ? "dark" : "light"))
  }, [darkMode, dispatch])

  // Run these dispatches based on authentication status alone, not socket status
  useEffect(() => {
    if (isAuthenticated && token) {
      dispatch(getProjects())
      dispatch(fetchNotifications())
      dispatch(fetchUnreadCounts())
    }
  }, [isAuthenticated, token, dispatch])

  if (userLoading) {
    console.log("⌛ Loading user data...")
    return <LoadingScreen />
  }

  return (
    <>
      <ToastContainer position="top-right" theme={darkMode ? "dark" : "light"} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="/dashboard/projects" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Project />} />
        </Route>
        <Route path="/team" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Team />} />
        </Route>
        <Route path="/team/:id" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<TeamDetails />} />
        </Route>
        <Route path="/dashboard/notifications" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Notifications />} />
        </Route>
        <Route path="/projects/:id" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<ProjectDetails />} />
        </Route>
        <Route path="/dashboard/chat" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Chat />} />
          <Route path=":projectId" element={<ProjectChat />} />
        </Route>
        <Route path="/dashboard/profile" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Profile />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
