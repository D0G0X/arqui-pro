import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import '../styles/AboutUs.css'

function AboutUs() {
  return (
    <div className="about-container">
      <Header />
      
      <main className="about-content">
        <section className="about-hero">
          <h1 className="about-title">About ArquiPro</h1>
          <p className="about-subtitle">
            Connecting visionary architects with ambitious clients
          </p>
        </section>

        <section className="about-sections">
          <div className="about-card">
            <div className="card-icon">🏛️</div>
            <h2>Our Mission</h2>
            <p>
              ArquiPro is a professional platform designed to bridge the gap between talented 
              architects and clients seeking exceptional design solutions. We provide a trusted 
              space where creativity meets opportunity, enabling architects to showcase their 
              portfolios and clients to discover the perfect professional for their projects.
            </p>
          </div>

          <div className="about-card">
            <div className="card-icon">✨</div>
            <h2>What We Offer</h2>
            <ul className="features-list">
              <li><strong>Verified Professionals:</strong> All architects undergo a verification process to ensure credibility and expertise.</li>
              <li><strong>Portfolio Showcase:</strong> Architects can display their completed projects with detailed descriptions and images.</li>
              <li><strong>Real-time Communication:</strong> Built-in messaging system for seamless client-architect collaboration.</li>
              <li><strong>Project Management:</strong> Track project progress with milestones and updates.</li>
              <li><strong>Rating System:</strong> Transparent reviews and ratings from previous clients.</li>
            </ul>
          </div>

          <div className="about-card">
            <div className="card-icon">🎯</div>
            <h2>How It Works</h2>
            <div className="steps">
              <div className="step">
                <span className="step-number">1</span>
                <div className="step-content">
                  <h3>Search & Filter</h3>
                  <p>Browse architects by specialty, location, and ratings.</p>
                </div>
              </div>
              <div className="step">
                <span className="step-number">2</span>
                <div className="step-content">
                  <h3>Review Portfolios</h3>
                  <p>Explore past projects and read client testimonials.</p>
                </div>
              </div>
              <div className="step">
                <span className="step-number">3</span>
                <div className="step-content">
                  <h3>Connect & Collaborate</h3>
                  <p>Send project requests and communicate directly with architects.</p>
                </div>
              </div>
              <div className="step">
                <span className="step-number">4</span>
                <div className="step-content">
                  <h3>Build Together</h3>
                  <p>Work together to bring your architectural vision to life.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-card">
            <div className="card-icon">🌟</div>
            <h2>Why Choose ArquiPro?</h2>
            <div className="benefits-grid">
              <div className="benefit">
                <strong>🔒 Secure Platform</strong>
                <p>Your data and communications are protected with industry-standard security.</p>
              </div>
              <div className="benefit">
                <strong>📊 Transparent Pricing</strong>
                <p>No hidden fees. Clear project proposals and budget discussions.</p>
              </div>
              <div className="benefit">
                <strong>⚡ Fast Response</strong>
                <p>Real-time notifications keep you updated on project developments.</p>
              </div>
              <div className="benefit">
                <strong>🏆 Quality Assurance</strong>
                <p>Only verified professionals with proven track records.</p>
              </div>
            </div>
          </div>

          <div className="about-card cta-card">
            <h2>Ready to Start Your Project?</h2>
            <p>Join thousands of satisfied clients who found their perfect architect on ArquiPro.</p>
            <div className="cta-buttons">
              <button className="btn-primary" onClick={() => window.location.href = '/architects'}>
                Find Architects
              </button>
              <button className="btn-secondary" onClick={() => window.location.href = '/register'}>
                Register as Architect
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default AboutUs
