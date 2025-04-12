import { formatDistanceToNow } from "date-fns"
import { useSelector } from "react-redux"

const ChatMessage = ({ message }) => {
  const { currentUser } = useSelector((state) => state.user)

  const isCurrentUser = message.sender._id === currentUser._id

  // Format timestamp
  const formattedTime = message.timestamp ? formatDistanceToNow(new Date(message.timestamp), { addSuffix: true }) : ""

  return (
    <div
      className={`chat-message-container ${isCurrentUser ? "chat-message-container-sent" : "chat-message-container-received"} group animate-in ${isCurrentUser ? "slide-in-from-right-5" : "slide-in-from-left-5"} duration-300`}
    >
      {!isCurrentUser && (
        <div className="chat-avatar chat-avatar-received">
          {message.sender.fullName
            ? message.sender.fullName.charAt(0).toUpperCase()
            : message.sender.username.charAt(0).toUpperCase()}
        </div>
      )}

      <div className={`chat-bubble ${isCurrentUser ? "chat-bubble-sent" : "chat-bubble-received"}`}>
        {!isCurrentUser && <div className="chat-sender-name">{message.sender.fullName || message.sender.username}</div>}
        <p className="chat-message-text">{message.content}</p>
        <div className={`chat-message-time ${isCurrentUser ? "chat-message-time-sent" : "chat-message-time-received"}`}>
          {formattedTime}
        </div>
      </div>

      {isCurrentUser && (
        <div className="chat-avatar chat-avatar-sent">
          {currentUser.fullName
            ? currentUser.fullName.charAt(0).toUpperCase()
            : currentUser.username.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  )
}

export default ChatMessage
