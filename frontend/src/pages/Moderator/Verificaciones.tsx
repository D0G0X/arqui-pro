import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_VERIFICACIONES } from '../../services/graphql/queries'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import type { Verificacion } from '../../types/moderator.types'
import '../../styles/Moderator/Verificaciones.css'

interface VerificacionesResponse {
  verificaciones: Verificacion[]
}

export const Verificaciones = () => {
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [paginaActual, setPaginaActual] = useState(1)
  const itemsPorPagina = 10

  const { data, loading, error, refetch } = useQuery<VerificacionesResponse>(
    GET_VERIFICACIONES,
    {
      variables: {
        estado: filtroEstado === 'todos' ? undefined : filtroEstado,
        limite: itemsPorPagina,
        offset: (paginaActual - 1) * itemsPorPagina
      },
      fetchPolicy: 'network-only'
    }
  )

  const handleAprobar = async (id: number) => {
    // TODO: Implement REST API call to approve verification
    console.log('Aprobar verificación:', id)
    alert('Función de aprobar en desarrollo')
  }

  const handleRechazar = async (id: number) => {
    // TODO: Implement REST API call to reject verification
    console.log('Rechazar verificación:', id)
    alert('Función de rechazar en desarrollo')
  }

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'badge badge--warning'
      case 'aprobado':
        return 'badge badge--success'
      case 'rechazado':
        return 'badge badge--danger'
      default:
        return 'badge badge--default'
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
            onChange={(e) => {
              setFiltroEstado(e.target.value)
              setPaginaActual(1)
            }}
            className="filter-select"
          >
            <option value="todos">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="aprobado">Aprobado</option>
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
                      <span className={getEstadoBadgeClass(verificacion.estado)}>
                        {verificacion.estado}
                      </span>
                    </td>
                    <td>{formatFecha(verificacion.fechaSolicitud)}</td>
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
                              Aprobar
                            </button>
                            <button
                              onClick={() => handleRechazar(verificacion.id)}
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
                        {verificacion.estado.toLowerCase() !== 'pendiente' && (
                          <span className="action-completed">
                            {verificacion.fechaResolucion
                              ? `Resuelto: ${formatFecha(verificacion.fechaResolucion)}`
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
              onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
              disabled={paginaActual === 1}
              className="btn btn--secondary btn--sm"
            >
              Anterior
            </button>
            <span className="pagination-info">Página {paginaActual}</span>
            <button
              onClick={() => setPaginaActual((p) => p + 1)}
              disabled={verificaciones.length < itemsPorPagina}
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
