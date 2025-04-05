import { Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import Footer from "./Footer"

const Layout = () => {
  const { sidebarCollapsed } = useSelector((state) => state.ui)

  return (
    <div className="flex h-screen bg-bg-primary text-text-primary">
      <Sidebar />
      <div
        className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-0 lg:ml-64"}`}
      >
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
        <Footer simplified />
      </div>
    </div>
  )
}

export default Layout