import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_INCIDENCIAS } from '../../services/graphql/queries'
import moderadorService from '../../services/api/moderador/moderadorService'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import type { Incidencia } from '../../types/moderator.types'
import { usePagination } from '../../hooks/usePagination'
import { formatDateTime, getBadgeClass, getIncidenciaEstadoLabel, truncateText } from '../../utils/formatters'
import { logger } from '../../utils/logger'
import { INCIDENCIA_ESTADOS_OPTIONS } from '../../config/constants'
import '../../styles/Moderator/Incidencias.css'

interface IncidenciasResponse {
  incidencias: Incidencia[]
}

export const Incidencias = () => {
  const { user } = useAuth()
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [verDetalles, setVerDetalles] = useState<number | null>(null)
  const [procesando, setProcesando] = useState<number | null>(null)
  
  const { currentPage, limit, offset, nextPage, previousPage, canGoPrevious, canGoNext } = usePagination({
    limit: 10
  })

  const { data, loading, error, refetch } = useQuery<IncidenciasResponse>(
    GET_INCIDENCIAS,
    {
      variables: {
        estado: filtroEstado === 'todos' ? undefined : filtroEstado,
        limite: limit,
        offset: offset
      },
      fetchPolicy: 'network-only'
    }
  )

  const handleResolver = async (id: number) => {
    if (!user?.id) {
      alert('Error: No se pudo identificar al usuario')
      return
    }

    const resolucion = prompt('Escribe la resolución de la incidencia:')
    
    if (!resolucion || resolucion.trim() === '') {
      alert('Debes proporcionar una resolución')
      return
    }
    
    try {
      setProcesando(id)
      logger.info('Resolviendo incidencia', { id, moderador_id: user.id })
      
      await moderadorService.resolverIncidencia(id, {
        moderador_id: parseInt(user.id),
        resolucion: resolucion.trim()
      })
      
      alert('✅ Incidencia resuelta exitosamente')
      await refetch()
    } catch (error) {
      logger.error('Error al resolver incidencia', error)
      alert('❌ Error al resolver la incidencia. Intenta nuevamente.')
    } finally {
      setProcesando(null)
    }
  }

  const handleRechazar = async (id: number) => {
    if (!user?.id) {
      alert('Error: No se pudo identificar al usuario')
      return
    }

    const resolucion = prompt('Razón del rechazo:')
    
    if (!resolucion || resolucion.trim() === '') {
      alert('Debes proporcionar una razón para el rechazo')
      return
    }
    
    try {
      setProcesando(id)
      logger.info('Rechazando incidencia', { id, moderador_id: user.id })
      
      await moderadorService.rechazarIncidencia(id, {
        moderador_id: parseInt(user.id),
        resolucion: resolucion.trim()
      })
      
      alert('✅ Incidencia rechazada')
      await refetch()
    } catch (error) {
      logger.error('Error al rechazar incidencia', error)
      alert('❌ Error al rechazar la incidencia. Intenta nuevamente.')
    } finally {
      setProcesando(null)
    }
  }

  if (loading) {
    return (
      <div className="incidencias-loading">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="incidencias-error">
        <ErrorMessage
          message="Error al cargar las incidencias"
          onRetry={refetch}
        />
      </div>
    )
  }

  const incidencias = data?.incidencias || []

  return (
    <div className="incidencias">
      <div className="incidencias__header">
        <h1 className="incidencias__title">Gestión de Incidencias</h1>
        <p className="incidencias__subtitle">
          Administrar reportes e incidencias del sistema
        </p>
      </div>

      <div className="incidencias__filters">
        <div className="filter-group">
          <label htmlFor="estado-filter" className="filter-label">
            Filtrar por estado:
          </label>
          <select
            id="estado-filter"
            value={filtroEstado}
            onChange={(e) => {
              setFiltroEstado(e.target.value)
            }}
            className="filter-select"
            aria-label="Filtrar incidencias por estado"
          >
            {INCIDENCIA_ESTADOS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button 
          onClick={() => refetch()} 
          className="btn btn--secondary"
          aria-label="Actualizar lista de incidencias"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
          </svg>
          Actualizar
        </button>
      </div>

      {incidencias.length === 0 ? (
        <div className="incidencias__empty">
          <p>No hay incidencias para mostrar</p>
        </div>
      ) : (
        <>
          <div className="incidencias__table-container">
            <table className="incidencias__table">
              <thead>
                <tr>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th>Emisor</th>
                  <th>Infractor</th>
                  <th>Moderador</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {incidencias.map((incidencia) => (
                  <tr key={incidencia.id}>
                    <td>
                      <span className={getBadgeClass(incidencia.estado)}>
                        {getIncidenciaEstadoLabel(incidencia.estado)}
                      </span>
                    </td>
                    <td>{formatDateTime(incidencia.fechaCreacion)}</td>
                    <td>
                      <div className="descripcion-cell">
                        {verDetalles === incidencia.id ? (
                          <>
                            <p className="descripcion-full">
                              {incidencia.descripcion}
                            </p>
                            <button
                              onClick={() => setVerDetalles(null)}
                              className="btn-link"
                              aria-label="Ver menos descripción"
                            >
                              Ver menos
                            </button>
                          </>
                        ) : (
                          <>
                            <p className="descripcion-truncated">
                              {truncateText(incidencia.descripcion, 60)}
                            </p>
                            {incidencia.descripcion.length > 60 && (
                              <button
                                onClick={() => setVerDetalles(incidencia.id)}
                                className="btn-link"
                                aria-label="Ver más descripción"
                              >
                                Ver más
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                    <td>
                      {incidencia.emisor
                        ? `${incidencia.emisor.nombre} ${incidencia.emisor.apellido}`
                        : 'N/A'}
                    </td>
                    <td>
                      {incidencia.infractor
                        ? `${incidencia.infractor.nombre} ${incidencia.infractor.apellido}`
                        : 'N/A'}
                    </td>
                    <td>
                      {incidencia.moderador
                        ? `${incidencia.moderador.nombre} ${incidencia.moderador.apellido}`
                        : '-'}
                    </td>
                    <td>
                      <div className="action-buttons">
                        {incidencia.estado.toLowerCase() === 'pendiente' && (
                          <>
                            <button
                              onClick={() => handleResolver(incidencia.id)}
                              className="btn btn--success btn--sm"
                              title="Resolver"
                              aria-label={`Resolver incidencia de ${incidencia.emisor?.nombre}`}
                              disabled={procesando === incidencia.id}
                            >
                              {procesando === incidencia.id ? (
                                <span>Procesando...</span>
                              ) : (
                                <>
                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    aria-hidden="true"
                                  >
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                  Resolver
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleRechazar(incidencia.id)}
                              className="btn btn--danger btn--sm"
                              title="Rechazar"
                              aria-label={`Rechazar incidencia de ${incidencia.emisor?.nombre}`}
                              disabled={procesando === incidencia.id}
                            >
                              {procesando === incidencia.id ? (
                                <span>Procesando...</span>
                              ) : (
                                <>
                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    aria-hidden="true"
                                  >
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                  </svg>
                                  Rechazar
                                </>
                              )}
                            </button>
                          </>
                        )}
                        {incidencia.estado.toLowerCase() !== 'pendiente' && (
                          <span className="action-completed">
                            {incidencia.fechaResolucion
                              ? `Resuelto: ${formatDateTime(incidencia.fechaResolucion)}`
                              : 'Completado'}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="incidencias__pagination">
            <button
              onClick={previousPage}
              disabled={!canGoPrevious}
              className="btn btn--secondary btn--sm"
              aria-label="Ir a página anterior"
            >
              Anterior
            </button>
            <span className="pagination-info">Página {currentPage}</span>
            <button
              onClick={nextPage}
              disabled={!canGoNext(incidencias.length)}
              className="btn btn--secondary btn--sm"
              aria-label="Ir a página siguiente"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  )
}
