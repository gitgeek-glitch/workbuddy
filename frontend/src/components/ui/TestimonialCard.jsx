import { FiStar } from "react-icons/fi"

const TestimonialCard = ({ avatarUrl, name, role, testimonial, rating = 5 }) => {
  return (
    <div className="bg-bg-secondary p-6 rounded-lg border border-border hover:shadow-md transition-shadow duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-accent/5">
      <div className="flex items-center mb-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm opacity-70"></div>
          <img
            src={avatarUrl || "/placeholder.svg?height=48&width=48"}
            alt={`${name}'s avatar`}
            className="w-12 h-12 rounded-full relative"
          />
        </div>
        <div className="ml-4">
          <h4 className="font-semibold">{name}</h4>
          <p className="text-text-secondary text-sm">{role}</p>
        </div>
      </div>
      <p className="text-text-secondary italic mb-4">"{testimonial}"</p>
      <div className="flex">
        {[...Array(rating)].map((_, i) => (
          <FiStar key={i} className="text-yellow-400 fill-current" />
        ))}
        {[...Array(5 - rating)].map((_, i) => (
          <FiStar key={i + rating} className="text-text-secondary opacity-30" />
        ))}
      </div>
    </div>
  )
}

export default TestimonialCard