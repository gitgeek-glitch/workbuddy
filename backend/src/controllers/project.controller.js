import { Project } from "../models/project.model.js"
import { User } from "../models/user.model.js"
import { Notification } from "../models/notification.model.js"
import winston from "winston"

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(winston.format.timestamp(), winston.format.simple()),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.timestamp(), winston.format.simple()),
    }),
    new winston.transports.File({ filename: "project-logs.log" }),
  ],
})

// Create a new project
export const createProject = async (req, res) => {
  try {
    const { name, description, deadline, collaborators } = req.body
    const userId = req.user._id

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        message: "Project name is required",
        data: [],
        code: 400,
      })
    }

    // Create new project with creator as Leader
    const newProject = new Project({
      name,
      description,
      deadline: deadline || null,
      members: [
        {
          userId,
          role: "Leader",
        },
      ],
    })

    // Save the project
    await newProject.save()

    // Process collaborators if provided
    if (collaborators && Array.isArray(collaborators)) {
      // Limit to maximum 7 additional collaborators (8 total including leader)
      const validCollaborators = collaborators.slice(0, 7)

      for (const username of validCollaborators) {
        // Find user by username
        const user = await User.findOne({ username })

        if (user && !user._id.equals(userId)) {
          // Add to invitations
          newProject.invitations.push(user._id)

          // Create notification for the invited user
          const notification = new Notification({
            user: user._id,
            message: `You have been invited to join the project "${name}"`,
            projectId: newProject._id,
            type: "Invitation",
          })

          await notification.save()
        }
      }

      // Save project with invitations
      await newProject.save()
    }

    logger.info(`${new Date().toISOString()} - Success: Project created with ID: ${newProject._id}`)

    return res.status(201).json({
      message: "Project created successfully",
      data: [newProject],
      code: 201,
    })
  } catch (error) {
    logger.error(`${new Date().toISOString()} - Error: Error creating project - ${error.message}`)
    return res.status(500).json({
      message: "Internal Server Error",
      data: [],
      code: 500,
    })
  }
}

// Accept project invitation
export const acceptInvitation = async (req, res) => {
  try {
    const { projectId } = req.params
    const userId = req.user._id

    // Find the project
    const project = await Project.findById(projectId)

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
        data: [],
        code: 404,
      })
    }

    // Check if user is invited
    const isInvited = project.invitations.some((invitedId) => invitedId.equals(userId))

    if (!isInvited) {
      return res.status(403).json({
        message: "You are not invited to this project",
        data: [],
        code: 403,
      })
    }

    // Check if project already has maximum members (8)
    if (project.members.length >= 8) {
      return res.status(400).json({
        message: "Project has reached maximum number of members",
        data: [],
        code: 400,
      })
    }

    // Add user as a member with default role "Member"
    project.members.push({
      userId,
      role: "Member",
    })

    // Remove from invitations
    project.invitations = project.invitations.filter((invitedId) => !invitedId.equals(userId))

    await project.save()

    // Create notification for project leader
    const leader = project.members.find((member) => member.role === "Leader")
    if (leader) {
      const notification = new Notification({
        user: leader.userId,
        message: `User ${req.user.username} has joined your project "${project.name}"`,
        projectId: project._id,
        type: "Invitation",
      })

      await notification.save()
    }

    logger.info(`${new Date().toISOString()} - Success: User ${userId} joined project ${projectId}`)

    return res.status(200).json({
      message: "Successfully joined the project",
      data: [project],
      code: 200,
    })
  } catch (error) {
    logger.error(`${new Date().toISOString()} - Error: Error accepting invitation - ${error.message}`)
    return res.status(500).json({
      message: "Internal Server Error",
      data: [],
      code: 500,
    })
  }
}

// Decline project invitation
export const declineInvitation = async (req, res) => {
  try {
    const { projectId } = req.params
    const userId = req.user._id

    // Find the project
    const project = await Project.findById(projectId)

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
        data: [],
        code: 404,
      })
    }

    // Check if user is invited
    const isInvited = project.invitations.some((invitedId) => invitedId.equals(userId))

    if (!isInvited) {
      return res.status(403).json({
        message: "You are not invited to this project",
        data: [],
        code: 403,
      })
    }

    // Remove from invitations
    project.invitations = project.invitations.filter((invitedId) => !invitedId.equals(userId))

    await project.save()

    logger.info(`${new Date().toISOString()} - Success: User ${userId} declined invitation to project ${projectId}`)

    return res.status(200).json({
      message: "Successfully declined the invitation",
      data: [],
      code: 200,
    })
  } catch (error) {
    logger.error(`${new Date().toISOString()} - Error: Error declining invitation - ${error.message}`)
    return res.status(500).json({
      message: "Internal Server Error",
      data: [],
      code: 500,
    })
  }
}

