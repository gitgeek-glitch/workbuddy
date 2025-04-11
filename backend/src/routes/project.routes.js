import express from "express"
import {
  createProject,
  acceptInvitation,
  declineInvitation,
  changeMemberRole,
  removeMember,
  getProject,
  getUserProjects,
  inviteMembers,
  leaveProject,
  deleteProject,
  updateProject,
} from "../controllers/project.controller.js"
import { authenticateJWT } from "../middlewares/auth.middleware.js"

const router = express.Router()

// Apply authentication middleware to all project routes
router.use(authenticateJWT)

// Create a new project
router.post("/", createProject)

// Get all projects for the authenticated user
router.get("/user", getUserProjects)

// Get specific project details
router.get("/:projectId", getProject)

// Update project
router.patch("/:projectId", updateProject)

// Delete project
router.delete("/:projectId", deleteProject)

// Accept project invitation
router.post("/:projectId/accept", acceptInvitation)

// Decline project invitation
router.post("/:projectId/decline", declineInvitation)

// Change member role (promote/demote)
router.patch("/:projectId/members/:memberId/role", changeMemberRole)

// Remove member from project
router.delete("/:projectId/members/:memberId", removeMember)

// Invite additional members to a project
router.post("/:projectId/invite", inviteMembers)

// Leave a project
router.delete("/:projectId/leave", leaveProject)

export default router