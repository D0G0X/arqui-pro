import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ROUTES } from '../config/constants'
import valoracionesService from '../services/api/valoracionesService'
import proyectosService from '../services/api/proyectosService'
import type { Valoracion } from '../types/valoracion.types'
import type { Proyecto } from '../types/proyecto.types'
import '../styles/Home.css'

function Home() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [valoraciones, setValoraciones] = useState<Valoracion[]>([])
  const [proyectosContratados, setProyectosContratados] = useState<Proyecto[]>([])
  const [loadingValoraciones, setLoadingValoraciones] = useState(true)
  const [loadingProyectos, setLoadingProyectos] = useState(true)

  // Redirección automática si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('👤 Usuario autenticado detectado en Home, redirigiendo...', user.rol);
      
      if (user.rol === 'moderador') {
        navigate("/moderador/dashboard", { replace: true });
      } else if (user.rol === "cliente") {
        navigate("/cliente/home", { replace: true });
      } else if (user.rol === "arquitecto") {
        navigate("/arquitecto/profile", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Cargar valoraciones
  useEffect(() => {
    const cargarValoraciones = async () => {
      try {
        setLoadingValoraciones(true)
        const data = await valoracionesService.getAll()
        // Mostrar solo las últimas 6 valoraciones
        setValoraciones(data.slice(0, 6))
      } catch (error) {
        console.error('Error al cargar valoraciones:', error)
      } finally {
        setLoadingValoraciones(false)
      }
    }
    cargarValoraciones()
  }, [])

  // Cargar proyectos contratados
  useEffect(() => {
    const cargarProyectosContratados = async () => {
      try {
        setLoadingProyectos(true)
        // Usar método público para el home landing
        const data = await proyectosService.getAll(undefined, true)
        // Filtrar solo proyectos tipo 'contratado' y mostrar los últimos 6
        const contratados = data
          .filter((p: Proyecto) => p.tipo_proyecto === 'contratado')
          .slice(0, 6)
        setProyectosContratados(contratados)
      } catch (error) {
        console.error('Error al cargar proyectos contratados:', error)
      } finally {
        setLoadingProyectos(false)
      }
    }
    cargarProyectosContratados()
  }, [])

  const handleSearch = () => {
    navigate(ROUTES.ARCHITECTS)
  }

  const renderStars = (calificacion: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= calificacion ? 'star-filled' : 'star-empty'}>
          ★
        </span>
      )
    }
    return stars
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
                className="home-btn-primary"
                aria-label="Comenzar - Registrarse como cliente"
              >
                Get Started
              </button>
              <button 
                onClick={() => navigate(ROUTES.ARCHITECTS)} 
                className="home-btn-secondary"
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

        {/* Valoraciones Section */}
        <section className="valoraciones-section">
          <h2 className="section-title-large">Valoraciones Recientes</h2>
          <p className="section-subtitle-large">
            Descubre lo que nuestros clientes dicen sobre sus proyectos.
          </p>
          
          {loadingValoraciones ? (
            <div className="loading-message">Cargando valoraciones...</div>
          ) : valoraciones.length > 0 ? (
            <div className="valoraciones-grid">
              {valoraciones.map((valoracion) => (
                <div key={valoracion.id} className="valoracion-card">
                  <div className="valoracion-header">
                    <div className="valoracion-stars">
                      {renderStars(valoracion.calificacion)}
                    </div>
                    <div className="valoracion-rating">{valoracion.calificacion}/5</div>
                  </div>
                  <p className="valoracion-text">
                    "{valoracion.comentario}"
                  </p>
                  <div className="valoracion-footer">
                    <div className="valoracion-author">
                      {valoracion.cliente?.usuario 
                        ? `${valoracion.cliente.usuario.nombre} ${valoracion.cliente.usuario.apellido}`
                        : 'Cliente'
                      }
                    </div>
                    {valoracion.proyecto && (
                      <div className="valoracion-project">
                        Proyecto: {valoracion.proyecto.titulo_proyecto}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-message">No hay valoraciones disponibles</div>
          )}
        </section>

        {/* Proyectos Contratados Section */}
        <section className="proyectos-section">
          <h2 className="section-title-large">Proyectos Contratados</h2>
          <p className="section-subtitle-large">
            Explora algunos de los proyectos que se están desarrollando en nuestra plataforma.
          </p>
          
          {loadingProyectos ? (
            <div className="loading-message">Cargando proyectos...</div>
          ) : proyectosContratados.length > 0 ? (
            <div className="proyectos-grid">
              {proyectosContratados.map((proyecto) => (
                <div key={proyecto.id} className="proyecto-card">
                  {proyecto.imagenes && proyecto.imagenes.length > 0 ? (
                    <div 
                      className="proyecto-image"
                      style={{ backgroundImage: `url(${proyecto.imagenes[0].imagen_url})` }}
                    />
                  ) : (
                    <div className="proyecto-image proyecto-image-placeholder">
                      <span>🏗️</span>
                    </div>
                  )}
                  <div className="proyecto-content">
                    <h3 className="proyecto-title">{proyecto.titulo_proyecto}</h3>
                    <p className="proyecto-description">
                      {proyecto.descripcion.length > 150 
                        ? `${proyecto.descripcion.substring(0, 150)}...` 
                        : proyecto.descripcion
                      }
                    </p>
                    <div className="proyecto-footer">
                      {proyecto.arquitecto?.usuario && (
                        <div className="proyecto-architect">
                          Arquitecto: {proyecto.arquitecto.usuario.nombre} {proyecto.arquitecto.usuario.apellido}
                        </div>
                      )}
                      {proyecto.valoracion_promedio > 0 && (
                        <div className="proyecto-rating">
                          ⭐ {proyecto.valoracion_promedio.toFixed(1)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-message">No hay proyectos contratados disponibles</div>
          )}
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