// Change member role (promote/demote)
export const changeMemberRole = async (req, res) => {
  try {
    const { projectId, memberId } = req.params
    const { role } = req.body
    const userId = req.user._id

    // Validate role
    if (!role || !["Leader", "Co-Leader", "Member"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role. Must be Leader, Co-Leader, or Member",
        data: [],
        code: 400,
      })
    }

    // Find the project
    const project = await Project.findById(projectId)

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
        data: [],
        code: 404,
      })
    }

    // Check if user is the leader
    const userMember = project.members.find((member) => member.userId.equals(userId))

    if (!userMember || userMember.role !== "Leader") {
      return res.status(403).json({
        message: "Only the project leader can change member roles",
        data: [],
        code: 403,
      })
    }

    // Find the member to update
    const memberIndex = project.members.findIndex((member) => member.userId.equals(memberId))

    if (memberIndex === -1) {
      return res.status(404).json({
        message: "Member not found in project",
        data: [],
        code: 404,
      })
    }

    // Cannot change own role
    if (project.members[memberIndex].userId.equals(userId)) {
      return res.status(400).json({
        message: "You cannot change your own role",
        data: [],
        code: 400,
      })
    }

    // Update the role
    const oldRole = project.members[memberIndex].role
    project.members[memberIndex].role = role
    await project.save()

    // Create notification for the member
    const notification = new Notification({
      user: memberId,
      message: `Your role in project "${project.name}" has been changed from ${oldRole} to ${role}`,
      projectId: project._id,
      type: "Role-Change",
    })

    await notification.save()

    logger.info(
      `${new Date().toISOString()} - Success: Member ${memberId} role changed to ${role} in project ${projectId}`,
    )

    return res.status(200).json({
      message: "Member role updated successfully",
      data: [project],
      code: 200,
    })
  } catch (error) {
    logger.error(`${new Date().toISOString()} - Error: Error changing member role - ${error.message}`)
    return res.status(500).json({
      message: "Internal Server Error",
      data: [],
      code: 500,
    })
  }
}

// Remove member from project
export const removeMember = async (req, res) => {
  try {
    const { projectId, memberId } = req.params
    const userId = req.user._id

    // Find the project
    const project = await Project.findById(projectId)

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
        data: [],
        code: 404,
      })
    }

    // Check if user is authorized (Leader or Co-Leader)
    const userMember = project.members.find((member) => member.userId.equals(userId))

    if (!userMember || (userMember.role !== "Leader" && userMember.role !== "Co-Leader")) {
      return res.status(403).json({
        message: "Only project leaders and co-leaders can remove members",
        data: [],
        code: 403,
      })
    }

    // Find the member to remove
    const memberToRemove = project.members.find((member) => member.userId.equals(memberId))

    if (!memberToRemove) {
      return res.status(404).json({
        message: "Member not found in project",
        data: [],
        code: 404,
      })
    }

    // Cannot remove self
    if (memberToRemove.userId.equals(userId)) {
      return res.status(400).json({
        message: "You cannot remove yourself from the project",
        data: [],
        code: 400,
      })
    }

    // Check permissions based on roles
    if (userMember.role === "Co-Leader" && memberToRemove.role !== "Member") {
      return res.status(403).json({
        message: "Co-Leaders can only remove Members",
        data: [],
        code: 403,
      })
    }

    // Remove the member
    project.members = project.members.filter((member) => !member.userId.equals(memberId))
    await project.save()

    // Create notification for the removed member
    const notification = new Notification({
      user: memberId,
      message: `You have been removed from project "${project.name}"`,
      projectId: project._id,
      type: "Role-Change",
    })

    await notification.save()

    logger.info(`${new Date().toISOString()} - Success: Member ${memberId} removed from project ${projectId}`)

    return res.status(200).json({
      message: "Member removed successfully",
      data: [project],
      code: 200,
    })
  } catch (error) {
    logger.error(`${new Date().toISOString()} - Error: Error removing member - ${error.message}`)
    return res.status(500).json({
      message: "Internal Server Error",
      data: [],
      code: 500,
    })
  }
}

