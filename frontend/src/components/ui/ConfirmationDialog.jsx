"use client"

import { useEffect, useRef } from "react"
import { FiAlertTriangle } from "react-icons/fi"

const ConfirmationDialog = ({ title, message, onConfirm, onCancel }) => {
  const dialogRef = useRef(null)

  useEffect(() => {
    // Focus the cancel button by default for safety
    const cancelButton = dialogRef.current?.querySelector("button:last-child")
    if (cancelButton) {
      cancelButton.focus()
    }

    // Handle escape key to close dialog
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onCancel()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [onCancel])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={dialogRef}
        className="bg-bg-primary border border-border rounded-lg shadow-lg max-w-md w-full p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-danger/10 p-2 rounded-full">
            <FiAlertTriangle className="text-danger w-6 h-6" />
          </div>
          <h3 id="dialog-title" className="text-lg font-semibold">
            {title}
          </h3>
        </div>

        <p className="text-text-secondary mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-border rounded-md hover:bg-bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-danger text-white rounded-md hover:bg-danger/90 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationDialog