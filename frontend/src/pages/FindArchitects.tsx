import { useState } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import ArquitectoSimpleCard from '../components/common/ArquitectoSimpleCard'
import SearchBar from '../components/common/SearchBar'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import { useBuscarArquitectos } from '../services/graphql/arquitectosGraphQL'
import '../styles/FindArchitects.css'

function FindArchitects() {
  // Estados para filtros
  const [especialidad, setEspecialidad] = useState<string>('Specialty')
  const [rating, setRating] = useState<string>('Rating')
  
  // Variables para GraphQL
  const [graphqlVariables, setGraphqlVariables] = useState<{
    especialidad?: string
    verificado?: boolean
    valoracionMinima?: number
    limite?: number
  }>({
    limite: 20
  })

  // Usar GraphQL para obtener arquitectos
  const { data, loading, error, refetch } = useBuscarArquitectos(graphqlVariables)

  const handleSearch = () => {
    const newVariables: typeof graphqlVariables = {
      limite: 20
    }

    if (especialidad !== 'Specialty') {
      newVariables.especialidad = especialidad
    }

    if (rating !== 'Rating' && rating !== '0') {
      const ratingValue = parseFloat(rating)
      newVariables.valoracionMinima = ratingValue
    }

    setGraphqlVariables(newVariables)
    refetch(newVariables)
  }

  const arquitectos = data?.buscarArquitectos || []

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
          <ErrorMessage 
            message="Error loading architects. Please try again later."
            onRetry={() => refetch()}
          />
        )}

        {loading ? (
          <LoadingSpinner message="Loading architects..." />
        ) : arquitectos.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h2>No architects found</h2>
            <p>Try adjusting your filters or search criteria.</p>
            <button onClick={() => {
              setEspecialidad('Specialty')
              setRating('Rating')
              setGraphqlVariables({ limite: 20 })
              refetch({ limite: 20 })
            }} className="reset-btn">
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <section className="results-header">
              <p className="results-count">
                Showing <strong>{arquitectos.length}</strong> verified architects
              </p>
            </section>

            <section className="arquitectos-section">
              <div className="arquitectos-grid">
                {arquitectos.map((arquitecto) => (
                  <ArquitectoSimpleCard
                    key={arquitecto.id}
                    id={arquitecto.id}
                    nombre={arquitecto.usuario.nombre}
                    apellido={arquitecto.usuario.apellido}
                    especialidades={arquitecto.especialidades}
                    valoracionPromedioProyecto={arquitecto.valoracionPromedioProyecto}
                    fotoPerfil={arquitecto.usuario.fotoPerfil}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default FindArchitects
