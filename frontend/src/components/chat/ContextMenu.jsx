// components/chat/ContextMenu.jsx
"use client"

import { useEffect, useRef } from "react"
import { FiShare2, FiCornerUpRight, FiCopy, FiTrash, FiEdit, FiCheckSquare } from "react-icons/fi"

const ContextMenu = ({ x, y, onClose, options, onSelect }) => {
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose()
      }
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [onClose])

  const getIcon = (action) => {
    switch (action) {
      case "reply":
        return <FiCornerUpRight size={14} />
      case "forward":
        return <FiShare2 size={14} />
      case "copy":
        return <FiCopy size={14} />
      case "delete":
        return <FiTrash size={14} />
      case "edit":
        return <FiEdit size={14} />
      case "select":
        return <FiCheckSquare size={14} />
      default:
        return null
    }
  }

  return (
    <div
      ref={menuRef}
      className="absolute z-50 bg-bg-secondary border border-border rounded-lg shadow-lg py-1 w-48"
      style={{
        top: `${y}px`,
        left: `${x}px`,
        backgroundColor: 'var(--color-bg-secondary)',
        borderColor: 'var(--color-border)',
        color: 'var(--color-text-primary)',
      }}
    >
      {options.map((option) => (
        <button
          key={option.action}
          className="w-full text-left px-4 py-2 text-sm flex items-center space-x-2 transition-colors"
          style={{
            color: 'var(--color-text-primary)',
            opacity: option.disabled ? 0.5 : 1,
          }}
          onClick={() => {
            onSelect(option.action)
            onClose()
          }}
          disabled={option.disabled}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-border)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <span style={{ color: 'var(--color-accent)' }}>{getIcon(option.action)}</span>
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  )
}

export default ContextMenu