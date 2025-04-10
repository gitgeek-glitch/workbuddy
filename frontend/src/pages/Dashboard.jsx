"use client"
import { useSelector } from "react-redux"
import { FiGitCommit, FiUsers, FiGitPullRequest, FiGitBranch, FiStar } from "react-icons/fi"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

const Dashboard = () => {
  const { projects, loading, error } = useSelector((state) => state.projects)
  const { currentUser } = useSelector((state) => state.user)

  // Calculate total team members across all projects
  const allTeamMembers = projects.reduce((acc, project) => {
    project.teamMembers.forEach((member) => {
      if (!acc.some((m) => m.id === member.id)) {
        acc.push(member)
      }
    })
    return acc
  }, [])

  // Calculate total commits across all projects
  const totalCommits = projects.reduce((sum, project) => sum + project.commits, 0)

  // Calculate total pull requests
  const totalPullRequests = projects.reduce((sum, project) => sum + project.pullRequests, 0)

  // Mock data for user's personal commits
  const userCommits = 87

  // Mock data for project progress
  const projectProgress = projects.map((project) => ({
    id: project.id,
    name: project.name,
    progress: Math.floor(Math.random() * 100), // Random progress for demo
    commits: project.commits,
    members: project.teamMembers.length,
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg p-4 my-4">
        Error loading dashboard data: {error}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{projects.length}</div>
              <div className="ml-auto p-2 bg-accent/10 rounded-full">
                <FiFolder className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Total Commits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{totalCommits}</div>
              <div className="ml-auto p-2 bg-accent/10 rounded-full">
                <FiGitCommit className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Pull Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{totalPullRequests}</div>
              <div className="ml-auto p-2 bg-accent/10 rounded-full">
                <FiGitPullRequest className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{allTeamMembers.length}</div>
              <div className="ml-auto p-2 bg-accent/10 rounded-full">
                <FiUsers className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Stats */}
      <h2 className="text-xl font-semibold mb-4">Your Activity</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Your Commits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{userCommits}</div>
              <div className="ml-auto p-2 bg-accent/10 rounded-full">
                <FiGitCommit className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{projects.filter((p) => p.status === "active").length}</div>
              <div className="ml-auto p-2 bg-accent/10 rounded-full">
                <FiStar className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Branches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{Math.floor(totalCommits / 15)}</div> {/* Mock data */}
              <div className="ml-auto p-2 bg-accent/10 rounded-full">
                <FiGitBranch className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Progress */}
      <h2 className="text-xl font-semibold mb-4">Project Progress</h2>
      <div className="grid grid-cols-1 gap-4">
        {projectProgress.map((project) => (
          <Card key={project.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{project.name}</h3>
                <span className="text-sm text-text-secondary">{project.progress}% complete</span>
              </div>
              <div className="w-full bg-bg-primary rounded-full h-2.5 mb-4">
                <div className="bg-accent h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
              </div>
              <div className="flex justify-between text-sm text-text-secondary">
                <div className="flex items-center">
                  <FiGitCommit className="mr-1" />
                  {project.commits} commits
                </div>
                <div className="flex items-center">
                  <FiUsers className="mr-1" />
                  {project.members} members
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team Members */}
      <h2 className="text-xl font-semibold mt-8 mb-4">Team Members</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allTeamMembers.slice(0, 6).map((member) => (
          <Card key={member.id}>
            <CardContent className="p-6 flex items-center">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-medium mr-3">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h3 className="font-medium">{member.name}</h3>
                <p className="text-sm text-text-secondary">Team Member</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Dashboard

// Import for FiFolder icon
import { FiFolder } from "react-icons/fi"