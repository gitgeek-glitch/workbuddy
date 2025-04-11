import { Link } from "react-router-dom"
import { FiCode, FiGithub, FiTwitter, FiLinkedin, FiMail, FiArrowRight } from "react-icons/fi"

const Footer = ({ simplified = false }) => {
  const currentYear = new Date().getFullYear()

  if (simplified) {
    return (
      <footer className="bg-bg-secondary border-t border-border py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur-sm opacity-70"></div>
              <div className="relative bg-bg-secondary rounded-lg p-1.5">
                <FiCode className="h-6 w-6 text-accent" />
              </div>
            </div>
            <span className="font-bold text-lg ml-2 gradient-text">TeamCollab</span>
          </div>
          <p className="text-text-secondary mt-4 md:mt-0 text-sm">
            &copy; {currentYear} TeamCollab. All rights reserved.
          </p>
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-bg-secondary border-t border-border py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto">
        {/* Newsletter section */}
        <div className="mb-16 p-8 rounded-2xl bg-bg-primary border border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 opacity-10 rounded-full filter blur-3xl"></div>
          
          <div className="relative max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4 gradient-text">Stay updated with TeamCollab</h3>
            <p className="text-text-secondary mb-6">Get the latest news, updates, and tips delivered directly to your inbox.</p>
            
            <form className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-bg-secondary border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                required
              />
              <button 
                type="submit" 
                className="relative overflow-hidden px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 flex items-center justify-center group"
              >
                <span className="relative z-10">Subscribe</span>
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></span>
              </button>
            </form>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 gradient-text">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link to="#features" className="text-text-secondary hover:text-accent transition-colors duration-200 flex items-center group">
                  <span className="w-0 h-0.5 bg-accent mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                  Features
                </Link>
              </li>
              <li>
                <Link to="#pricing" className="text-text-secondary hover:text-accent transition-colors duration-200 flex items-center group">
                  <span className="w-0 h-0.5 bg-accent mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="#security" className="text-text-secondary hover:text-accent transition-colors duration-200 flex items-center group">
                  <span className="w-0 h-0.5 bg-accent mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                  Security
                </Link>
              </li>
              <li>
                <Link to="#roadmap" className="text-text-secondary hover:text-accent transition-colors duration-200 flex items-center group">
                  <span className="w-0 h-0.5 bg-accent mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 gradient-text">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="#docs" className="text-text-secondary hover:text-accent transition-colors duration-200 flex items-center group">
                  <span className="w-0 h-0.5 bg-accent mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="#guides" className="text-text-secondary hover:text-accent transition-colors duration-200 flex items-center group">
                  <span className="w-0 h-0.5 bg-accent mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                  Guides
                </Link>
              </li>
              <li>
                <Link to="#api" className="text-text-secondary hover:text-accent transition-colors duration-200 flex items-center group">
                  <span className="w-0 h-0.5 bg-accent mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                  API Reference
                </Link>
              </li>
              <li>
                <Link to="#community" className="text-text-secondary hover:text-accent transition-colors duration-200 flex items-center group">
                  <span className="w-0 h-0.5 bg-accent mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                  Community
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 gradient-text">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="#about" className="text-text-secondary hover:text-accent transition-colors duration-200 flex items-center group">
                  <span className="w-0 h-0.5 bg-accent mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                  About
                </Link>
              </li>
              <li>
                <Link to="#blog" className="text-text-secondary hover:text-accent transition-colors duration-200 flex items-center group">
                  <span className="w-0 h-0.5 bg-accent mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                  Blog
                </Link>
              </li>
              <li>
                <Link to="#careers" className="text-text-secondary hover:text-accent transition-colors duration-200 flex items-center group">
                  <span className="w-0 h-0.5 bg-accent mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                  Careers
                </Link>
              </li>
              <li>
                <Link to="#contact" className="text-text-secondary hover:text-accent transition-colors duration-200 flex items-center group">
                  <span className="w-0 h-0.5 bg-accent mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 gradient-text">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="#privacy" className="text-text-secondary hover:text-accent transition-colors duration-200 flex items-center group">
                  <span className="w-0 h-0.5 bg-accent mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="#terms" className="text-text-secondary hover:text-accent transition-colors duration-200 flex items-center group">
                  <span className="w-0 h-0.5 bg-accent mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                  Terms
                </Link>
              </li>
              <li>
                <Link to="#cookies" className="text-text-secondary hover:text-accent transition-colors duration-200 flex items-center group">
                  <span className="w-0 h-0.5 bg-accent mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="#licenses" className="text-text-secondary hover:text-accent transition-colors duration-200 flex items-center group">
                  <span className="w-0 h-0.5 bg-accent mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                  Licenses
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur-sm opacity-70"></div>
              <div className="relative bg-bg-secondary rounded-lg p-1.5">
                <FiCode className="h-6 w-6 text-accent" />
              </div>
            </div>
            <span className="font-bold text-xl ml-2 gradient-text">TeamCollab</span>
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent transition-colors p-2 rounded-full hover:bg-bg-primary"
            >
              <FiGithub size={20} />
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent transition-colors p-2 rounded-full hover:bg-bg-primary"
            >
              <FiTwitter size={20} />
              <span className="sr-only">Twitter</span>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent transition-colors p-2 rounded-full hover:bg-bg-primary"
            >
              <FiLinkedin size={20} />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a 
              href="mailto:info@teamcollab.com" 
              className="text-text-secondary hover:text-accent transition-colors p-2 rounded-full hover:bg-bg-primary"
            >
              <FiMail size={20} />
              <span className="sr-only">Email</span>
            </a>
          </div>

          <p className="text-text-secondary mt-4 md:mt-0">&copy; {currentYear} TeamCollab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer