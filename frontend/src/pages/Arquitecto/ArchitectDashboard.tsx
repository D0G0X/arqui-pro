import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { MessageCircle, LogOut, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { NotificationInbox } from '../../components/NotificationInbox';
import arquitectosService from '../../services/api/arquitectosService';
import proyectosService from '../../services/api/proyectosService';
import type { Arquitecto, Proyecto } from '../../types';
import { getInitials, getAvatarColor } from '../../utils/formatters';
import { AVATAR_COLORS } from '../../config/constants';
import '../../styles/ArchitectDashboard.css';

export default function ArchitectDashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [arquitecto, setArquitecto] = useState<Arquitecto | null>(null);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProyectos, setLoadingProyectos] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'in_progress' | 'completed'>('all');

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    if (user.rol !== 'arquitecto') {
      navigate('/');
      return;
    }

    const fetchArquitecto = async () => {
      try {
        setLoading(true);
        const response = await arquitectosService.getAll();
        const arquitectoEncontrado = response.arquitectos.find(
          (arq) => arq.usuario_id === user.id || arq.usuario?.id === user.id
        );

        if (arquitectoEncontrado) {
          setArquitecto(arquitectoEncontrado);
          
          // Cargar proyectos del arquitecto
          fetchProyectos(arquitectoEncontrado.id);
        } else {
          setError('No se encontró el perfil de arquitecto asociado');
        }
      } catch (err: any) {
        setError(err.message || 'Error al cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchArquitecto();
  }, [isAuthenticated, user, navigate]);

  const fetchProyectos = async (arquitectoId: string) => {
    try {
      setLoadingProyectos(true);
      const allProyectos = await proyectosService.getAll();
      // Filtrar proyectos del arquitecto actual
      const proyectosArquitecto = allProyectos.filter(
        p => String(p.arquitecto_id) === String(arquitectoId)
      );
      setProyectos(proyectosArquitecto);
    } catch (err) {
      console.error('Error al cargar proyectos:', err);
    } finally {
      setLoadingProyectos(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  if (error || !arquitecto) {
    return (
      <div className="dashboard-error">
        <AlertCircle size={48} />
        <p>{error || 'Perfil no encontrado'}</p>
        <button onClick={() => navigate('/')} className="btn-primary">Volver al inicio</button>
      </div>
    );
  }

  const nombreCompleto = arquitecto.usuario
    ? `${arquitecto.usuario.nombre} ${arquitecto.usuario.apellido}`
    : user?.nombre || 'Arquitecto';
  const iniciales = arquitecto.usuario
    ? getInitials(arquitecto.usuario.nombre || '', arquitecto.usuario.apellido || '')
    : getInitials(user?.nombre || '', user?.apellido || '');
  const avatarColor = getAvatarColor(nombreCompleto, AVATAR_COLORS);

  // Calcular estado de cada proyecto basado en valoración
  const proyectosConEstado = proyectos.map(p => ({
    ...p,
    estado: p.valoracion_promedio && p.valoracion_promedio > 0 ? 'completado' : 'en_progreso'
  }));

  const stats = {
    total: proyectosConEstado.length,
    enProgreso: proyectosConEstado.filter(p => p.estado === 'en_progreso').length,
    completados: proyectosConEstado.filter(p => p.estado === 'completado').length,
  };

  // Filtrar proyectos según el filtro activo
  const filteredProjects = proyectosConEstado.filter(project => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'in_progress') return project.estado === 'en_progreso';
    if (activeFilter === 'completed') return project.estado === 'completado';
    return true;
  });

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'en_progreso':
        return <Clock size={16} className="status-icon in-progress" />;
      case 'completado':
        return <CheckCircle size={16} className="status-icon completed" />;
      default:
        return <AlertCircle size={16} className="status-icon pending" />;
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'en_progreso':
        return 'In Progress';
      case 'completado':
        return 'Completed';
      default:
        return 'Pending';
    }
  };

  return (
    <div className="architect-dashboard">
      {/* Bandeja de notificaciones global */}
      <NotificationInbox />
      
      {/* Top Navigation Bar */}
      <nav className="dashboard-navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <span className="logo-icon">🏛️</span>
            <span className="logo-text">ArquiPro</span>
          </div>
          
          <div className="navbar-actions">
            <button 
              onClick={() => navigate('/arquitecto/chat')} 
              className="nav-btn"
              title="Messages"
            >
              <MessageCircle size={20} />
            </button>
            <div className="navbar-user">
              <div className="user-avatar" style={{ backgroundColor: avatarColor }}>
                {iniciales}
              </div>
              <span className="user-name">{nombreCompleto}</span>
            </div>
            <button 
              onClick={async () => {
                await logout();
                navigate('/');
              }} 
              className="nav-btn logout-btn"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content with Sidebar */}
      <div className="dashboard-layout">
        {/* Left Sidebar - Orange Panel */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-content">
            <div className="sidebar-header">
              <h2>My Projects</h2>
              <p>Manage and track all your architectural projects</p>
            </div>

            {/* Stats Summary in Sidebar */}
            <div className="sidebar-stats">
              <div className="sidebar-stat-item">
                <div className="stat-icon-wrapper total">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <div className="stat-info">
                  <span className="stat-number">{stats.total}</span>
                  <span className="stat-text">Total Projects</span>
                </div>
              </div>

              <div className="sidebar-stat-item">
                <div className="stat-icon-wrapper in-progress">
                  <Clock size={28} />
                </div>
                <div className="stat-info">
                  <span className="stat-number">{stats.enProgreso}</span>
                  <span className="stat-text">In Progress</span>
                </div>
              </div>

              <div className="sidebar-stat-item">
                <div className="stat-icon-wrapper completed">
                  <CheckCircle size={28} />
                </div>
                <div className="stat-info">
                  <span className="stat-number">{stats.completados}</span>
                  <span className="stat-text">Completed</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => navigate('/arquitecto/create-project')} 
              className="sidebar-new-project-btn"
            >
              <Plus size={20} />
              <span>New Project</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="dashboard-main-content">
          <div className="dashboard-content-wrapper">
            {/* Header with tabs */}
            <div className="content-header">
              <h1 className="content-title">Active Projects</h1>
              <div className="content-tabs">
                <button 
                  className={`tab-btn ${activeFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('all')}
                >
                  All
                </button>
                <button 
                  className={`tab-btn ${activeFilter === 'in_progress' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('in_progress')}
                >
                  In Progress
                </button>
                <button 
                  className={`tab-btn ${activeFilter === 'completed' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('completed')}
                >
                  Completed
                </button>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="projects-grid">
              {loadingProyectos ? (
                <div className="loading-message">Cargando proyectos...</div>
              ) : filteredProjects.length === 0 ? (
                <div className="empty-message">
                  No hay proyectos {activeFilter === 'in_progress' ? 'en progreso' : activeFilter === 'completed' ? 'completados' : ''} aún
                </div>
              ) : (
                filteredProjects.map(project => (
                <div 
                  key={project.id} 
                  className="project-card"
                  onClick={() => navigate(`/arquitecto/project/${project.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="project-image">
                    <img 
                      src={project.imagenes?.[0]?.imagen_url || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400'} 
                      alt={project.titulo_proyecto} 
                    />
                    <div className="project-overlay">
                      <button className="btn-view-details">Ver Detalles</button>
                    </div>
                  </div>
                  <div className="project-content">
                    <div className="project-header">
                      <h3 className="project-title">{project.titulo_proyecto}</h3>
                      <div className="project-status">
                        {getStatusIcon(project.estado)}
                        <span className="status-text">{getStatusText(project.estado)}</span>
                      </div>
                    </div>
                    
                    <div className="project-info">
                      <div className="info-row">
                        <span className="info-label">Tipo:</span>
                        <span className="info-value">{project.tipo_proyecto === 'portafolio' ? 'Portafolio' : 'Contratado'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Fecha:</span>
                        <span className="info-value">
                          {project.fecha_publicacion ? new Date(project.fecha_publicacion).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Valoración:</span>
                        <span className="info-value">
                          {project.valoracion_promedio && project.valoracion_promedio > 0 ? `⭐ ${project.valoracion_promedio.toFixed(1)}` : 'Sin valorar'}
                        </span>
                      </div>
                    </div>

                    <div className="project-description" style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
                      <p>{project.descripcion.substring(0, 100)}{project.descripcion.length > 100 ? '...' : ''}</p>
                    </div>
                  </div>
                </div>
              ))
              )}
            </div>
          </div>
        </main>
      </div>
      <NotificationInbox />
    </div>
  );
}
