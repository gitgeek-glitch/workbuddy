import { Link } from "react-router-dom"
import { FiCode, FiGithub, FiTwitter, FiLinkedin, FiMail } from "react-icons/fi"

const Footer = ({ simplified = false }) => {
  const currentYear = new Date().getFullYear()

  if (simplified) {
    return (
      <footer className="bg-bg-secondary border-t border-border py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <FiCode className="h-6 w-6 text-accent" />
            <span className="font-bold text-lg ml-2">TeamCollab</span>
          </div>
          <p className="text-text-secondary mt-4 md:mt-0 text-sm">
            &copy; {currentYear} TeamCollab. All rights reserved.
          </p>
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-bg-secondary border-t border-border py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#features" className="text-text-secondary hover:text-accent transition-colors duration-200">
                  Features
                </Link>
              </li>
              <li>
                <Link to="#pricing" className="text-text-secondary hover:text-accent transition-colors duration-200">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="#security" className="text-text-secondary hover:text-accent transition-colors duration-200">
                  Security
                </Link>
              </li>
              <li>
                <Link to="#roadmap" className="text-text-secondary hover:text-accent transition-colors duration-200">
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#docs" className="text-text-secondary hover:text-accent transition-colors duration-200">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="#guides" className="text-text-secondary hover:text-accent transition-colors duration-200">
                  Guides
                </Link>
              </li>
              <li>
                <Link to="#api" className="text-text-secondary hover:text-accent transition-colors duration-200">
                  API Reference
                </Link>
              </li>
              <li>
                <Link to="#community" className="text-text-secondary hover:text-accent transition-colors duration-200">
                  Community
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#about" className="text-text-secondary hover:text-accent transition-colors duration-200">
                  About
                </Link>
              </li>
              <li>
                <Link to="#blog" className="text-text-secondary hover:text-accent transition-colors duration-200">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="#careers" className="text-text-secondary hover:text-accent transition-colors duration-200">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="#contact" className="text-text-secondary hover:text-accent transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#privacy" className="text-text-secondary hover:text-accent transition-colors duration-200">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="#terms" className="text-text-secondary hover:text-accent transition-colors duration-200">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="#cookies" className="text-text-secondary hover:text-accent transition-colors duration-200">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="#licenses" className="text-text-secondary hover:text-accent transition-colors duration-200">
                  Licenses
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <FiCode className="h-8 w-8 text-accent" />
            <span className="font-bold text-xl ml-2">TeamCollab</span>
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent transition-colors"
            >
              <FiGithub size={20} />
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent transition-colors"
            >
              <FiTwitter size={20} />
              <span className="sr-only">Twitter</span>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent transition-colors"
            >
              <FiLinkedin size={20} />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a href="mailto:info@teamcollab.com" className="text-text-secondary hover:text-accent transition-colors">
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