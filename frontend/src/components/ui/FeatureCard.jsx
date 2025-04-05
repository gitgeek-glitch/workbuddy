const FeatureCard = ({ icon, title, description }) => {
    return (
      <div className="feature-card">
        <div className="feature-icon">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-text-secondary">{description}</p>
      </div>
    )
  }
  
  export default FeatureCard  