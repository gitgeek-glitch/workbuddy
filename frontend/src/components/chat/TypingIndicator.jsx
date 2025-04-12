const TypingIndicator = ({ user }) => {
    if (!user) return null
  
    return (
      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 p-2">
        <div className="flex space-x-1 mr-2">
          <div
            className="w-1 h-1 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-1 h-1 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-1 h-1 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
        <span>{user} is typing...</span>
      </div>
    )
  }
  
  export default TypingIndicator
  