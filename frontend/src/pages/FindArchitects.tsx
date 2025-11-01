import { useState, useEffect } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import ArquitectoCard from '../components/common/ArquitectoCard'
import SearchBar from '../components/common/SearchBar'
import arquitectosService, { type ArquitectoFilters } from '../services/api/arquitectosService'
import type { Arquitecto } from '../types'
import '../styles/FindArchitects.css'

function FindArchitects() {
  const [arquitectos, setArquitectos] = useState<Arquitecto[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [filters, setFilters] = useState<ArquitectoFilters>({
    page: 1,
    per_page: 20,
  })

  // Estados para filtros
  const [especialidad, setEspecialidad] = useState<string>('Specialty')
  const [rating, setRating] = useState<string>('Rating')

  useEffect(() => {
    fetchArquitectos()
  }, [filters])

  const fetchArquitectos = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await arquitectosService.getAll(filters)
      
      setArquitectos(response.arquitectos)
      if (response.meta) {
        setCurrentPage(response.meta.current_page)
        setTotalPages(response.meta.total_pages)
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar arquitectos')
      console.error('Error fetching arquitectos:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    const newFilters: ArquitectoFilters = {
      page: 1,
      per_page: 20,
    }

    if (especialidad !== 'Specialty') {
      newFilters.especialidad = especialidad
    }

    if (rating !== 'Rating' && rating !== '0') {
      const ratingValue = parseFloat(rating)
      newFilters.valoracion_minima = ratingValue
    }

    setFilters(newFilters)
  }

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderPagination = () => {
    const pages = []
    const maxVisible = 5

    // Primera página
    if (currentPage > 3) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="pagination-btn"
        >
          1
        </button>
      )
      if (currentPage > 4) {
        pages.push(<span key="dots-1" className="pagination-dots">...</span>)
      }
    }

    // Páginas alrededor de la actual
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
        >
          {i}
        </button>
      )
    }

    // Última página
    if (currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) {
        pages.push(<span key="dots-2" className="pagination-dots">...</span>)
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="pagination-btn"
        >
          {totalPages}
        </button>
      )
    }

    return pages
  }

  return (
    <div className="find-architects-container">
      <Header />
      
      <main className="main-content">
        <section className="hero-section">
          <h1 className="hero-title">Find Your Perfect Architect</h1>
          <p className="hero-subtitle">
            Browse our verified professionals and discover the ideal architect for your project.
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

        {error && (
          <div className="error-message">
            <p>⚠️ {error}</p>
            <button onClick={fetchArquitectos} className="retry-btn">
              Try Again
            </button>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading architects...</p>
          </div>
        ) : arquitectos.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h2>No architects found</h2>
            <p>Try adjusting your filters or search criteria.</p>
            <button onClick={() => {
              setEspecialidad('Specialty')
              setRating('Rating')
              setFilters({ page: 1, per_page: 20 })
            }} className="reset-btn">
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <section className="results-header">
              <p className="results-count">
                Showing <strong>{arquitectos.length}</strong> architects
                {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
              </p>
            </section>

            <section className="arquitectos-section">
              <div className="arquitectos-grid">
                {arquitectos.map((arquitecto) => (
                  <ArquitectoCard
                    key={arquitecto.id}
                    arquitecto={arquitecto}
                  />
                ))}
              </div>
            </section>

            {totalPages > 1 && (
              <section className="pagination-section">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  &lt;
                </button>
                {renderPagination()}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  &gt;
                </button>
              </section>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default FindArchitects
