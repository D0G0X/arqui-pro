import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_VERIFICACIONES } from '../../services/graphql/queries'
import moderadorService from '../../services/api/moderador/moderadorService'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import { usePagination } from '../../hooks/usePagination'
import { formatDate, getBadgeClass } from '../../utils/formatters'
import { VERIFICACION_ESTADOS_OPTIONS } from '../../config/constants'
import { logger } from '../../utils/logger'
import type { Verificacion } from '../../types/moderator.types'
import '../../styles/Moderator/Verificaciones.css'

interface VerificacionesResponse {
  verificaciones: Verificacion[]
}

export const Verificaciones = () => {
  const { user } = useAuth()
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [procesando, setProcesando] = useState<number | null>(null)
  const { currentPage, limit, offset, nextPage, previousPage, canGoPrevious, canGoNext } =
    usePagination()

  const { data, loading, error, refetch } = useQuery<VerificacionesResponse>(
    GET_VERIFICACIONES,
    {
      variables: {
        estado: filtroEstado === 'todos' ? undefined : filtroEstado,
        limite: limit,
        offset: offset
      },
      fetchPolicy: 'network-only'
    }
  )

  const handleAprobar = async (id: number) => {
    if (!user?.id) {
      alert('Error: No se pudo identificar al usuario')
      return
    }

    const comentarios = prompt('Comentarios (opcional):')
    
    try {
      setProcesando(id)
      logger.info('Aprobando verificación', { id, moderador_id: user.id })
      
      await moderadorService.aprobarVerificacion(id, {
        moderador_id: parseInt(user.id),
        comentarios: comentarios || undefined
      })
      
      alert('✅ Verificación aprobada exitosamente')
      await refetch()
    } catch (error) {
      logger.error('Error al aprobar verificación', error)
      alert('❌ Error al aprobar la verificación. Intenta nuevamente.')
    } finally {
      setProcesando(null)
    }
  }

  const handleRechazar = async (id: number) => {
    if (!user?.id) {
      alert('Error: No se pudo identificar al usuario')
      return
    }

    const comentarios = prompt('Razón del rechazo (obligatorio):')
    
    if (!comentarios || comentarios.trim() === '') {
      alert('Debes proporcionar una razón para el rechazo')
      return
    }
    
    try {
      setProcesando(id)
      logger.info('Rechazando verificación', { id, moderador_id: user.id })
      
      await moderadorService.rechazarVerificacion(id, {
        moderador_id: parseInt(user.id),
        comentarios: comentarios.trim()
      })
      
      alert('✅ Verificación rechazada')
      await refetch()
    } catch (error) {
      logger.error('Error al rechazar verificación', error)
      alert('❌ Error al rechazar la verificación. Intenta nuevamente.')
    } finally {
      setProcesando(null)
    }
  }

  if (loading) {
    return (
      <div className="verificaciones-loading">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="verificaciones-error">
        <ErrorMessage
          message="Error al cargar las verificaciones"
          onRetry={refetch}
        />
      </div>
    )
  }

  const verificaciones = data?.verificaciones || []

  return (
    <div className="verificaciones">
      <div className="verificaciones__header">
        <h1 className="verificaciones__title">Verificaciones de Arquitectos</h1>
        <p className="verificaciones__subtitle">
          Gestionar solicitudes de verificación
        </p>
      </div>

      <div className="verificaciones__filters">
        <div className="filter-group">
          <label htmlFor="estado-filter" className="filter-label">
            Filtrar por estado:
          </label>
          <select
            id="estado-filter"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="filter-select"
          >
            {VERIFICACION_ESTADOS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <button onClick={() => refetch()} className="btn btn--secondary">
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

      {verificaciones.length === 0 ? (
        <div className="verificaciones__empty">
          <p>No hay verificaciones para mostrar</p>
        </div>
      ) : (
        <>
          <div className="verificaciones__table-container">
            <table className="verificaciones__table">
              <thead>
                <tr>
                  <th>Estado</th>
                  <th>Fecha Solicitud</th>
                  <th>Arquitecto</th>
                  <th>Cédula</th>
                  <th>Moderador</th>
                  <th>Comentarios</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {verificaciones.map((verificacion) => (
                  <tr key={verificacion.id}>
                    <td>
                      <span className={getBadgeClass(verificacion.estado)}>
                        {verificacion.estado}
                      </span>
                    </td>
                    <td>{formatDate(verificacion.fechaSolicitud)}</td>
                    <td>
                      {verificacion.arquitecto?.usuario
                        ? `${verificacion.arquitecto.usuario.nombre} ${verificacion.arquitecto.usuario.apellido}`
                        : 'N/A'}
                    </td>
                    <td>{verificacion.arquitecto?.cedula || 'N/A'}</td>
                    <td>
                      {verificacion.moderador
                        ? `${verificacion.moderador.nombre} ${verificacion.moderador.apellido}`
                        : '-'}
                    </td>
                    <td className="comentarios-cell">
                      {verificacion.comentarios || '-'}
                    </td>
                    <td>
                      <div className="action-buttons">
                        {verificacion.estado.toLowerCase() === 'pendiente' && (
                          <>
                            <button
                              onClick={() => handleAprobar(verificacion.id)}
                              className="btn btn--success btn--sm"
                              title="Aprobar"
                              aria-label={`Aprobar verificación ${verificacion.id}`}
                              disabled={procesando === verificacion.id}
                            >
                              {procesando === verificacion.id ? (
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
                                  Aprobar
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleRechazar(verificacion.id)}
                              className="btn btn--danger btn--sm"
                              title="Rechazar"
                              aria-label={`Rechazar verificación ${verificacion.id}`}
                              disabled={procesando === verificacion.id}
                            >
                              {procesando === verificacion.id ? (
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
                        {verificacion.estado.toLowerCase() !== 'pendiente' && (
                          <span className="action-completed">
                            {verificacion.fechaResolucion
                              ? `Resuelto: ${formatDate(verificacion.fechaResolucion)}`
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

          <div className="verificaciones__pagination">
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
              disabled={!canGoNext(verificaciones.length)}
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
