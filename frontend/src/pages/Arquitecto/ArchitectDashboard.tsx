import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { logger } from '../../utils/logger';
import arquitectosService from '../../services/api/arquitectosService';
import proyectosService from '../../services/api/proyectosService';
import type { Arquitecto, Proyecto } from '../../types';
import '../../styles/ArchitectDashboard.css';

const ArchitectDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [arquitecto, setArquitecto] = useState<Arquitecto | null>(null);
  const [proyectosRecientes, setProyectosRecientes] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        
        // Obtener el arquitecto actual
        const response = await arquitectosService.getAll();
        const arquitectoEncontrado = response.arquitectos.find(
          (arq) => arq.usuario_id === user?.id || arq.usuario?.id === user?.id
        );

        if (arquitectoEncontrado) {
          setArquitecto(arquitectoEncontrado);

          // Cargar proyectos del arquitecto
          const allProyectos = await proyectosService.getAll();
          const proyectosArquitecto = allProyectos.filter(
            p => String(p.arquitecto_id) === String(arquitectoEncontrado.id)
          );
          setProyectosRecientes(proyectosArquitecto.slice(0, 4));
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

  if (loading) {
    return (
      <div className="arquitecto-dashboard-loading">
        <div className="ad-loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  // Separar proyectos en progreso y completados
  const proyectosEnProgreso = proyectosRecientes.filter(
    p => !p.valoracion_promedio || p.valoracion_promedio === 0
  );
  const proyectosCompletados = proyectosRecientes.filter(
    p => p.valoracion_promedio && p.valoracion_promedio > 0
  );

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
                  <span className="estadistica-numero">{proyectosRecientes.length}</span>
                  <span className="estadistica-texto">Total Proyectos</span>
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
                  <span className="estadistica-numero">{proyectosEnProgreso.length}</span>
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
                  <span className="estadistica-numero">{proyectosCompletados.length}</span>
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
                    {arquitecto?.valoracion_prom_proyecto 
                      ? arquitecto.valoracion_prom_proyecto.toFixed(1) 
                      : '0.0'}
                  </span>
                  <span className="estadistica-texto">Valoración Promedio</span>
                </div>
              </div>
            </div>
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

