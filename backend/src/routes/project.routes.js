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

export default router
