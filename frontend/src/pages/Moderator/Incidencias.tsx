import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_INCIDENCIAS } from '../../services/graphql/queries'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import type { Incidencia } from '../../types/moderator.types'
import '../../styles/Moderator/Incidencias.css'

interface IncidenciasResponse {
  incidencias: Incidencia[]
}

export const Incidencias = () => {
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [paginaActual, setPaginaActual] = useState(1)
  const [verDetalles, setVerDetalles] = useState<number | null>(null)
  const itemsPorPagina = 10

  const { data, loading, error, refetch } = useQuery<IncidenciasResponse>(
    GET_INCIDENCIAS,
    {
      variables: {
        estado: filtroEstado === 'todos' ? undefined : filtroEstado,
        limite: itemsPorPagina,
        offset: (paginaActual - 1) * itemsPorPagina
      },
      fetchPolicy: 'network-only'
    }
  )

  const handleResolver = async (id: number) => {
    // TODO: Implement REST API call to resolve incident
    console.log('Resolver incidencia:', id)
    alert('Función de resolver en desarrollo')
  }

  const handleRechazar = async (id: number) => {
    // TODO: Implement REST API call to reject incident
    console.log('Rechazar incidencia:', id)
    alert('Función de rechazar en desarrollo')
  }

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'badge badge--warning'
      case 'resuelto':
        return 'badge badge--success'
      case 'rechazado':
        return 'badge badge--danger'
      case 'en_revision':
        return 'badge badge--info'
      default:
        return 'badge badge--default'
    }
  }

  const getEstadoLabel = (estado: string) => {
    const labels: Record<string, string> = {
      pendiente: 'Pendiente',
      resuelto: 'Resuelto',
      rechazado: 'Rechazado',
      en_revision: 'En Revisión'
    }
    return labels[estado.toLowerCase()] || estado
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
              setPaginaActual(1)
            }}
            className="filter-select"
          >
            <option value="todos">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="en_revision">En Revisión</option>
            <option value="resuelto">Resuelto</option>
            <option value="rechazado">Rechazado</option>
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
                      <span className={getEstadoBadgeClass(incidencia.estado)}>
                        {getEstadoLabel(incidencia.estado)}
                      </span>
                    </td>
                    <td>{formatFecha(incidencia.fechaCreacion)}</td>
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
                            >
                              Ver menos
                            </button>
                          </>
                        ) : (
                          <>
                            <p className="descripcion-truncated">
                              {incidencia.descripcion.length > 60
                                ? `${incidencia.descripcion.substring(0, 60)}...`
                                : incidencia.descripcion}
                            </p>
                            {incidencia.descripcion.length > 60 && (
                              <button
                                onClick={() => setVerDetalles(incidencia.id)}
                                className="btn-link"
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
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              Resolver
                            </button>
                            <button
                              onClick={() => handleRechazar(incidencia.id)}
                              className="btn btn--danger btn--sm"
                              title="Rechazar"
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                              Rechazar
                            </button>
                          </>
                        )}
                        {incidencia.estado.toLowerCase() !== 'pendiente' && (
                          <span className="action-completed">
                            {incidencia.fechaResolucion
                              ? `Resuelto: ${formatFecha(incidencia.fechaResolucion)}`
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
              onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
              disabled={paginaActual === 1}
              className="btn btn--secondary btn--sm"
            >
              Anterior
            </button>
            <span className="pagination-info">Página {paginaActual}</span>
            <button
              onClick={() => setPaginaActual((p) => p + 1)}
              disabled={incidencias.length < itemsPorPagina}
              className="btn btn--secondary btn--sm"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  )
}
