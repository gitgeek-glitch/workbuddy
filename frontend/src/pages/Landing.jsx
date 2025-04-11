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
  FiX,
  FiZap,
  FiLock,
  FiGlobe,
  FiCpu
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
    stats: false,
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)

  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const collaborationRef = useRef(null)
  const testimonialsRef = useRef(null)
  const ctaRef = useRef(null)
  const statsRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
    if (statsRef.current) observer.observe(statsRef.current)

    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current)
      if (featuresRef.current) observer.unobserve(featuresRef.current)
      if (collaborationRef.current) observer.unobserve(collaborationRef.current)
      if (testimonialsRef.current) observer.unobserve(testimonialsRef.current)
      if (ctaRef.current) observer.unobserve(ctaRef.current)
      if (statsRef.current) observer.unobserve(statsRef.current)
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
        {/* Decorative elements */}
        <div className="absolute top-20 -left-20 w-72 h-72 bg-blue-500 opacity-10 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute -bottom-32 -right-20 w-72 h-72 bg-purple-500 opacity-10 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500 opacity-5 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="particle-container">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="absolute rounded-full bg-accent opacity-20"
                style={{
                  width: `${Math.random() * 10 + 2}px`,
                  height: `${Math.random() * 10 + 2}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              ></div>
            ))}
          </div>
        </div>
        
        <Hero
          title="Collaborate, Create, Conquer"
          subtitle="A powerful platform for teams to collaborate on projects, share files, and communicate in real-time."
          primaryButtonText="Get started for free"
          primaryButtonLink="/signup"
          secondaryButtonText="Learn more"
          secondaryButtonLink="#features"
          image="/placeholder.svg?height=600&width=1200"
          imageAlt="TeamCollab Dashboard"
          showFloatingElements={true}
        />
      </div>

      {/* Stats Section */}
      <section 
        ref={statsRef}
        data-section="stats"
        className="py-16 relative bg-bg-secondary border-y border-border"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
        <div 
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 transform ${
            isVisible.stats ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2 gradient-text">10k+</div>
              <p className="text-text-secondary">Active Users</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2 gradient-text">50k+</div>
              <p className="text-text-secondary">Projects Created</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2 gradient-text">99.9%</div>
              <p className="text-text-secondary">Uptime</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2 gradient-text">24/7</div>
              <p className="text-text-secondary">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} data-section="features" className="py-24 relative">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-grid-pattern bg-bg-primary opacity-5 pointer-events-none"></div>
        
        <div
          className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 transform ${isVisible.features ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-bg-secondary border border-border text-sm font-medium">
              <span className="mr-2 text-accent">✨</span>
              <span>Powerful Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">Everything You Need</h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Streamline your workflow with our comprehensive suite of tools designed for modern teams.
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
              icon={<FiZap className="text-white text-2xl" />}
              title="Automation"
              description="Automate repetitive tasks and workflows. Set up triggers and actions to streamline your processes."
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
              <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-bg-primary border border-border text-sm font-medium">
                <span className="mr-2 text-accent">🚀</span>
                <span>Seamless Collaboration</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold mb-8 gradient-text">Work Together, Anywhere</h2>
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
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-20 blur-2xl transform rotate-3"></div>
              <div className="relative rounded-2xl border border-border/50 overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-white/20">
                <img src="/placeholder.svg?height=400&width=600" alt="Collaboration Features" className="w-full" />
                
                {/* Glassmorphism overlay */}
                <div className="absolute bottom-0 left-0 right-0 glassmorphism p-6 border-t border-border/20">
                  <h3 className="text-xl font-semibold mb-2">Collaboration in action</h3>
                  <p className="text-text-secondary">Watch how teams collaborate in real-time on TeamCollab</p>
                  
                  {/* Play button */}
                  <div className="absolute right-6 bottom-6 w-12 h-12 rounded-full bg-accent flex items-center justify-center cursor-pointer hover:bg-opacity-80 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Animated elements */}
              <div className="absolute top-1/4 -left-4 w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 animate-blob"></div>
              <div className="absolute bottom-1/3 -right-4 w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-blue-500 opacity-20 animate-blob animation-delay-2000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-grid-pattern bg-bg-primary opacity-5 pointer-events-none"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-bg-secondary border border-border text-sm font-medium">
                <span className="mr-2 text-accent">🔒</span>
                <span>Enterprise-Grade Security</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold mb-8 gradient-text">Your Data, Protected</h2>
              <p className="text-xl text-text-secondary mb-8">
                Security is our top priority. We use industry-leading encryption and security practices to keep your data safe.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-bg-secondary p-6 rounded-xl border border-border">
                  <div className="w-12 h-12 rounded-xl bg-bg-primary flex items-center justify-center mb-4">
                    <FiLock className="text-accent text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">End-to-End Encryption</h3>
                  <p className="text-text-secondary">Your data is encrypted in transit and at rest.</p>
                </div>
                
                <div className="bg-bg-secondary p-6 rounded-xl border border-border">
                  <div className="w-12 h-12 rounded-xl bg-bg-primary flex items-center justify-center mb-4">
                    <FiGlobe className="text-accent text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Global Compliance</h3>
                  <p className="text-text-secondary">GDPR, HIPAA, and SOC 2 compliant.</p>
                </div>
                
                <div className="bg-bg-secondary p-6 rounded-xl border border-border">
                  <div className="w-12 h-12 rounded-xl bg-bg-primary flex items-center justify-center mb-4">
                    <FiUsers className="text-accent text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
                  <p className="text-text-secondary">Fine-grained control over who can access what.</p>
                </div>
                
                <div className="bg-bg-secondary p-6 rounded-xl border border-border">
                  <div className="w-12 h-12 rounded-xl bg-bg-primary flex items-center justify-center mb-4">
                    <FiCpu className="text-accent text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">AI-Powered Threat Detection</h3>
                  <p className="text-text-secondary">Proactive monitoring for suspicious activities.</p>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative mt-12 lg:mt-0">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-20 blur-2xl transform -rotate-3"></div>
              <div className="gradient-border p-1">
                <div className="bg-bg-primary rounded-xl overflow-hidden">
                  <img src="/placeholder.svg?height=400&width=600" alt="Security Features" className="w-full" />
                </div>
              </div>
              
              {/* Floating security badges */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-bg-secondary rounded-xl border border-border p-4 flex items-center justify-center shadow-lg transform rotate-6">
                <img src="/placeholder.svg?height=60&width=60" alt="Security Badge" className="w-full" />
              </div>
              
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-bg-secondary rounded-xl border border-border p-4 flex items-center justify-center shadow-lg transform -rotate-6">
                <img src="/placeholder.svg?height=60&width=60" alt="Security Badge" className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" ref={testimonialsRef} data-section="testimonials" className="py-24 relative bg-bg-secondary">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
        
        <div
          className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 transform ${isVisible.testimonials ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-bg-primary border border-border text-sm font-medium">
              <span className="mr-2 text-accent">💬</span>
              <span>Testimonials</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">What Our Users Say</h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Teams of all sizes use TeamCollab to collaborate and get work done.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Sarah Johnson"
              role="Product Manager at Acme Inc."
              testimonial="TeamCollab has transformed how our team works together. The real-time collaboration features have made our workflow so much more efficient."
              rating={5}
              avatarUrl="/placeholder.svg?height=48&width=48"
            />

            <TestimonialCard
              name="Michael Chen"
              role="Lead Developer at TechCorp"
              testimonial="The Git integration is a game-changer. Being able to manage code reviews and pull requests directly in the platform saves us so much time."
              rating={5}
              avatarUrl="/placeholder.svg?height=48&width=48"
            />

            <TestimonialCard
              name="Emily Rodriguez"
              role="Design Lead at CreativeStudio"
              testimonial="As a design team, we love how easy it is to share and get feedback on our work. The approval workflows have streamlined our review process."
              rating={4}
              avatarUrl="/placeholder.svg?height=48&width=48"
            />
          </div>
          
          {/* Testimonial logos */}
          <div className="mt-20">
            <p className="text-center text-text-secondary mb-8">Trusted by innovative companies worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="opacity-60 hover:opacity-100 transition-opacity">
                  <img src={`/placeholder.svg?height=30&width=120&text=LOGO ${i}`} alt={`Company ${i} logo`} className="h-8" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} data-section="cta" className="py-24">
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 transform ${isVisible.cta ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="glassmorphism rounded-3xl p-8 md:p-16 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 opacity-10 rounded-full filter blur-3xl"></div>
            
            <div className="relative">
              <div className="text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-bg-primary border border-border text-sm font-medium">
                  <span className="mr-2 text-accent">🚀</span>
                  <span>Get Started Today</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold mb-6 gradient-text">Ready to transform how your team works?</h2>
                <p className="text-xl text-text-secondary mb-10">
                  Join thousands of teams that use TeamCollab to collaborate and get work done.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <Link 
                    to="/signup" 
                    className="relative overflow-hidden px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium text-lg transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 flex items-center justify-center group"
                  >
                    <span className="relative z-10">Get started for free</span>
                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></span>
                  </Link>
                  <Link 
                    to="#" 
                    className="px-8 py-4 rounded-full border border-border hover:border-accent text-text-primary font-medium text-lg transition-all duration-300 flex items-center justify-center"
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
