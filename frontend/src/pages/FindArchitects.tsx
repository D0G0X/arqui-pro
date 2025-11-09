import ArquitectoSimpleCard from '../components/common/ArquitectoSimpleCard'
import SearchBar from '../components/common/SearchBar'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import { useBuscarArquitectos } from '../services/graphql/arquitectosGraphQL'
import { useArchitectFilters } from '../hooks/useArchitectFilters'
import '../styles/FindArchitects.css'

function FindArchitects() {
  // Usar el hook de filtros para gestionar la lógica de filtrado
  const {
    filters,
    variables,
    setEspecialidad,
    setRating,
    resetFilters,
    hasActiveFilters,
  } = useArchitectFilters()

  // Usar GraphQL para obtener arquitectos
  const { data, loading, error, refetch } = useBuscarArquitectos(variables)

  const handleSearch = () => {
    refetch()
  }

  const handleResetFilters = () => {
    resetFilters()
    // El refetch usará automáticamente las variables reseteadas
    setTimeout(() => refetch(), 0)
  }

  const arquitectos = data?.buscarArquitectos || []

  return (
    <div className="find-architects-container">
      <main className="main-content">
        <section className="hero-section">
          <h1 className="hero-title">Find Your Perfect Architect</h1>
          <p className="hero-subtitle">
            Browse our verified professionals and discover the ideal architect for your project.
          </p>
          
          <SearchBar
            onSearch={handleSearch}
            filters={{
              especialidad: filters.especialidad,
              rating: filters.rating,
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
            <div className="no-results-icon" aria-hidden="true">🔍</div>
            <h2>No architects found</h2>
            <p>Try adjusting your filters or search criteria.</p>
            {hasActiveFilters && (
              <button 
                onClick={handleResetFilters} 
                className="reset-btn"
                aria-label="Reset all filters"
              >
                Reset Filters
              </button>
            )}
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
    </div>
  )
}

export default FindArchitects
