import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/common/SearchBar'
import ArquitectoCard from '../components/common/ArquitectoCard'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import arquitectosService from '../services/api/arquitectosService'
import type { Arquitecto } from '../types'
import '../styles/Home.css'

function Home() {
  const navigate = useNavigate()
  const [arquitectos, setArquitectos] = useState<Arquitecto[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [especialidad, setEspecialidad] = useState<string>('Specialty')
  const [rating, setRating] = useState<string>('Rating')

  useEffect(() => {
    fetchTopArquitectos()
  }, [])

  const fetchTopArquitectos = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Fetching arquitectos from API...')
      const response = await arquitectosService.getAll({ 
        per_page: 10,
        verificado: true 
      })
      console.log('API Response:', response)
      setArquitectos(response.arquitectos || [])
    } catch (error: any) {
      console.error('Error fetching arquitectos:', error)
      setError(error.message || 'Error loading architects. Please check if the backend is running.')
      setArquitectos([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    // Redirigir a la página de búsqueda con filtros
    navigate('/architects')
  }

  return (
    <div className="home-container">
      <Header />
      
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <h1 className="hero-title">Find Your Perfect Architect</h1>
          <p className="hero-subtitle">
            Discover and connect with top-rated architects for your next project.
          </p>
          
          <SearchBar
            onSearch={handleSearch}
            filters={{
              especialidad,
              rating,
              setEspecialidad,
              setRating,
            }}
          />
        </section>

        {/* Featured Arquitectos */}
        <section className="arquitectos-section">
          <h2 className="section-title">Featured Architects</h2>
          
          {error && (
            <div className="error-message">
              <p>⚠️ {error}</p>
              <button onClick={fetchTopArquitectos} className="retry-btn">
                Try Again
              </button>
            </div>
          )}
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading architects...</p>
            </div>
          ) : !error && arquitectos && arquitectos.length > 0 ? (
            <div className="arquitectos-grid">
              {arquitectos.slice(0, 10).map((arquitecto) => (
                <ArquitectoCard
                  key={arquitecto.id}
                  arquitecto={arquitecto}
                />
              ))}
            </div>
          ) : !error ? (
            <div className="no-results">
              <p>No architects available at the moment.</p>
            </div>
          ) : null}

          <div className="view-all-container">
            <button onClick={() => navigate('/architects')} className="view-all-btn">
              View All Architects →
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Home
