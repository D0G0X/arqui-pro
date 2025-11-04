import { memo, useCallback } from 'react'
import { ESPECIALIDADES, RATINGS } from '../../config/constants'
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

const SearchBar = memo(function SearchBar({ onSearch, filters }: SearchBarProps) {
  const { especialidad, rating, setEspecialidad, setRating } = filters

  const handleEspecialidadChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setEspecialidad(e.target.value)
  }, [setEspecialidad])

  const handleRatingChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRating(e.target.value)
  }, [setRating])

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          type="text"
          placeholder="Search by name, specialty, or location..."
          className="search-input"
          aria-label="Search architects"
        />
      </div>

      <div className="filters-container">
        <label className="filter-label" htmlFor="especialidad-filter">
          Filters:
        </label>
        
        <select
          id="especialidad-filter"
          value={especialidad}
          onChange={handleEspecialidadChange}
          className="filter-select"
          aria-label="Filter by specialty"
        >
          {ESPECIALIDADES.map((esp) => (
            <option key={esp.value} value={esp.value}>
              {esp.label}
            </option>
          ))}
        </select>

        <select
          id="rating-filter"
          value={rating}
          onChange={handleRatingChange}
          className="filter-select"
          aria-label="Filter by rating"
        >
          {RATINGS.map((rat) => (
            <option key={rat.value} value={rat.value}>
              {rat.label}
            </option>
          ))}
        </select>

        <button 
          onClick={onSearch} 
          className="apply-btn"
          aria-label="Apply filters"
        >
          Apply
        </button>
      </div>
    </div>
  )
})

export default SearchBar
