"use client"

import { useState } from "react"
import { FiCheck, FiX, FiMessageSquare } from "react-icons/fi"

const FileApproval = ({ file }) => {
  const [approved, setApproved] = useState(file.approved)
  const [showComments, setShowComments] = useState(false)

  return (
    <div className="border border-border rounded-md mb-3 overflow-hidden">
      <div className="flex items-center justify-between bg-bg-secondary p-3">
        <div className="flex items-center space-x-2">
          <span
            className={`w-3 h-3 rounded-full ${file.status === "modified" ? "bg-warning" : file.status === "added" ? "bg-success" : "bg-danger"}`}
          ></span>
          <span className="font-mono text-sm">{file.path}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowComments(!showComments)}
            className="p-1.5 rounded-md hover:bg-bg-primary text-text-secondary"
          >
            <FiMessageSquare size={16} />
          </button>
          <button
            onClick={() => setApproved(true)}
            className={`p-1.5 rounded-md ${approved ? "bg-success bg-opacity-20 text-success" : "hover:bg-bg-primary text-text-secondary"}`}
          >
            <FiCheck size={16} />
          </button>
          <button
            onClick={() => setApproved(false)}
            className={`p-1.5 rounded-md ${approved === false ? "bg-danger bg-opacity-20 text-danger" : "hover:bg-bg-primary text-text-secondary"}`}
          >
            <FiX size={16} />
          </button>
        </div>
      </div>

      {showComments && (
        <div className="p-3 border-t border-border">
          <div className="mb-3">
            {file.comments.map((comment, index) => (
              <div key={index} className="mb-2">
                <div className="flex items-center space-x-2 mb-1">
                  <img
                    src={comment.user.avatar || `/placeholder.svg?height=24&width=24`}
                    alt={comment.user.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="font-medium text-sm">{comment.user.name}</span>
                  <span className="text-text-secondary text-xs">{comment.timestamp}</span>
                </div>
                <p className="text-sm pl-8">{comment.text}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <input type="text" placeholder="Add a comment..." className="input text-sm flex-1" />
            <button className="btn-primary text-sm">Comment</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FileApproval