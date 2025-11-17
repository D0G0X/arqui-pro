import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useArchitectDashboard } from '../../hooks/useArchitectDashboard';
import { logger } from '../../utils/logger';
import arquitectosService from '../../services/api/arquitectosService';
import proyectosService from '../../services/api/proyectosService';
import incidenciasService from '../../services/api/incidenciasService';
import type { Arquitecto, Proyecto, Incidencia } from '../../types';
import '../../styles/ArchitectDashboard.css';

const ArchitectDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [arquitecto, setArquitecto] = useState<Arquitecto | null>(null);
  const [proyectosRecientes, setProyectosRecientes] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);

  // Hook consolidado para actualizaciones en tiempo real del dashboard
  const dashboard = useArchitectDashboard({
    arquitectoId: arquitecto?.id || '',
    autoConnect: !!arquitecto?.id
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        
        // Obtener el arquitecto actual
        const response = await arquitectosService.getAll();
        const arquitectoEncontrado = response.find(
          (arq) => arq.usuario_id === user?.id || arq.usuario?.id === user?.id
        );

        if (arquitectoEncontrado) {
          setArquitecto(arquitectoEncontrado);

          // Cargar datos iniciales
          const allProyectos = await proyectosService.getAll();
          const proyectosArquitecto = allProyectos.filter(
            p => String(p.arquitecto_id) === String(arquitectoEncontrado.id)
          );
          setProyectosRecientes(proyectosArquitecto.slice(0, 4));

          // Inicializar el dashboard con los datos cargados
          dashboard.initializeData(proyectosArquitecto);

          // Cargar incidencias del arquitecto (opcional)
          try {
            const allIncidencias = await incidenciasService.getAll();
            const incidenciasArquitecto = allIncidencias.filter(
              (inc: Incidencia) => inc.usuario_id === arquitectoEncontrado.usuario_id
            );
            dashboard.setIncidencias(incidenciasArquitecto);
          } catch (error) {
            logger.warn('No se pudieron cargar las incidencias:', error);
          }
        }

        logger.info('Datos del dashboard del arquitecto cargados exitosamente');
      } catch (error) {
        logger.error('Error al cargar datos del dashboard del arquitecto:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [user]);

  // Actualizar proyectos cuando lleguen desde WebSocket
  useEffect(() => {
    if (dashboard.proyectos.length > 0) {
      setProyectosRecientes(dashboard.proyectos.slice(0, 4));
    }
  }, [dashboard.proyectos]);

  if (loading) {
    return (
      <div className="arquitecto-dashboard-loading">
        <div className="ad-loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  // Usar las estadísticas calculadas en tiempo real
  const {
    totalProyectos,
    proyectosEnProgreso,
    proyectosCompletados,
    totalAvances,
    promedio,
    incidenciasPendientes,
    totalIncidencias,
  } = dashboard.stats;

  return (
    <div className="arquitecto-dashboard">
      {/* Bienvenida */}
      <header className="arquitecto-dashboard-header">
        <h1 className="arquitecto-dashboard-titulo">
          Bienvenido de Nuevo, <span className="nombre-usuario">{user?.nombre}!</span>
        </h1>
      </header>

      <div className="arquitecto-dashboard-grid">
        {/* Columna Principal */}
        <div className="arquitecto-dashboard-main">
          {/* Proyectos Recientes */}
          <section className="seccion-proyectos">
            <div className="seccion-header">
              <h2 className="seccion-titulo">Mis Proyectos</h2>
              <button 
                onClick={() => navigate('/arquitecto/create-project')} 
                className="btn-crear-proyecto"
              >
                + Crear Proyecto
              </button>
            </div>
            <div className="proyectos-grid">
              {proyectosRecientes.length > 0 ? (
                proyectosRecientes.map((proyecto) => (
                  <div 
                    key={proyecto.id} 
                    className="proyecto-card"
                    onClick={() => navigate(`/arquitecto/project/${proyecto.id}`)}
                  >
                    <div className="proyecto-imagen">
                      <img 
                        src={proyecto.imagenes?.[0]?.imagen_url || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400'} 
                        alt={proyecto.titulo_proyecto} 
                      />
                    </div>
                    <div className="proyecto-contenido">
                      <h3 className="proyecto-titulo">{proyecto.titulo_proyecto}</h3>
                      <p className="proyecto-descripcion">
                        {proyecto.descripcion.substring(0, 100)}
                        {proyecto.descripcion.length > 100 ? '...' : ''}
                      </p>
                      <div className="proyecto-footer">
                        <span className="proyecto-tipo">
                          {proyecto.tipo_proyecto === 'portafolio' ? '📁 Portafolio' : '📋 Contratado'}
                        </span>
                        <span className="proyecto-valoracion">
                          {proyecto.valoracion_promedio && proyecto.valoracion_promedio > 0 
                            ? `⭐ ${proyecto.valoracion_promedio.toFixed(1)}` 
                            : '⏳ En progreso'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="sin-proyectos">
                  <p className="sin-datos-mensaje">Aún no tienes proyectos.</p>
                  <p className="sin-datos-ayuda">
                    Comienza creando tu primer proyecto para mostrar tu trabajo.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Derecho - Estadísticas */}
        <aside className="arquitecto-dashboard-sidebar">
          <section className="seccion-estadisticas">
            <h2 className="seccion-titulo">Estadísticas</h2>
            <div className="estadisticas-lista">
              <div className="estadistica-item">
                <div className="estadistica-icono total">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <div className="estadistica-info">
                  <span className="estadistica-numero">{totalProyectos}</span>
                  <span className="estadistica-texto">
                    Total Proyectos
                    {dashboard.connections.proyectos && (
                      <span className="ws-status ws-connected" title="WebSocket conectado">●</span>
                    )}
                  </span>
                </div>
              </div>

              <div className="estadistica-item">
                <div className="estadistica-icono en-progreso">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className="estadistica-info">
                  <span className="estadistica-numero">{proyectosEnProgreso}</span>
                  <span className="estadistica-texto">En Progreso</span>
                </div>
              </div>

              <div className="estadistica-item">
                <div className="estadistica-icono completado">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div className="estadistica-info">
                  <span className="estadistica-numero">{proyectosCompletados}</span>
                  <span className="estadistica-texto">Completados</span>
                </div>
              </div>

              <div className="estadistica-item">
                <div className="estadistica-icono valoracion">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <div className="estadistica-info">
                  <span className="estadistica-numero">
                    {promedio > 0
                      ? promedio.toFixed(1)
                      : arquitecto?.valoracion_prom_proyecto 
                      ? arquitecto.valoracion_prom_proyecto.toFixed(1) 
                      : '0.0'}
                  </span>
                  <span className="estadistica-texto">
                    Valoración Promedio
                    {dashboard.connections.valoraciones && (
                      <span className="ws-status ws-connected" title="WebSocket conectado">●</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Avances Totales */}
              <div className="estadistica-item">
                <div className="estadistica-icono avances">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                  </svg>
                </div>
                <div className="estadistica-info">
                  <span className="estadistica-numero">{totalAvances}</span>
                  <span className="estadistica-texto">
                    Avances Registrados
                    {dashboard.connections.avances && (
                      <span className="ws-status ws-connected" title="WebSocket conectado">●</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Incidencias - NUEVO */}
              <div className="estadistica-item">
                <div className="estadistica-icono incidencias">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <div className="estadistica-info">
                  <span className="estadistica-numero">
                    {incidenciasPendientes}
                    {incidenciasPendientes > 0 && <span className="badge-alert">!</span>}
                  </span>
                  <span className="estadistica-texto">
                    Incidencias Pendientes
                    {dashboard.connections.incidencias && (
                      <span className="ws-status ws-connected" title="WebSocket conectado">●</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Total de Incidencias */}
              <div className="estadistica-item">
                <div className="estadistica-icono incidencias-total">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <div className="estadistica-info">
                  <span className="estadistica-numero">{totalIncidencias}</span>
                  <span className="estadistica-texto">Total Incidencias</span>
                </div>
              </div>
            </div>

            {/* Indicador de conexión WebSocket */}
            {dashboard.allConnected && (
              <div className="ws-indicator">
                <span className="ws-indicator-dot"></span>
                <span className="ws-indicator-text">Actualizaciones en tiempo real activas</span>
              </div>
            )}
            {dashboard.isConnected && !dashboard.allConnected && (
              <div className="ws-indicator ws-partial">
                <span className="ws-indicator-dot"></span>
                <span className="ws-indicator-text">Conectando servicios...</span>
              </div>
            )}
          </section>

          {/* Acciones Rápidas */}
          <section className="seccion-acciones">
            <h2 className="seccion-titulo">Acciones Rápidas</h2>
            <div className="acciones-lista">
              <button 
                onClick={() => navigate('/arquitecto/chat')}
                className="accion-btn"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Ver Mensajes
              </button>
              <button 
                onClick={() => navigate('/arquitecto/profile')}
                className="accion-btn"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Ver Mi Perfil
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default ArchitectDashboard;

