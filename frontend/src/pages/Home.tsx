import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../config/constants'
import '../styles/Home.css'

function Home() {
  const navigate = useNavigate()

  const handleSearch = () => {
    navigate(ROUTES.ARCHITECTS)
  }

  return (
    <div className="home-container">
      <main className="main-content">
        {/* Hero Section with Background Image */}
        <section className="hero-banner">
          <div className="hero-overlay">
            <h1 className="hero-main-title">Bring Your Architectural Vision to Life</h1>
            <p className="hero-main-subtitle">
              ArquiPro seamlessly connects clients with professional architects to create extraordinary spaces.
            </p>
            <div className="hero-buttons">
              <button 
                onClick={() => navigate(ROUTES.REGISTER_CLIENTE)} 
                className="btn-primary"
                aria-label="Comenzar - Registrarse como cliente"
              >
                Get Started
              </button>
              <button 
                onClick={() => navigate(ROUTES.ARCHITECTS)} 
                className="btn-secondary"
                aria-label="Ver arquitectos disponibles"
              >
                Find Architects
              </button>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="search-section">
          <h2 className="search-title">Find the Perfect Architect for Your Project</h2>
          <p className="search-subtitle">Start your search below to discover talented professionals.</p>
          
          <div className="search-box">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              type="text"
              placeholder="Search by location, project type, or specialty"
              className="search-input-main"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
              aria-label="Buscar arquitectos por ubicación, tipo de proyecto o especialidad"
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="features-title">Everything You Need to Collaborate and Create</h2>
          <p className="features-subtitle">
            Discover a suite of tools designed to make your architectural journey smoother from start to finish.
          </p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Advanced Search</h3>
              <p>Filter architects by specialty, location, and project type to find the perfect match.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📁</div>
              <h3>Project Portfolios</h3>
              <p>Browse stunning portfolios to see the quality and style of each architect's work.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Direct Messaging</h3>
              <p>Communicate directly and securely with architects right on our platform.</p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works-section">
          <h2 className="section-title-large">How It Works</h2>
          <p className="section-subtitle-large">
            A simple, streamlined process to bring your project to life.
          </p>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-icon">🔍</div>
              <h3>1. Search & Discover</h3>
              <p>Browse profiles, check reviews to find the right architect for your vision and budget.</p>
            </div>
            <div className="step-card">
              <div className="step-icon">🤝</div>
              <h3>2. Connect & Collaborate</h3>
              <p>Use our secure messaging to discuss your project, share files, and align on the details.</p>
            </div>
            <div className="step-card">
              <div className="step-icon">🏗️</div>
              <h3>3. Build Your Dream</h3>
              <p>Once you've hired your architect, begin the exciting journey of turning your ideas into reality.</p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section">
          <h2 className="section-title-large">Trusted by Clients and Architects Alike</h2>
          <p className="section-subtitle-large">
            See what our users are saying about their experience on ArquiPro.
          </p>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p className="testimonial-text">
                "ArquiPro made finding an architect for our dream home renovation an absolute breeze. 
                The platform is intuitive, and the quality of talent is exceptional. We couldn't be happier with the result."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">MF</div>
                <div className="author-info">
                  <h4>Michael Foster</h4>
                  <p>Homeowner & Client</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-text">
                "As an architect, this platform has been a game-changer for my practice. 
                It connects me with serious clients and provides the tools I need to manage projects efficiently from start to finish."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">SJ</div>
                <div className="author-info">
                  <h4>Sarah Jennings</h4>
                  <p>Principal Architect</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <h2 className="cta-title">Ready to Start Your Next Project?</h2>
          <p className="cta-subtitle">
            Join ArquiPro today and take the first step towards creating your perfect space. 
            Find an architect or find your next client.
          </p>
          <div className="cta-buttons">
            <button 
              onClick={() => navigate(ROUTES.ARCHITECTS)} 
              className="btn-cta-primary"
              aria-label="Buscar tu arquitecto ideal"
            >
              Find Your Architect
            </button>
            <button 
              onClick={() => navigate(ROUTES.ARCHITECTS)} 
              className="btn-cta-secondary"
              aria-label="Registrarte como arquitecto"
            >
              Join as an Architect
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home
