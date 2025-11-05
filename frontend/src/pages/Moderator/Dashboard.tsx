import { useModeratorData } from '../../hooks/useModeratorData'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import { formatNumber, formatPercentage } from '../../utils/formatters'
import { ROUTES } from '../../config/constants'
import '../../styles/Moderator/Dashboard.css'

export const ModeratorDashboard = () => {
  const { stats, loading, error, refetch } = useModeratorData()

  if (loading) {
    return (
      <div className="moderator-loading">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="moderator-error">
        <ErrorMessage
          message="Error al cargar las estadísticas del moderador"
          onRetry={refetch}
        />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="moderator-error">
        <ErrorMessage message="No se pudieron cargar los datos" />
      </div>
    )
  }

  return (
    <div className="moderator-dashboard">
      <div className="moderator-dashboard__header">
        <h1 className="moderator-dashboard__title">Panel de Moderador</h1>
        <p className="moderator-dashboard__subtitle">
          Vista general de la plataforma
        </p>
      </div>

      <div className="moderator-dashboard__stats">
        <div className="stat-card stat-card--users">
          <div className="stat-card__icon" aria-hidden="true">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="stat-card__content">
            <p className="stat-card__label">Total Usuarios</p>
            <p className="stat-card__value" aria-label={`${stats.totalUsuarios} usuarios en total`}>
              {formatNumber(stats.totalUsuarios)}
            </p>
          </div>
        </div>

        <div className="stat-card stat-card--projects">
          <div className="stat-card__icon" aria-hidden="true">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <div className="stat-card__content">
            <p className="stat-card__label">Total Proyectos</p>
            <p className="stat-card__value" aria-label={`${stats.totalProyectos} proyectos en total`}>
              {formatNumber(stats.totalProyectos)}
            </p>
          </div>
        </div>

        <div className="stat-card stat-card--incidents">
          <div className="stat-card__icon" aria-hidden="true">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div className="stat-card__content">
            <p className="stat-card__label">Incidencias</p>
            <p className="stat-card__value" aria-label={`${stats.totalIncidencias} incidencias reportadas`}>
              {formatNumber(stats.totalIncidencias)}
            </p>
          </div>
        </div>

        <div className="stat-card stat-card--verified">
          <div className="stat-card__icon" aria-hidden="true">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="stat-card__content">
            <p className="stat-card__label">Arquitectos Verificados</p>
            <p className="stat-card__value" aria-label={`${stats.arquitectosVerificados} arquitectos verificados`}>
              {formatNumber(stats.arquitectosVerificados)}
            </p>
            <p className="stat-card__percentage">
              {formatPercentage(stats.tasaVerificacion, 1)} del total
            </p>
          </div>
        </div>
      </div>

      <div className="moderator-dashboard__quick-actions">
        <h2 className="moderator-dashboard__section-title">Acciones Rápidas</h2>
        <div className="quick-actions-grid">
          <a 
            href={ROUTES.MODERATOR.VERIFICACIONES}
            className="quick-action-card"
            aria-label="Ir a verificaciones de arquitectos"
          >
            <div className="quick-action-card__icon" aria-hidden="true">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="quick-action-card__content">
              <h3 className="quick-action-card__title">Verificaciones</h3>
              <p className="quick-action-card__description">
                Revisar solicitudes de verificación
              </p>
            </div>
          </a>

          <a 
            href={ROUTES.MODERATOR.INCIDENCIAS}
            className="quick-action-card"
            aria-label="Ir a gestión de incidencias"
          >
            <div className="quick-action-card__icon" aria-hidden="true">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className="quick-action-card__content">
              <h3 className="quick-action-card__title">Incidencias</h3>
              <p className="quick-action-card__description">
                Gestionar reportes e incidencias
              </p>
            </div>
          </a>

          <a 
            href={ROUTES.MODERATOR.USUARIOS}
            className="quick-action-card"
            aria-label="Ir a administración de usuarios"
          >
            <div className="quick-action-card__icon" aria-hidden="true">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="quick-action-card__content">
              <h3 className="quick-action-card__title">Usuarios</h3>
              <p className="quick-action-card__description">
                Administrar usuarios y perfiles
              </p>
            </div>
          </a>

          <a 
            href={ROUTES.MODERATOR.REPORTES}
            className="quick-action-card"
            aria-label="Ir a visualización de reportes"
          >
            <div className="quick-action-card__icon" aria-hidden="true">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div className="quick-action-card__content">
              <h3 className="quick-action-card__title">Reportes</h3>
              <p className="quick-action-card__description">
                Ver reportes del sistema
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
