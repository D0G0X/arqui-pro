import '../../styles/SearchBar.css'

interface SearchBarProps {
  onSearch: () => void
  filters: {
    especialidad: string
    rating: string
    setEspecialidad: (value: string) => void
    setRating: (value: string) => void
  }
}

function SearchBar({ onSearch, filters }: SearchBarProps) {
  const { especialidad, rating, setEspecialidad, setRating } = filters

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search by name, specialty, or location..."
          className="search-input"
        />
      </div>

      <div className="filters-container">
        <label className="filter-label">Filters:</label>
        
        <select
          value={especialidad}
          onChange={(e) => setEspecialidad(e.target.value)}
          className="filter-select"
        >
          <option value="Specialty">Specialty</option>
          <option value="Arquitectura Residencial">Arquitectura Residencial</option>
          <option value="Diseño Sostenible">Diseño Sostenible</option>
          <option value="Comercial">Comercial</option>
          <option value="Diseño de Interiores">Diseño de Interiores</option>
          <option value="Restauración">Restauración</option>
          <option value="Arquitectura Industrial">Arquitectura Industrial</option>
          <option value="Diseño Urbano">Diseño Urbano</option>
          <option value="Arquitectura Sostenible">Arquitectura Sostenible</option>
        </select>

        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="filter-select"
        >
          <option value="Rating">Rating</option>
          <option value="20">20+ ⭐</option>
          <option value="15">15+ ⭐</option>
          <option value="10">10+ ⭐</option>
          <option value="5">5+ ⭐</option>
          <option value="0">All Ratings</option>
        </select>

        <button onClick={onSearch} className="apply-btn">
          Apply
        </button>
      </div>
    </div>
  )
}

export default SearchBar
