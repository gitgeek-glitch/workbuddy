const ChatMessage = ({ message }) => {
    const isCurrentUser = message.sender.id === "current-user"
  
    return (
      <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}>
        {!isCurrentUser && (
          <img
            src={message.sender.avatar || `/placeholder.svg?height=36&width=36`}
            alt={message.sender.name}
            className="w-9 h-9 rounded-full mr-3 mt-1"
          />
        )}
  
        <div className={`max-w-[70%] ${isCurrentUser ? "bg-accent text-white" : "bg-bg-secondary"} rounded-lg px-4 py-2`}>
          {!isCurrentUser && <div className="font-medium text-sm mb-1">{message.sender.name}</div>}
          <p className="text-sm">{message.text}</p>
          <div className={`text-xs mt-1 ${isCurrentUser ? "text-white text-opacity-80" : "text-text-secondary"}`}>
            {message.timestamp}
          </div>
        </div>
  
        {isCurrentUser && (
          <img
            src={message.sender.avatar || `/placeholder.svg?height=36&width=36`}
            alt={message.sender.name}
            className="w-9 h-9 rounded-full ml-3 mt-1"
          />
        )}
      </div>
    )
  }
  
  export default ChatMessage  