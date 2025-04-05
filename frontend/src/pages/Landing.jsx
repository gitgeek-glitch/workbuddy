"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import {
  FiGithub,
  FiCode,
  FiUsers,
  FiMessageSquare,
  FiFileText,
  FiCheckCircle,
  FiStar,
  FiArrowRight,
} from "react-icons/fi"
import { useTheme } from "../context/ThemeContext"
import ThemeToggle from "../components/ui/ThemeToggle"
import Hero from "../components/ui/Hero"
import FeatureCard from "../components/ui/FeatureCard"
import TestimonialCard from "../components/ui/TestimonialCard"
import Footer from "../components/layout/Footer"

const Landing = () => {
  const { darkMode } = useTheme()
  const [isVisible, setIsVisible] = useState({
    hero: false,
    features: false,
    collaboration: false,
    testimonials: false,
    cta: false,
  })

  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const collaborationRef = useRef(null)
  const testimonialsRef = useRef(null)
  const ctaRef = useRef(null)

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    }

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.dataset.section]: true,
          }))
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    if (heroRef.current) observer.observe(heroRef.current)
    if (featuresRef.current) observer.observe(featuresRef.current)
    if (collaborationRef.current) observer.observe(collaborationRef.current)
    if (testimonialsRef.current) observer.observe(testimonialsRef.current)
    if (ctaRef.current) observer.observe(ctaRef.current)

    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current)
      if (featuresRef.current) observer.unobserve(featuresRef.current)
      if (collaborationRef.current) observer.unobserve(collaborationRef.current)
      if (testimonialsRef.current) observer.unobserve(testimonialsRef.current)
      if (ctaRef.current) observer.unobserve(ctaRef.current)
    }
  }, [])

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Navbar */}
      <nav className="navbar backdrop-blur-sm bg-opacity-80 fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <FiCode className="h-8 w-8 text-accent" />
                <span className="font-bold text-xl">TeamCollab</span>
              </Link>
              <div className="hidden md:flex md:ml-10 md:space-x-8">
                <a
                  href="#features"
                  className="text-text-secondary hover:text-accent px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Features
                </a>
                <a
                  href="#collaboration"
                  className="text-text-secondary hover:text-accent px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Collaboration
                </a>
                <a
                  href="#testimonials"
                  className="text-text-secondary hover:text-accent px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Testimonials
                </a>
                <a
                  href="#"
                  className="text-text-secondary hover:text-accent px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Pricing
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link
                to="/login"
                className="text-text-secondary hover:text-accent px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Sign in
              </Link>
              <Link to="/signup" className="btn-primary text-sm">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div
        ref={heroRef}
        data-section="hero"
        className={`transition-all duration-1000 transform ${isVisible.hero ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
      >
        <Hero
          title="Collaborate, Create, Conquer"
          subtitle="A powerful platform for teams to collaborate on projects, share files, and communicate in real-time."
          primaryButtonText="Get started for free"
          primaryButtonLink="/signup"
          secondaryButtonText="Learn more"
          secondaryButtonLink="#features"
          image="/placeholder.svg?height=600&width=1200"
          imageAlt="TeamCollab Dashboard"
        />
      </div>

      {/* Features Section */}
      <section id="features" ref={featuresRef} data-section="features" className="section">
        <div
          className={`transition-all duration-1000 transform ${isVisible.features ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="text-center mb-16">
            <h2 className="section-title">Powerful Features</h2>
            <p className="section-subtitle">
              Everything you need to manage your projects and collaborate with your team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FiFileText className="text-accent text-xl" />}
              title="File Management"
              description="Upload, organize, and share files with your team. Track versions and collaborate on documents in real-time."
            />

            <FeatureCard
              icon={<FiMessageSquare className="text-accent text-xl" />}
              title="Real-time Chat"
              description="Communicate with your team in real-time. Create channels for different topics and share files directly in the chat."
            />

            <FeatureCard
              icon={<FiUsers className="text-accent text-xl" />}
              title="Team Management"
              description="Invite team members, assign roles, and manage permissions. Keep track of who's working on what."
            />

            <FeatureCard
              icon={<FiCheckCircle className="text-accent text-xl" />}
              title="Task Management"
              description="Create tasks, assign them to team members, and track progress. Set deadlines and priorities."
            />

            <FeatureCard
              icon={<FiGithub className="text-accent text-xl" />}
              title="Git Integration"
              description="Connect your GitHub repositories and manage pull requests, code reviews, and issues directly from the platform."
            />

            <FeatureCard
              icon={<FiStar className="text-accent text-xl" />}
              title="Customization"
              description="Customize the platform to fit your team's needs. Create custom workflows, fields, and views."
            />
          </div>
        </div>
      </section>

      {/* Collaboration Section */}
      <section id="collaboration" ref={collaborationRef} data-section="collaboration" className="section">
        <div
          className={`transition-all duration-1000 transform ${isVisible.collaboration ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Seamless Collaboration</h2>
              <p className="text-lg text-text-secondary mb-6">
                TeamCollab brings your team together, no matter where they are. Work on projects, share ideas, and make
                decisions together in real-time.
              </p>

              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-success bg-opacity-20 flex items-center justify-center mt-1">
                    <FiCheckCircle className="text-success text-sm" />
                  </div>
                  <p className="ml-3 text-text-secondary">
                    <span className="font-medium text-text-primary">Real-time editing</span> - Multiple team members can
                    work on the same document simultaneously.
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-success bg-opacity-20 flex items-center justify-center mt-1">
                    <FiCheckCircle className="text-success text-sm" />
                  </div>
                  <p className="ml-3 text-text-secondary">
                    <span className="font-medium text-text-primary">Instant feedback</span> - Comment on files, code,
                    and designs to provide feedback quickly.
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-success bg-opacity-20 flex items-center justify-center mt-1">
                    <FiCheckCircle className="text-success text-sm" />
                  </div>
                  <p className="ml-3 text-text-secondary">
                    <span className="font-medium text-text-primary">Approval workflows</span> - Set up approval
                    processes for files and changes.
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-success bg-opacity-20 flex items-center justify-center mt-1">
                    <FiCheckCircle className="text-success text-sm" />
                  </div>
                  <p className="ml-3 text-text-secondary">
                    <span className="font-medium text-text-primary">Voice and video calls</span> - Jump on a call with
                    your team directly from the platform.
                  </p>
                </li>
              </ul>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-purple-500 rounded-lg opacity-10 blur-xl"></div>
              <div className="relative rounded-lg border border-border overflow-hidden shadow-xl transform transition-transform duration-500 hover:scale-[1.02]">
                <img src="/placeholder.svg?height=400&width=600" alt="Collaboration Features" className="w-full" />
              </div>

              {/* Animated elements */}
              <div className="absolute top-1/4 -left-4 w-20 h-20 rounded-full bg-gradient-to-r from-accent to-purple-500 opacity-20 animate-blob"></div>
              <div className="absolute bottom-1/3 -right-4 w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-blue-500 opacity-20 animate-blob animation-delay-2000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" ref={testimonialsRef} data-section="testimonials" className="section">
        <div
          className={`transition-all duration-1000 transform ${isVisible.testimonials ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="text-center mb-16">
            <h2 className="section-title">What Our Users Say</h2>
            <p className="section-subtitle">Teams of all sizes use TeamCollab to collaborate and get work done.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              name="Sarah Johnson"
              role="Product Manager at Acme Inc."
              testimonial="TeamCollab has transformed how our team works together. The real-time collaboration features have made our workflow so much more efficient."
              rating={5}
            />

            <TestimonialCard
              name="Michael Chen"
              role="Lead Developer at TechCorp"
              testimonial="The Git integration is a game-changer. Being able to manage code reviews and pull requests directly in the platform saves us so much time."
              rating={5}
            />

            <TestimonialCard
              name="Emily Rodriguez"
              role="Design Lead at CreativeStudio"
              testimonial="As a design team, we love how easy it is to share and get feedback on our work. The approval workflows have streamlined our review process."
              rating={4}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} data-section="cta" className="section">
        <div
          className={`transition-all duration-1000 transform ${isVisible.cta ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="bg-bg-secondary rounded-2xl border border-border p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-purple-500 opacity-5"></div>
            <div className="relative z-10">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to transform how your team works?</h2>
                <p className="text-xl text-text-secondary mb-8">
                  Join thousands of teams that use TeamCollab to collaborate and get work done.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link to="/signup" className="btn-primary flex items-center justify-center">
                    Get started for free
                    <FiArrowRight className="ml-2" />
                  </Link>
                  <Link to="#" className="btn-outline">
                    Contact sales
                  </Link>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-accent opacity-10 rounded-br-full"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500 opacity-10 rounded-tl-full"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Landing