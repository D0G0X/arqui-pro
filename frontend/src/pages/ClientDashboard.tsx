import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Home, FolderOpen, MessageCircle, Search, Settings } from 'lucide-react';
import arquitectosService from '../services/api/arquitectosService';
import type { Arquitecto } from '../types';
import { getInitials, getAvatarColor } from '../utils/formatters';
import { AVATAR_COLORS } from '../config/constants';
import '../styles/ClientDashboard.css';

interface ProjectRequest {
  id: string;
  titulo: string;
  estado: 'Active' | 'Awaiting Info' | 'Closed';
  descripcion: string;
  fecha: string;
}

interface RecentProject {
  id: string;
  titulo: string;
  imagen?: string;
  arquitecto: string;
}

export default function ClientDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [recommendedArchitects, setRecommendedArchitects] = useState<Arquitecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'home' | 'projects' | 'messages' | 'find'>('home');

  // Datos de ejemplo para solicitudes y proyectos
  const [projectRequests] = useState<ProjectRequest[]>([
    {
      id: '1',
      titulo: 'Kitchen Renovation',
      estado: 'Active',
      descripcion: 'Status: Reviewing Proposals',
      fecha: '3 days ago'
    },
    {
      id: '2',
      titulo: 'New Home Build',
      estado: 'Awaiting Info',
      descripcion: 'Status: Architect requires more info',
      fecha: '2 weeks ago'
    },
    {
      id: '3',
      titulo: 'Office Space Design',
      estado: 'Closed',
      descripcion: 'Status: Architect Hired',
      fecha: '1 month ago'
    }
  ]);

  const [recentProjects] = useState<RecentProject[]>([
    {
      id: '1',
      titulo: 'Modern Villa',
      arquitecto: 'Alexandre Dubois'
    },
    {
      id: '2',
      titulo: 'Corporate HQ',
      arquitecto: 'Isabella Rossi'
    }
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchRecommendedArchitects = async () => {
      try {
        setLoading(true);
        const response = await arquitectosService.getVerificados();
        // Tomar los primeros 3 con mejor valoración
        const sorted = response.arquitectos
          .sort((a, b) => (b.valoracion_prom_proyecto || 0) - (a.valoracion_prom_proyecto || 0))
          .slice(0, 3);
        setRecommendedArchitects(sorted);
      } catch (error) {
        console.error('Error fetching architects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedArchitects();
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'Active':
        return '#28a745';
      case 'Awaiting Info':
        return '#ffc107';
      case 'Closed':
        return '#6c757d';
      default:
        return '#6c757d';
    }
  };

  const getStatusBg = (estado: string) => {
    switch (estado) {
      case 'Active':
        return '#d4edda';
      case 'Awaiting Info':
        return '#fff3cd';
      case 'Closed':
        return '#e9ecef';
      default:
        return '#e9ecef';
    }
  };

  return (
    <div className="client-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <span className="logo-icon">🏛️</span>
            <span className="logo-text">ArquiPro</span>
          </div>
          <div className="welcome-section">
            <h1>Welcome Back, Client!</h1>
            <div className="user-profile">
              <div className="user-avatar" style={{ backgroundColor: getAvatarColor(user.nombre || '', AVATAR_COLORS) }}>
                {user.foto_perfil ? (
                  <img src={user.foto_perfil} alt={user.nombre} />
                ) : (
                  <span>{getInitials(user.nombre || '', user.apellido || '')}</span>
                )}
              </div>
              <div className="user-info">
                <p className="user-name">{user.nombre} {user.apellido}</p>
                <p className="user-email">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeSection === 'home' ? 'active' : ''}`}
              onClick={() => setActiveSection('home')}
            >
              <Home size={20} />
              <span>Home</span>
            </button>
            <button
              className={`nav-item ${activeSection === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveSection('projects')}
            >
              <FolderOpen size={20} />
              <span>Projects</span>
            </button>
            <button
              className={`nav-item ${activeSection === 'messages' ? 'active' : ''}`}
              onClick={() => {
                setActiveSection('messages');
                navigate('/client/chat');
              }}
            >
              <MessageCircle size={20} />
              <span>Messages</span>
            </button>
            <button
              className={`nav-item ${activeSection === 'find' ? 'active' : ''}`}
              onClick={() => {
                setActiveSection('find');
                navigate('/architects');
              }}
            >
              <Search size={20} />
              <span>Find Architects</span>
            </button>
          </nav>
          <div className="sidebar-footer">
            <button className="settings-btn">
              <Settings size={20} />
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          {/* Recommended Architects */}
          <section className="dashboard-section">
            <h2 className="section-title">Recommended Architects</h2>
            <div className="architects-grid">
              {loading ? (
                <p>Loading architects...</p>
              ) : recommendedArchitects.length > 0 ? (
                recommendedArchitects.map((arquitecto) => {
                  const nombreCompleto = arquitecto.usuario
                    ? `${arquitecto.usuario.nombre} ${arquitecto.usuario.apellido}`
                    : 'Arquitecto';
                  const iniciales = arquitecto.usuario
                    ? getInitials(arquitecto.usuario.nombre || '', arquitecto.usuario.apellido || '')
                    : 'AR';
                  const avatarColor = getAvatarColor(nombreCompleto, AVATAR_COLORS);
                  const rating = arquitecto.valoracion_prom_proyecto || 0;

                  return (
                    <div key={arquitecto.id} className="architect-card-small">
                      <div className="architect-avatar-small" style={{ backgroundColor: avatarColor }}>
                        {arquitecto.usuario?.foto_perfil ? (
                          <img src={arquitecto.usuario.foto_perfil} alt={nombreCompleto} />
                        ) : (
                          <span>{iniciales}</span>
                        )}
                      </div>
                      <h3 className="architect-name-small">{nombreCompleto}</h3>
                      <div className="architect-rating-small">
                        <span className="star">⭐</span>
                        <span>{rating.toFixed(1)}</span>
                      </div>
                      <button
                        className="view-profile-btn"
                        onClick={() => navigate(`/arquitecto/${arquitecto.id}`)}
                      >
                        View Profile
                      </button>
                    </div>
                  );
                })
              ) : (
                <p>No recommended architects available</p>
              )}
            </div>
          </section>

          {/* Recent Project Requests */}
          <section className="dashboard-section">
            <h2 className="section-title">Recent Project Requests</h2>
            <div className="project-requests-list">
              {projectRequests.map((request) => (
                <div key={request.id} className="project-request-card">
                  <div className="request-header">
                    <h3 className="request-title">{request.titulo}</h3>
                    <span
                      className="request-status"
                      style={{
                        backgroundColor: getStatusBg(request.estado),
                        color: getStatusColor(request.estado)
                      }}
                    >
                      {request.estado}
                    </span>
                  </div>
                  <p className="request-description">{request.descripcion}</p>
                  <p className="request-date">Posted {request.fecha}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Projects */}
          <section className="dashboard-section">
            <h2 className="section-title">Recent Projects</h2>
            <div className="recent-projects-grid">
              {recentProjects.map((project) => (
                <div key={project.id} className="project-card">
                  <div className="project-image-placeholder">
                    {project.imagen ? (
                      <img src={project.imagen} alt={project.titulo} />
                    ) : (
                      <div className="placeholder-image">🏗️</div>
                    )}
                  </div>
                  <div className="project-info">
                    <h3 className="project-title">{project.titulo}</h3>
                    <p className="project-architect">by {project.arquitecto}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

