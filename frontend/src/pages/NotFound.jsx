import { Link } from "react-router-dom"
import { FiArrowLeft } from "react-icons/fi"
import { useSelector } from "react-redux"

const NotFound = () => {
  const { isAuthenticated } = useSelector((state) => state.user)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary text-text-primary p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-accent mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-text-secondary mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="btn-primary inline-flex items-center">
          <FiArrowLeft className="mr-2" />
          {isAuthenticated ? "Back to Dashboard" : "Back to Home"}
        </Link>
      </div>
    </div>
  )
}

export default NotFound