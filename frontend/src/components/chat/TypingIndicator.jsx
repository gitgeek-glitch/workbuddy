const TypingIndicator = ({ user }) => {
  if (!user) return null

  return (
    <div className="typing-indicator animate-in fade-in duration-300">
      <div className="flex space-x-1 mr-2">
        <div className="typing-dot" style={{ animationDelay: "0ms" }}></div>
        <div className="typing-dot" style={{ animationDelay: "150ms" }}></div>
        <div className="typing-dot" style={{ animationDelay: "300ms" }}></div>
      </div>
      <span>{user} is typing...</span>
    </div>
  )
}

export default TypingIndicator
