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
        <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-bg-secondary border border-border text-sm font-medium">
          <span className="mr-2 text-accent">✨</span>
          <span>Next-Gen Collaboration Platform</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 gradient-text">{title}</h1>
        <p className="text-xl text-text-secondary mb-10">{subtitle}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {primaryButtonText && (
            <Link to={primaryButtonLink} className="relative overflow-hidden px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium text-lg transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 flex items-center justify-center group">
              <span className="relative z-10">{primaryButtonText}</span>
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></span>
            </Link>
          )}
          {secondaryButtonText && (
            <Link to={secondaryButtonLink} className="px-8 py-4 rounded-full border border-border hover:border-accent text-text-primary font-medium text-lg transition-all duration-300 flex items-center justify-center">
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
              {/* Floating elements */}
              <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-accent bg-opacity-10 border border-accent animate-pulse"></div>
              <div className="absolute top-1/4 -right-3 w-6 h-6 rounded-full bg-purple-500 bg-opacity-20 border border-purple-500 animate-bounce"></div>
              <div className="absolute bottom-1/3 -left-4 w-8 h-8 rounded-full bg-green-500 bg-opacity-20 border border-green-500 animate-ping"></div>
              
              {/* Code snippet floating element */}
              <div className="absolute -bottom-6 right-10 glassmorphism p-4 rounded-xl border border-border shadow-lg transform rotate-3 hidden md:block">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-danger"></div>
                  <div className="w-3 h-3 rounded-full bg-warning"></div>
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                </div>
                <div className="text-xs font-mono text-text-secondary">
                  <div>import { <span className="text-accent">TeamCollab</span> } from 'teamcollab';</div>
                  <div>const project = new <span className="text-accent">TeamCollab</span>();</div>
                  <div>project.<span className="text-success">collaborate</span>();</div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  )
}

export default Hero