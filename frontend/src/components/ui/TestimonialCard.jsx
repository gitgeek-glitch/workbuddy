import { FiStar } from "react-icons/fi"

const TestimonialCard = ({ avatarUrl, name, role, testimonial, rating = 5 }) => {
  return (
    <div className="bg-bg-secondary p-6 rounded-lg border border-border hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center mb-4">
        <img
          src={avatarUrl || "/placeholder.svg?height=48&width=48"}
          alt={`${name}'s avatar`}
          className="w-12 h-12 rounded-full"
        />
        <div className="ml-4">
          <h4 className="font-semibold">{name}</h4>
          <p className="text-text-secondary text-sm">{role}</p>
        </div>
      </div>
      <p className="text-text-secondary italic">"{testimonial}"</p>
      <div className="flex mt-4">
        {[...Array(rating)].map((_, i) => (
          <FiStar key={i} className="text-yellow-400" />
        ))}
        {[...Array(5 - rating)].map((_, i) => (
          <FiStar key={i + rating} className="text-text-secondary opacity-30" />
        ))}
      </div>
    </div>
  )
}

export default TestimonialCard