const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="feature-card group hover:border-accent hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/5">
      <div className="feature-icon group-hover:bg-accent group-hover:text-white">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-text-secondary">{description}</p>
      
      {/* Subtle arrow indicator */}
      <div className="mt-4 flex items-center text-accent text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        <span>Learn more</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  )
}

export default FeatureCard