import { Link } from "react-router-dom"
import { FiArrowRight } from "react-icons/fi"

const Hero = ({
  title,
  subtitle,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  image,
  imageAlt,
  showFloatingElements = true,
}) => {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 gradient-text">{title}</h1>
        <p className="text-xl text-text-secondary mb-10">{subtitle}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {primaryButtonText && (
            <Link to={primaryButtonLink} className="btn-primary flex items-center justify-center">
              {primaryButtonText}
              <FiArrowRight className="ml-2" />
            </Link>
          )}
          {secondaryButtonText && (
            <Link to={secondaryButtonLink} className="btn-outline">
              {secondaryButtonText}
            </Link>
          )}
        </div>
      </div>

      {image && (
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary to-transparent z-10 h-32 bottom-0 rounded-b-lg"></div>
          <div className="rounded-lg border border-border overflow-hidden shadow-2xl transform transition-transform duration-500 hover:scale-[1.02]">
            <img src={image || "/placeholder.svg"} alt={imageAlt || "Hero image"} className="w-full" />
          </div>

          {showFloatingElements && (
            <>
              <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-accent bg-opacity-10 border border-accent animate-pulse"></div>
              <div className="absolute top-1/4 -right-3 w-6 h-6 rounded-full bg-purple-500 bg-opacity-20 border border-purple-500 animate-bounce"></div>
              <div className="absolute bottom-1/3 -left-4 w-8 h-8 rounded-full bg-green-500 bg-opacity-20 border border-green-500 animate-ping"></div>
            </>
          )}
        </div>
      )}
    </section>
  )
}

export default Hero