"use client"

import { useState } from "react"
import { useParams } from "react-router-dom"
import { FiGitPullRequest, FiGitCommit, FiUsers, FiMessageSquare, FiFile } from "react-icons/fi"
import FileApproval from "../components/projects/FileApproval"
import ChatMessage from "../components/chat/ChatMessage"

const ProjectDetails = () => {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState("files")

  // Mock data - in a real app, you would fetch this from your API
  const project = {
    id,
    name: "Team Collaboration Platform",
    description: "A platform for teams to collaborate on projects, share files, and communicate in real-time.",
    status: "active",
    files: [
      {
        id: 1,
        path: "src/components/Navbar.jsx",
        status: "modified",
        approved: true,
        comments: [
          {
            user: { id: "user1", name: "John Doe", avatar: null },
            text: "Can we make the navbar responsive?",
            timestamp: "2 hours ago",
          },
        ],
      },
      {
        id: 2,
        path: "src/pages/Dashboard.jsx",
        status: "added",
        approved: null,
        comments: [],
      },
      {
        id: 3,
        path: "src/styles/main.css",
        status: "deleted",
        approved: false,
        comments: [
          {
            user: { id: "user2", name: "Jane Smith", avatar: null },
            text: "Are you sure we should delete this file?",
            timestamp: "1 day ago",
          },
        ],
      },
    ],
    messages: [
      {
        id: 1,
        sender: { id: "user1", name: "John Doe", avatar: null },
        text: "I just pushed the navbar changes.",
        timestamp: "2 hours ago",
      },
      {
        id: 2,
        sender: { id: "current-user", name: "You", avatar: null },
        text: "Looks good! I'll review the changes.",
        timestamp: "1 hour ago",
      },
      {
        id: 3,
        sender: { id: "user2", name: "Jane Smith", avatar: null },
        text: "Can we discuss the file deletion in our next meeting?",
        timestamp: "30 minutes ago",
      },
    ],
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
        <p className="text-text-secondary mb-4">{project.description}</p>

        <div className="flex items-center space-x-6 text-sm text-text-secondary">
          <div className="flex items-center space-x-1">
            <FiGitPullRequest size={16} />
            <span>4 Pull Requests</span>
          </div>
          <div className="flex items-center space-x-1">
            <FiGitCommit size={16} />
            <span>28 Commits</span>
          </div>
          <div className="flex items-center space-x-1">
            <FiUsers size={16} />
            <span>5 Contributors</span>
          </div>
        </div>
      </div>

      <div className="border-b border-border mb-6">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab("files")}
            className={`py-3 px-1 border-b-2 ${
              activeTab === "files" ? "border-accent text-accent" : "border-transparent hover:border-border"
            }`}
          >
            <div className="flex items-center space-x-2">
              <FiFile size={16} />
              <span>Files</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`py-3 px-1 border-b-2 ${
              activeTab === "chat" ? "border-accent text-accent" : "border-transparent hover:border-border"
            }`}
          >
            <div className="flex items-center space-x-2">
              <FiMessageSquare size={16} />
              <span>Chat</span>
            </div>
          </button>
        </nav>
      </div>

      {activeTab === "files" && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Files Pending Approval</h2>
          {project.files.map((file) => (
            <FileApproval key={file.id} file={file} />
          ))}
        </div>
      )}

      {activeTab === "chat" && (
        <div className="flex flex-col h-[calc(100vh-300px)]">
          <div className="flex-1 overflow-y-auto mb-4">
            {project.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex items-center space-x-2">
              <input type="text" placeholder="Type a message..." className="input flex-1" />
              <button className="btn-primary">Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectDetails