// Mock data for projects
const mockProjects = [
    {
      id: "1",
      name: "Team Collaboration Platform",
      description: "A platform for teams to collaborate on projects, share files, and communicate in real-time.",
      status: "active",
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
      status: "archived",
      pullRequests: 0,
      commits: 42,
      members: 2,
      languages: ["React", "D3.js", "Firebase"],
      teamMembers: [
        { id: "user2", name: "Jane Smith", avatar: null },
        { id: "user4", name: "Alice Williams", avatar: null },
      ],
    },
  ]
  
  // Simulate API calls with promises
  export const fetchProjects = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockProjects)
      }, 500)
    })
  }
  
  export const fetchProjectById = (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const project = mockProjects.find((p) => p.id === id)
        if (project) {
          resolve(project)
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
          pullRequests: 0,
          commits: 0,
        }
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
          resolve({ success: true })
        } else {
          reject(new Error("Project not found"))
        }
      }, 500)
    })
  }  