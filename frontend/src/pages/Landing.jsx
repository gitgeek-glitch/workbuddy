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
  FiMenu,
  FiX
} from "react-icons/fi"
import { useTheme } from "../context/ThemeContext"
import ThemeToggle from "../components/ui/ThemeToggle"
import Hero from "../components/ui/Hero"
import FeatureCard from "../components/ui/FeatureCard"
import TestimonialCard from "../components/ui/TestimonialCard"
import Footer from "../components/layout/Footer"
import Navbar from "@/components/layout/Navbar"

const Landing = () => {
  const { darkMode } = useTheme()
  const [isVisible, setIsVisible] = useState({
    hero: false,
    features: false,
    collaboration: false,
    testimonials: false,
    cta: false,
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-sans">
      {/* Navbar */}
      <Navbar/>

      {/* Hero Section */}
      <div
        ref={heroRef}
        data-section="hero"
        className={`pb-20 sm:pb-24 relative overflow-hidden transition-all duration-1000 transform ${isVisible.hero ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
      >
        {/* Decorative gradient blobs */}
        <div className="absolute top-20 -left-20 w-72 h-72 bg-white opacity-10 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute -bottom-32 -right-20 w-72 h-72 bg-purple-500 opacity-10 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 opacity-5 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
        
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
      <section id="features" ref={featuresRef} data-section="features" className="py-24 relative">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-grid-pattern bg-bg-primary opacity-5 pointer-events-none"></div>
        
        <div
          className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 transform ${isVisible.features ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-purple-500 bg-clip-text text-transparent">Powerful Features</h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Everything you need to manage your projects and collaborate with your team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FiFileText className="text-white text-2xl" />}
              title="File Management"
              description="Upload, organize, and share files with your team. Track versions and collaborate on documents in real-time."
            />

            <FeatureCard
              icon={<FiMessageSquare className="text-white text-2xl" />}
              title="Real-time Chat"
              description="Communicate with your team in real-time. Create channels for different topics and share files directly in the chat."
            />

            <FeatureCard
              icon={<FiUsers className="text-white text-2xl" />}
              title="Team Management"
              description="Invite team members, assign roles, and manage permissions. Keep track of who's working on what."
            />

            <FeatureCard
              icon={<FiCheckCircle className="text-white text-2xl" />}
              title="Task Management"
              description="Create tasks, assign them to team members, and track progress. Set deadlines and priorities."
            />

            <FeatureCard
              icon={<FiGithub className="text-white text-2xl" />}
              title="Git Integration"
              description="Connect your GitHub repositories and manage pull requests, code reviews, and issues directly from the platform."
            />

            <FeatureCard
              icon={<FiStar className="text-white text-2xl" />}
              title="Customization"
              description="Customize the platform to fit your team's needs. Create custom workflows, fields, and views."
            />
          </div>
        </div>
      </section>

      {/* Collaboration Section */}
      <section id="collaboration" ref={collaborationRef} data-section="collaboration" className="py-24 bg-bg-secondary relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg-primary/20 pointer-events-none"></div>
        
        <div
          className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 transform ${isVisible.collaboration ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl sm:text-5xl font-bold mb-8 bg-gradient-to-r from-white to-purple-500 bg-clip-text text-transparent">Seamless Collaboration</h2>
              <p className="text-xl text-text-secondary mb-8">
                TeamCollab brings your team together, no matter where they are. Work on projects, share ideas, and make
                decisions together in real-time.
              </p>

              <ul className="space-y-6">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-success bg-opacity-20 flex items-center justify-center mt-1">
                    <FiCheckCircle className="text-success text-lg" />
                  </div>
                  <p className="ml-4 text-lg text-text-secondary">
                    <span className="font-semibold text-text-primary">Real-time editing</span> - Multiple team members can
                    work on the same document simultaneously.
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-success bg-opacity-20 flex items-center justify-center mt-1">
                    <FiCheckCircle className="text-success text-lg" />
                  </div>
                  <p className="ml-4 text-lg text-text-secondary">
                    <span className="font-semibold text-text-primary">Instant feedback</span> - Comment on files, code,
                    and designs to provide feedback quickly.
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-success bg-opacity-20 flex items-center justify-center mt-1">
                    <FiCheckCircle className="text-success text-lg" />
                  </div>
                  <p className="ml-4 text-lg text-text-secondary">
                    <span className="font-semibold text-text-primary">Approval workflows</span> - Set up approval
                    processes for files and changes.
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-success bg-opacity-20 flex items-center justify-center mt-1">
                    <FiCheckCircle className="text-success text-lg" />
                  </div>
                  <p className="ml-4 text-lg text-text-secondary">
                    <span className="font-semibold text-text-primary">Voice and video calls</span> - Jump on a call with
                    your team directly from the platform.
                  </p>
                </li>
              </ul>
            </div>

            <div className="lg:w-1/2 relative mt-12 lg:mt-0">
              <div className="absolute inset-0 bg-gradient-to-r from-white to-purple-500 rounded-2xl opacity-20 blur-2xl transform rotate-3"></div>
              <div className="relative rounded-2xl border border-border/50 overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-white/20">
                <img src="/placeholder.svg?height=400&width=600" alt="Collaboration Features" className="w-full" />
                
                {/* Glassmorphism overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-bg-primary/80 backdrop-blur-md p-6 border-t border-border/20">
                  <h3 className="text-xl font-semibold mb-2">Collaboration in action</h3>
                  <p className="text-text-secondary">Watch how teams collaborate in real-time on TeamCollab</p>
                </div>
              </div>

              {/* Animated elements */}
              <div className="absolute top-1/4 -left-4 w-20 h-20 rounded-full bg-gradient-to-r from-white to-purple-500 opacity-20 animate-blob"></div>
              <div className="absolute bottom-1/3 -right-4 w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-blue-500 opacity-20 animate-blob animation-delay-2000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" ref={testimonialsRef} data-section="testimonials" className="py-24 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
        
        <div
          className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 transform ${isVisible.testimonials ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-purple-500 bg-clip-text text-transparent">What Our Users Say</h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Teams of all sizes use TeamCollab to collaborate and get work done.
            </p>
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
      <section ref={ctaRef} data-section="cta" className="py-24">
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 transform ${isVisible.cta ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="bg-bg-secondary rounded-3xl border border-border/50 p-8 md:p-16 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-purple-500/5"></div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 opacity-10 rounded-full filter blur-3xl"></div>
            
            <div className="relative">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-purple-500 bg-clip-text text-transparent">Ready to transform how your team works?</h2>
                <p className="text-xl text-text-secondary mb-10">
                  Join thousands of teams that use TeamCollab to collaborate and get work done.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <Link 
                    to="/signup" 
                    className="relative overflow-hidden px-8 py-4 rounded-full bg-gradient-to-r from-white to-purple-500 text-white font-medium text-lg transition-all duration-300 hover:shadow-lg hover:shadow-white/20 flex items-center justify-center group"
                  >
                    <span className="relative">Get started for free</span>
                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </Link>
                  <Link 
                    to="#" 
                    className="px-8 py-4 rounded-full border border-border hover:border-white text-text-primary font-medium text-lg transition-all duration-300 flex items-center justify-center"
                  >
                    Contact sales
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Landing