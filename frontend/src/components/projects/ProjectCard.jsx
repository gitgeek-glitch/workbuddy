import { Link } from "react-router-dom"
import { FiGitPullRequest, FiGitCommit, FiUsers } from "react-icons/fi"

const ProjectCard = ({ project }) => {
  return (
    <div className="card hover:border-accent transition-colors">
      <Link to={`/projects/${project.id}`}>
        <h3 className="text-lg font-semibold mb-2 hover:text-accent">{project.name}</h3>
      </Link>
      <p className="text-text-secondary text-sm mb-4 line-clamp-2">{project.description}</p>

      <div className="flex items-center text-sm text-text-secondary space-x-4">
        <div className="flex items-center space-x-1">
          <FiGitPullRequest size={14} />
          <span>{project.pullRequests} PRs</span>
        </div>
        <div className="flex items-center space-x-1">
          <FiGitCommit size={14} />
          <span>{project.commits} commits</span>
        </div>
        <div className="flex items-center space-x-1">
          <FiUsers size={14} />
          <span>{project.members} members</span>
        </div>
      </div>

      <div className="mt-4 flex items-center space-x-1">
        {project.languages.map((lang, index) => (
          <span key={index} className="px-2 py-0.5 text-xs rounded-full bg-bg-primary">
            {lang}
          </span>
        ))}
      </div>

      <div className="mt-4 flex -space-x-2">
        {project.teamMembers.slice(0, 4).map((member, index) => (
          <img
            key={index}
            src={member.avatar || `/placeholder.svg?height=24&width=24`}
            alt={member.name}
            className="w-6 h-6 rounded-full border border-bg-secondary"
          />
        ))}
        {project.teamMembers.length > 4 && (
          <div className="w-6 h-6 rounded-full bg-bg-primary flex items-center justify-center text-xs">
            +{project.teamMembers.length - 4}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectCard