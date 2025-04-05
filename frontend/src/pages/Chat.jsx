"use client"

import { useState } from "react"
import { FiSearch } from "react-icons/fi"
import ChatMessage from "../components/chat/ChatMessage"

const Chat = () => {
  // Mock data - in a real app, you would fetch this from your API
  const conversations = [
    {
      id: 1,
      name: "Team Alpha",
      lastMessage: "Let's discuss the new feature",
      timestamp: "10:30 AM",
      unread: 3,
    },
    {
      id: 2,
      name: "Project Redesign",
      lastMessage: "The mockups are ready for review",
      timestamp: "Yesterday",
      unread: 0,
    },
    {
      id: 3,
      name: "John Doe",
      lastMessage: "Can you help me with the API?",
      timestamp: "Yesterday",
      unread: 0,
    },
  ]

  const messages = [
    {
      id: 1,
      sender: { id: "user1", name: "John Doe", avatar: null },
      text: "Hey team, I just pushed the new changes to the repository.",
      timestamp: "10:15 AM",
    },
    {
      id: 2,
      sender: { id: "user2", name: "Jane Smith", avatar: null },
      text: "Great! I'll take a look at it.",
      timestamp: "10:20 AM",
    },
    {
      id: 3,
      sender: { id: "current-user", name: "You", avatar: null },
      text: "I'm working on the authentication module. Should be done by EOD.",
      timestamp: "10:25 AM",
    },
    {
      id: 4,
      sender: { id: "user1", name: "John Doe", avatar: null },
      text: "Perfect! Let's discuss the new feature we talked about yesterday.",
      timestamp: "10:30 AM",
    },
  ]

  const [activeConversation, setActiveConversation] = useState(conversations[0])

  return (
    <div className="flex h-[calc(100vh-120px)]">
      <div className="w-80 border-r border-border">
        <div className="p-3">
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full bg-bg-primary border border-border rounded-md py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <FiSearch className="absolute left-3 top-2 text-text-secondary" />
          </div>

          <div className="space-y-1">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setActiveConversation(conversation)}
                className={`w-full text-left p-2 rounded-md ${
                  activeConversation.id === conversation.id ? "bg-accent bg-opacity-10" : "hover:bg-bg-primary"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-medium">{conversation.name}</span>
                  <span className="text-xs text-text-secondary">{conversation.timestamp}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-text-secondary truncate">{conversation.lastMessage}</span>
                  {conversation.unread > 0 && (
                    <span className="bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {conversation.unread}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-3 border-b border-border">
          <h2 className="font-medium">{activeConversation.name}</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>

        <div className="p-3 border-t border-border">
          <div className="flex items-center space-x-2">
            <input type="text" placeholder="Type a message..." className="input flex-1" />
            <button className="btn-primary">Send</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat