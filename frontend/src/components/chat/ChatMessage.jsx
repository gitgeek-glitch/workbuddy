import { formatDistanceToNow } from "date-fns"
import { useSelector } from "react-redux"

const ChatMessage = ({ message }) => {
  const currentUser = useSelector((state) => state.user)
  console.log(currentUser);
  
  const isCurrentUser = message.sender._id === currentUser._id

  // Format timestamp
  const formattedTime = message.timestamp ? formatDistanceToNow(new Date(message.timestamp), { addSuffix: true }) : ""

  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}>
      {!isCurrentUser && (
        <div className="w-9 h-9 rounded-full mr-3 mt-1 bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
          {message.sender.fullName ? message.sender.fullName.charAt(0) : message.sender.username.charAt(0)}
        </div>
      )}

      <div
        className={`max-w-[70%] ${
          isCurrentUser ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800"
        } rounded-lg px-4 py-2`}
      >
        {!isCurrentUser && (
          <div className="font-medium text-sm mb-1">{message.sender.fullName || message.sender.username}</div>
        )}
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        <div
          className={`text-xs mt-1 ${isCurrentUser ? "text-white text-opacity-80" : "text-gray-500 dark:text-gray-400"}`}
        >
          {formattedTime}
        </div>
      </div>

      {isCurrentUser && (
        <div className="w-9 h-9 rounded-full ml-3 mt-1 bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
          {currentUser.fullName ? currentUser.fullName.charAt(0) : currentUser.username.charAt(0)}
        </div>
      )}
    </div>
  )
}

export default ChatMessage
