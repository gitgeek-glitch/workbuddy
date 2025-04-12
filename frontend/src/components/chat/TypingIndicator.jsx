const TypingIndicator = ({ user }) => {
  if (!user) return null

  return (
    <div className="chat-message-container chat-message-container-received animate-in fade-in duration-300">
      <div className="chat-bubble chat-bubble-received py-2 px-3">
        <div className="flex items-center space-x-1">
          <div className="typing-dot" style={{ animationDelay: "0ms" }}></div>
          <div className="typing-dot" style={{ animationDelay: "150ms" }}></div>
          <div className="typing-dot" style={{ animationDelay: "300ms" }}></div>
          <span className="text-text-secondary text-xs ml-1">{user} is typing...</span>
        </div>
      </div>
    </div>
  )
}

export default TypingIndicator
