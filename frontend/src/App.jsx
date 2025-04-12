"use client"

import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Provider, useSelector, useDispatch } from "react-redux"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import store from "./store"
import { checkAuthState } from "./store/slices/userSlice"
import { getProjects } from "./store/slices/projectSlice"
import { setTheme } from "./store/slices/themeSlice"
import { fetchNotifications } from "./store/slices/notificationSlice"
import { fetchUnreadCounts } from "./store/slices/chatSlice"
import { initializeSocket, requestNotificationPermission, disconnectSocket } from "./services/socketService"

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
import { ThemeProvider } from "./context/ThemeContext"
import { ProjectProvider } from "./context/ProjectContext"

// Wrapper component that handles auth state and provides context
const AppContent = () => {
  const dispatch = useDispatch()
  const { isAuthenticated, loading: userLoading, currentUser, token } = useSelector((state) => state.user)
  const { darkMode } = useSelector((state) => state.theme)

  useEffect(() => {
    // Check if user is authenticated
    dispatch(checkAuthState())

    // Request notification permission
    requestNotificationPermission()
  }, [dispatch])

  useEffect(() => {
    // Initialize socket connection when user is authenticated
    if (isAuthenticated && token) {
      initializeSocket(token, store)

      // Load projects, notifications, and chat unread counts
      dispatch(getProjects())
      dispatch(fetchNotifications())
      dispatch(fetchUnreadCounts())
    }

    // Cleanup socket connection on unmount
    return () => {
      if (isAuthenticated) {
        disconnectSocket()
      }
    }
  }, [isAuthenticated, token, dispatch])

  useEffect(() => {
    // Apply theme
    dispatch(setTheme(darkMode ? "dark" : "light"))
  }, [darkMode, dispatch])

  if (userLoading) {
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
          <Route index element={<ProjectChat />} />
          <Route path=":projectId" element={<ProjectChat />} />
        </Route>
        <Route path="/dashboard/profile" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Profile />} />
        </Route>
      </Routes>
    </>
  )
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <ProjectProvider>
          <Router>
            <AppContent />
          </Router>
        </ProjectProvider>
      </ThemeProvider>
    </Provider>
  )
}

export default App
