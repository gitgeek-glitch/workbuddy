import { FiCode } from "react-icons/fi"

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary text-text-primary">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center text-white mb-4 animate-pulse">
          <FiCode size={32} />
        </div>
        <h1 className="text-2xl font-bold mb-2">TeamCollab</h1>
        <p className="text-text-secondary">Loading your workspace...</p>

        <div className="mt-8 flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-3 h-3 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-3 h-3 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen