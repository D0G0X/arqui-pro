import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MessageCircle, LogOut, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { NotificationInbox } from '../components/NotificationInbox';
import arquitectosService from '../services/api/arquitectosService';
import type { Arquitecto } from '../types';
import { getInitials, getAvatarColor } from '../utils/formatters';
import { AVATAR_COLORS } from '../config/constants';
import '../styles/ArchitectDashboard.css';

export default function ArchitectDashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [arquitecto, setArquitecto] = useState<Arquitecto | null>(null);
  const [loading, setLoading] = useState(true);
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

  // Mock data for projects (replace with real data from API)
  const mockProjects = [
    {
      id: 1,
      nombre: 'Modern Villa Renovation',
      cliente: 'John Smith',
      ubicacion: 'San Francisco, CA',
      presupuesto: '$250,000',
      progreso: 75,
      estado: 'en_progreso',
      fecha_inicio: '2024-01-15',
      imagen: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400'
    },
    {
      id: 2,
      nombre: 'Commercial Office Space',
      cliente: 'Tech Corp Inc.',
      ubicacion: 'Austin, TX',
      presupuesto: '$450,000',
      progreso: 45,
      estado: 'en_progreso',
      fecha_inicio: '2024-02-01',
      imagen: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400'
    },
    {
      id: 3,
      nombre: 'Residential Complex',
      cliente: 'Property Developers LLC',
      ubicacion: 'Miami, FL',
      presupuesto: '$1,200,000',
      progreso: 30,
      estado: 'en_progreso',
      fecha_inicio: '2024-03-10',
      imagen: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'
    },
    {
      id: 4,
      nombre: 'Boutique Hotel Redesign',
      cliente: 'Luxury Hotels Group',
      ubicacion: 'New York, NY',
      presupuesto: '$850,000',
      progreso: 100,
      estado: 'completado',
      fecha_inicio: '2023-10-01',
      imagen: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'
    }
  ];

  const stats = {
    total: mockProjects.length,
    enProgreso: mockProjects.filter(p => p.estado === 'en_progreso').length,
    completados: mockProjects.filter(p => p.estado === 'completado').length,
    pendientes: mockProjects.filter(p => p.estado === 'pendiente').length
  };

  // Filtrar proyectos según el filtro activo
  const filteredProjects = mockProjects.filter(project => {
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
              {filteredProjects.map(project => (
                <div key={project.id} className="project-card">
                  <div className="project-image">
                    <img src={project.imagen} alt={project.nombre} />
                    <div className="project-overlay">
                      <button className="btn-view-details">View Details</button>
                    </div>
                  </div>
                  <div className="project-content">
                    <div className="project-header">
                      <h3 className="project-title">{project.nombre}</h3>
                      <div className="project-status">
                        {getStatusIcon(project.estado)}
                        <span className="status-text">{getStatusText(project.estado)}</span>
                      </div>
                    </div>
                    
                    <div className="project-info">
                      <div className="info-row">
                        <span className="info-label">Client:</span>
                        <span className="info-value">{project.cliente}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Location:</span>
                        <span className="info-value">{project.ubicacion}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Budget:</span>
                        <span className="info-value">{project.presupuesto}</span>
                      </div>
                    </div>

                    {project.estado !== 'completado' && (
                      <div className="project-progress">
                        <div className="progress-header">
                          <span className="progress-label">Progress</span>
                          <span className="progress-percentage">{project.progreso}%</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${project.progreso}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
