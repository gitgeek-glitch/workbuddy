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

import Layout from "./components/layout/Layout"
import Landing from "./pages/Landing"
import Dashboard from "./pages/Dashboard"
import ProjectDetails from "./pages/ProjectDetails"
import Chat from "./pages/Chat"
import Profile from "./pages/Profile"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import OAuthCallback from "./pages/OAuthCallback"
import LoadingScreen from "./components/ui/LoadingScreen"
import { ThemeProvider } from "./context/ThemeContext"
import { ProjectProvider } from "./context/ProjectContext"

// Wrapper component that handles auth state and provides context
const AppContent = () => {
  const dispatch = useDispatch()
  const { isAuthenticated, loading: userLoading } = useSelector((state) => state.user)
  const { darkMode } = useSelector((state) => state.theme)

  useEffect(() => {
    // Check if user is authenticated
    dispatch(checkAuthState())

    // Load projects
    dispatch(getProjects())

    // Apply theme
    dispatch(setTheme(darkMode ? "dark" : "light"))
  }, [dispatch, darkMode])

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
        <Route path="/projects/:id" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<ProjectDetails />} />
        </Route>
        <Route path="/dashboard/chat" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Chat />} />
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