// Get project details
export const getProject = async (req, res) => {
  try {
    const { projectId } = req.params
    const userId = req.user._id

    // Find the project and populate member details
    const project = await Project.findById(projectId)
      .populate("members.userId", "fullName username email")
      .populate("invitations", "fullName username email")

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
        data: [],
        code: 404,
      })
    }

    // Check if user is a member or invited
    const isMember = project.members.some((member) => member.userId._id.equals(userId))
    const isInvited = project.invitations.some((invited) => invited._id.equals(userId))

    if (!isMember && !isInvited) {
      return res.status(403).json({
        message: "You do not have access to this project",
        data: [],
        code: 403,
      })
    }

    logger.info(`${new Date().toISOString()} - Success: Project ${projectId} details retrieved`)

    return res.status(200).json({
      message: "Project details retrieved successfully",
      data: [project],
      code: 200,
    })
  } catch (error) {
    logger.error(`${new Date().toISOString()} - Error: Error getting project details - ${error.message}`)
    return res.status(500).json({
      message: "Internal Server Error",
      data: [],
      code: 500,
    })
  }
}

// Get all projects for a user
export const getUserProjects = async (req, res) => {
  try {
    const userId = req.user._id

    // Find projects where user is a member
    const projects = await Project.find({
      "members.userId": userId,
    })
      .populate("members.userId", "fullName username")
      .select("name description status deadline members createdAt")

    // Find projects where user is invited
    const invitations = await Project.find({
      invitations: userId,
    }).select("name description status deadline createdAt")

    logger.info(`${new Date().toISOString()} - Success: Retrieved projects for user ${userId}`)

    return res.status(200).json({
      message: "User projects retrieved successfully",
      data: [
        {
          projects,
          invitations,
        },
      ],
      code: 200,
    })
  } catch (error) {
    logger.error(`${new Date().toISOString()} - Error: Error getting user projects - ${error.message}`)
    return res.status(500).json({
      message: "Internal Server Error",
      data: [],
      code: 500,
    })
  }
}

// Invite additional members to a project
export const inviteMembers = async (req, res) => {
  try {
    const { projectId } = req.params
    const { usernames } = req.body
    const userId = req.user._id

    if (!usernames || !Array.isArray(usernames) || usernames.length === 0) {
      return res.status(400).json({
        message: "Valid usernames array is required",
        data: [],
        code: 400,
      })
    }

    // Find the project
    const project = await Project.findById(projectId)

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
        data: [],
        code: 404,
      })
    }

    // Check if user is authorized (Leader or Co-Leader)
    const userMember = project.members.find((member) => member.userId.equals(userId))

    if (!userMember || (userMember.role !== "Leader" && userMember.role !== "Co-Leader")) {
      return res.status(403).json({
        message: "Only project leaders and co-leaders can invite members",
        data: [],
        code: 403,
      })
    }

    // Calculate how many more members can be added
    const currentMemberCount = project.members.length + project.invitations.length
    const availableSlots = 8 - currentMemberCount

    if (availableSlots <= 0) {
      return res.status(400).json({
        message: "Project has reached maximum number of members",
        data: [],
        code: 400,
      })
    }

    // Limit invitations to available slots
    const limitedUsernames = usernames.slice(0, availableSlots)
    const newInvitations = []

    for (const username of limitedUsernames) {
      // Find user by username
      const user = await User.findOne({ username })

      if (user) {
        // Check if user is already a member
        const isMember = project.members.some((member) => member.userId.equals(user._id))

        // Check if user is already invited
        const isInvited = project.invitations.some((invitedId) => invitedId.equals(user._id))

        if (!isMember && !isInvited) {
          // Add to invitations
          project.invitations.push(user._id)
          newInvitations.push(user._id)

          // Create notification for the invited user
          const notification = new Notification({
            user: user._id,
            message: `You have been invited to join the project "${project.name}"`,
            projectId: project._id,
            type: "Invitation",
          })

          await notification.save()
        }
      }
    }

    await project.save()

    logger.info(`${new Date().toISOString()} - Success: Invited ${newInvitations.length} users to project ${projectId}`)

    return res.status(200).json({
      message: `Successfully invited ${newInvitations.length} users to the project`,
      data: [project],
      code: 200,
    })
  } catch (error) {
    logger.error(`${new Date().toISOString()} - Error: Error inviting members - ${error.message}`)
    return res.status(500).json({
      message: "Internal Server Error",
      data: [],
      code: 500,
    })
  }
}
