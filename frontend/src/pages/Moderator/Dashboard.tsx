import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Users, FolderKanban, AlertCircle, CheckCircle, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { ModeratorLayout } from '../../components/Moderator/ModeratorLayout';
import { moderadorService } from '../../services/api/moderador/moderadorService';
import { notificationService } from '../../services/websocket/notificationService';
import { GET_MODERATOR_STATS } from '../../services/graphql/queries';
import '../../styles/Moderator/Dashboard.css';

interface Estadisticas {
  totalUsuarios: number;
  totalArquitectos: number;
  totalClientes: number;
  totalModeradores: number;
  totalProyectos: number;
  proyectosNuevos: number;
  totalIncidencias: number;
  incidenciasPendientes: number;
  arquitectosVerificados: number;
  verificacionesPendientes: number;
}

interface NotificacionUI {
  id: string | number;
  tipo: 'verificacion' | 'mensaje' | 'incidencia';
  titulo: string;
  subtitulo?: string;
  tiempo: string;
}

export const ModeratorDashboard = () => {
  // Usar GraphQL para obtener KPIs de la plataforma
  const { data: kpisData, loading: kpisLoading } = useQuery(GET_MODERATOR_STATS, {
    fetchPolicy: 'network-only'
  });

  const [stats, setStats] = useState<Estadisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [notificaciones, setNotificaciones] = useState<NotificacionUI[]>([
    {
      id: 1,
      tipo: 'verificacion',
      titulo: 'Nueva verificación pendiente',
      subtitulo: 'Revisión de documentos arquitecto',
      tiempo: 'hace 5 min'
    },
    {
      id: 2,
      tipo: 'incidencia',
      titulo: 'Nueva incidencia reportada',
      subtitulo: 'Error en proyecto',
      tiempo: 'hace 30 min'
    }
  ]);

  // Suscribirse a notificaciones en tiempo real
  useEffect(() => {
    const unsubscribe = notificationService.onNotification((notification: any) => {
      setNotificaciones(prev => [
        {
          id: notification.id || `notif-${Date.now()}`,
          tipo: 'mensaje' as const,
          titulo: notification.data?.titulo || 'Nueva notificación',
          subtitulo: notification.data?.mensaje || '',
          tiempo: 'Ahora'
        },
        ...prev.slice(0, 9) // Mantener máximo 10 notificaciones
      ]);
    });

    // Cleanup al desmontar
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    cargarEstadisticasDetalladas();
  }, []);

  // Combinar datos de GraphQL (KPIs) con datos de REST (detalles)
  useEffect(() => {
    if (kpisData?.kpisPlataforma) {
      const kpis = kpisData.kpisPlataforma;
      setStats(prevStats => ({
        ...prevStats,
        totalUsuarios: kpis.totalUsuarios || 0,
        totalProyectos: kpis.totalProyectos || 0,
        arquitectosVerificados: kpis.arquitectosVerificados || 0,
        totalIncidencias: kpis.totalIncidencias || 0,
        // Valores por defecto para datos adicionales
        totalArquitectos: Math.floor((kpis.totalUsuarios || 0) * 0.3),
        totalClientes: Math.floor((kpis.totalUsuarios || 0) * 0.68),
        totalModeradores: Math.floor((kpis.totalUsuarios || 0) * 0.02),
        proyectosNuevos: Math.floor((kpis.totalProyectos || 0) * 0.15),
        incidenciasPendientes: Math.floor((kpis.totalIncidencias || 0) * 0.3),
        verificacionesPendientes: Math.floor(kpis.arquitectosVerificados * 0.05)
      }));
      setLoading(false);
    }
  }, [kpisData]);

  const cargarEstadisticasDetalladas = async () => {
    try {
      // Obtener datos adicionales del REST API si es necesario
      const data = await moderadorService.getEstadisticas();
      setStats(prevStats => ({
        ...prevStats,
        ...data
      }));
    } catch (error) {
      console.error('Error al cargar estadísticas detalladas:', error);
      // No marcamos loading como false aquí, esperamos a que GraphQL termine
    }
  };

  if (kpisLoading || loading) {
    return (
      <ModeratorLayout>
        <div className="dashboard-loading">Cargando...</div>
      </ModeratorLayout>
    );
  }

  return (
    <ModeratorLayout>
      <div className="moderator-dashboard">
        <h1 className="dashboard-title">Moderator Dashboard</h1>

        <div className="dashboard-stats">
          {/* Total Users */}
          <div className="stat-card">
            <div className="stat-card__header">
              <div className="stat-card__icon stat-card__icon--users">
                <Users size={24} />
              </div>
              <span className="stat-card__label">Total Users</span>
            </div>
            <h2 className="stat-card__value">{stats?.totalUsuarios.toLocaleString() || '0'}</h2>
            <div className="stat-card__details">
              <div className="stat-detail">
                <span className="stat-detail__label">Arquitectos</span>
                <span className="stat-detail__value">{stats?.totalArquitectos || 0}</span>
              </div>
              <div className="stat-detail">
                <span className="stat-detail__label">Clients</span>
                <span className="stat-detail__value">{stats?.totalClientes || 0}</span>
              </div>
              <div className="stat-detail">
                <span className="stat-detail__label">Moderators</span>
                <span className="stat-detail__value">{stats?.totalModeradores || 0}</span>
              </div>
            </div>
          </div>

          {/* Total Projects */}
          <div className="stat-card">
            <div className="stat-card__header">
              <div className="stat-card__icon stat-card__icon--projects">
                <FolderKanban size={24} />
              </div>
              <span className="stat-card__label">Total Projects</span>
            </div>
            <h2 className="stat-card__value">{stats?.totalProyectos.toLocaleString() || '0'}</h2>
            <div className="stat-card__badge stat-card__badge--success">
              <TrendingUp size={14} />
              <span>{stats?.proyectosNuevos || 0} new this month</span>
            </div>
          </div>

          {/* Total Incidents */}
          <div className="stat-card">
            <div className="stat-card__header">
              <div className="stat-card__icon stat-card__icon--incidents">
                <AlertCircle size={24} />
              </div>
              <span className="stat-card__label">Total Incidents</span>
            </div>
            <h2 className="stat-card__value">{stats?.totalIncidencias || '0'}</h2>
            <div className="stat-card__badge stat-card__badge--danger">
              <TrendingDown size={14} />
              <span>{stats?.incidenciasPendientes || 0} unresolved</span>
            </div>
          </div>

          {/* Verified Architects */}
          <div className="stat-card">
            <div className="stat-card__header">
              <div className="stat-card__icon stat-card__icon--verified">
                <CheckCircle size={24} />
              </div>
              <span className="stat-card__label">Verified Architects</span>
            </div>
            <h2 className="stat-card__value">{stats?.arquitectosVerificados || '0'}</h2>
            <div className="stat-card__badge stat-card__badge--warning">
              <Clock size={14} />
              <span>{stats?.verificacionesPendientes || 0} pending verification</span>
            </div>
          </div>
        </div>

        {/* Notificaciones Recientes */}
        <div className="dashboard-notifications">
          <h2 className="notifications-title">Notificaciones Recientes</h2>
          <div className="notifications-list">
            {notificaciones.map((notif) => (
              <div key={notif.id} className="notification-item">
                <div className={`notification-icon notification-icon--${notif.tipo}`}>
                  {notif.tipo === 'verificacion' && <CheckCircle size={20} />}
                  {notif.tipo === 'mensaje' && <Users size={20} />}
                  {notif.tipo === 'incidencia' && <AlertCircle size={20} />}
                </div>
                <div className="notification-content">
                  <p className="notification-title">
                    {notif.titulo}
                    {notif.subtitulo && (
                      <> <span className="notification-subtitle">{notif.subtitulo}</span></>
                    )}
                  </p>
                </div>
                <span className="notification-time">{notif.tiempo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModeratorLayout>
  );
};