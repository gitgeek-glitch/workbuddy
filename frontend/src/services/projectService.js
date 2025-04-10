// Mock data for projects
let mockProjects = [
  {
    id: "1",
    name: "Team Collaboration Platform",
    description: "A platform for teams to collaborate on projects, share files, and communicate in real-time.",
    status: "active",
    important: true,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    pullRequests: 5,
    commits: 128,
    members: 8,
    languages: ["React", "Node.js", "MongoDB"],
    teamMembers: [
      { id: "user1", name: "John Doe", avatar: null },
      { id: "user2", name: "Jane Smith", avatar: null },
      { id: "user3", name: "Bob Johnson", avatar: null },
      { id: "user4", name: "Alice Williams", avatar: null },
      { id: "user5", name: "Charlie Brown", avatar: null },
    ],
  },
  {
    id: "2",
    name: "E-commerce Dashboard",
    description: "Admin dashboard for managing products, orders, and customers for an e-commerce platform.",
    status: "active",
    important: false,
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    pullRequests: 3,
    commits: 87,
    members: 4,
    languages: ["React", "Express", "PostgreSQL"],
    teamMembers: [
      { id: "user1", name: "John Doe", avatar: null },
      { id: "user2", name: "Jane Smith", avatar: null },
      { id: "user6", name: "David Miller", avatar: null },
      { id: "user7", name: "Emma Wilson", avatar: null },
    ],
  },
  {
    id: "3",
    name: "Mobile App Backend",
    description: "RESTful API for a mobile application with authentication, file uploads, and real-time notifications.",
    status: "active",
    important: true,
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    pullRequests: 2,
    commits: 64,
    members: 3,
    languages: ["Node.js", "Express", "MongoDB"],
    teamMembers: [
      { id: "user1", name: "John Doe", avatar: null },
      { id: "user3", name: "Bob Johnson", avatar: null },
      { id: "user8", name: "Grace Taylor", avatar: null },
    ],
  },
  {
    id: "4",
    name: "Analytics Dashboard",
    description: "Data visualization dashboard for tracking user engagement and business metrics.",
    status: "active",
    important: false,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    pullRequests: 0,
    commits: 42,
    members: 2,
    languages: ["React", "D3.js", "Firebase"],
    teamMembers: [
      { id: "user2", name: "Jane Smith", avatar: null },
      { id: "user4", name: "Alice Williams", avatar: null },
    ],
  },
  {
    id: "5",
    name: "Customer Portal",
    description: "A portal for customers to manage their accounts, view orders, and get support.",
    status: "finished",
    important: false,
    deadline: null, // No deadline for finished projects
    pullRequests: 7,
    commits: 156,
    members: 5,
    languages: ["React", "Node.js", "PostgreSQL"],
    teamMembers: [
      { id: "user1", name: "John Doe", avatar: null },
      { id: "user2", name: "Jane Smith", avatar: null },
      { id: "user3", name: "Bob Johnson", avatar: null },
      { id: "user6", name: "David Miller", avatar: null },
      { id: "user7", name: "Emma Wilson", avatar: null },
    ],
  },
  {
    id: "6",
    name: "Inventory Management System",
    description: "System for tracking inventory levels, orders, sales, and deliveries for a retail business.",
    status: "finished",
    important: true,
    deadline: null, // No deadline for finished projects
    pullRequests: 4,
    commits: 98,
    members: 3,
    languages: ["Vue.js", "Express", "MongoDB"],
    teamMembers: [
      { id: "user3", name: "Bob Johnson", avatar: null },
      { id: "user5", name: "Charlie Brown", avatar: null },
      { id: "user8", name: "Grace Taylor", avatar: null },
    ],
  },
]

// Simulate API calls with promises
export const fetchProjects = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockProjects]) // Return a copy to avoid reference issues
    }, 500)
  })
}

export const fetchProjectById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const project = mockProjects.find((p) => p.id === id)
      if (project) {
        resolve({ ...project }) // Return a copy
      } else {
        reject(new Error("Project not found"))
      }
    }, 500)
  })
}

export const createProject = (projectData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newProject = {
        id: Date.now().toString(),
        ...projectData,
        pullRequests: projectData.pullRequests || 0,
        commits: projectData.commits || 0,
        status: projectData.status || "active", // Default to active if not specified
        important: projectData.important || false, // Default to not important
      }

      // Add the new project to the mockProjects array
      mockProjects = [...mockProjects, newProject]

      resolve(newProject)
    }, 500)
  })
}

export const updateProject = (id, projectData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const projectIndex = mockProjects.findIndex((p) => p.id === id)
      if (projectIndex !== -1) {
        const updatedProject = { ...mockProjects[projectIndex], ...projectData }
        mockProjects[projectIndex] = updatedProject
        resolve(updatedProject)
      } else {
        reject(new Error("Project not found"))
      }
    }, 500)
  })
}

export const deleteProject = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const projectIndex = mockProjects.findIndex((p) => p.id === id)
      if (projectIndex !== -1) {
        mockProjects = mockProjects.filter((p) => p.id !== id)
        resolve({ success: true })
      } else {
        reject(new Error("Project not found"))
      }
    }, 500)
  })
}