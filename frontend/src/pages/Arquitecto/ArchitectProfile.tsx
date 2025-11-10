import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import arquitectosService from '../../services/api/arquitectosService';
import type { Arquitecto } from '../../types';
import type { Proyecto } from '../../types';
import { getInitials, getAvatarColor } from '../../utils/formatters';
import { AVATAR_COLORS } from '../../config/constants';
import '../../styles/ArchitectProfile.css';

export default function ArchitectProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [arquitecto, setArquitecto] = useState<Arquitecto | null>(null);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArquitecto = async () => {
      if (!id) {
        setError('ID de arquitecto no proporcionado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await arquitectosService.getById(id);
        setArquitecto(data);
        
        // Simular proyectos del portafolio (en producción, esto vendría de la API)
        const proyectosSimulados: Proyecto[] = [
          {
            id: '1',
            titulo_proyecto: 'Modern Villa',
            descripcion: 'Contemporary house with large windows',
            tipo_proyecto: 'portafolio',
            fecha_publicacion: new Date('2024-01-15'),
            valoracion_promedio: 4.8,
            arquitecto_id: id,
            cliente_id: null
          },
          {
            id: '2',
            titulo_proyecto: 'Corporate HQ',
            descripcion: 'Modern glass-fronted office building',
            tipo_proyecto: 'portafolio',
            fecha_publicacion: new Date('2024-02-20'),
            valoracion_promedio: 4.6,
            arquitecto_id: id,
            cliente_id: null
          },
          {
            id: '3',
            titulo_proyecto: 'Urban Loft',
            descripcion: 'Spacious high-ceiling loft interior',
            tipo_proyecto: 'portafolio',
            fecha_publicacion: new Date('2024-03-10'),
            valoracion_promedio: 4.7,
            arquitecto_id: id,
            cliente_id: null
          },
          {
            id: '4',
            titulo_proyecto: 'Community Center',
            descripcion: 'Modern interior with wooden slatted walls',
            tipo_proyecto: 'portafolio',
            fecha_publicacion: new Date('2024-04-05'),
            valoracion_promedio: 4.9,
            arquitecto_id: id,
            cliente_id: null
          },
          {
            id: '5',
            titulo_proyecto: 'Historic Townhouse',
            descripcion: 'Bright minimalist interior with modern staircase',
            tipo_proyecto: 'portafolio',
            fecha_publicacion: new Date('2024-05-12'),
            valoracion_promedio: 4.5,
            arquitecto_id: id,
            cliente_id: null
          },
          {
            id: '6',
            titulo_proyecto: 'Luxury Hotel Lobby',
            descripcion: 'Grand hotel lobby with high ceilings',
            tipo_proyecto: 'portafolio',
            fecha_publicacion: new Date('2024-06-18'),
            valoracion_promedio: 4.8,
            arquitecto_id: id,
            cliente_id: null
          },
          {
            id: '7',
            titulo_proyecto: 'Art Museum Facade',
            descripcion: 'Contemporary museum with angular concrete walls',
            tipo_proyecto: 'portafolio',
            fecha_publicacion: new Date('2024-07-22'),
            valoracion_promedio: 4.7,
            arquitecto_id: id,
            cliente_id: null
          },
          {
            id: '8',
            titulo_proyecto: 'Scandinavian Kitchen',
            descripcion: 'Minimalist kitchen with light wood cabinetry',
            tipo_proyecto: 'portafolio',
            fecha_publicacion: new Date('2024-08-30'),
            valoracion_promedio: 4.6,
            arquitecto_id: id,
            cliente_id: null
          },
          {
            id: '9',
            titulo_proyecto: 'Rooftop Garden',
            descripcion: 'Lush green rooftop garden with seating areas',
            tipo_proyecto: 'portafolio',
            fecha_publicacion: new Date('2024-09-14'),
            valoracion_promedio: 4.9,
            arquitecto_id: id,
            cliente_id: null
          }
        ];
        setProyectos(proyectosSimulados);
      } catch (err: any) {
        setError(err.message || 'Error al cargar el perfil del arquitecto');
      } finally {
        setLoading(false);
      }
    };

    fetchArquitecto();
  }, [id]);

  const handleContact = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // Aquí se podría abrir un modal de contacto o redirigir al chat
    alert('Funcionalidad de contacto próximamente');
  };

  if (loading) {
    return (
      <div className="architect-profile-loading">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (error || !arquitecto) {
    return (
      <div className="architect-profile-error">
        <p>{error || 'Arquitecto no encontrado'}</p>
        <button onClick={() => navigate('/architects')}>Volver a arquitectos</button>
      </div>
    );
  }

  const nombreCompleto = arquitecto.usuario
    ? `${arquitecto.usuario.nombre} ${arquitecto.usuario.apellido}`
    : 'Arquitecto';
  const iniciales = arquitecto.usuario
    ? getInitials(arquitecto.usuario.nombre || '', arquitecto.usuario.apellido || '')
    : 'AR';
  const avatarColor = getAvatarColor(nombreCompleto, AVATAR_COLORS);
  const especialidades = arquitecto.especialidades
    ? arquitecto.especialidades.split(',').map(s => s.trim())
    : [];
  const ubicacion = 'Location not specified'; // Se puede obtener del perfil del arquitecto si existe

  return (
    <div className="architect-profile-page">
      {/* Header */}
      <header className="profile-header">
        <div className="ap-header-container">
          <div className="logo-section">
            <span className="logo-icon">🏛️</span>
            <span className="logo-text">ArquiPro</span>
          </div>
          <nav className="header-nav">
            <button onClick={() => navigate('/')} className="nav-link">Home</button>
            <button onClick={() => navigate('/architects')} className="nav-link">Find Architects</button>
            <button onClick={() => navigate('/about')} className="nav-link">About</button>
            <button onClick={() => navigate('/about')} className="nav-link">Blog</button>
          </nav>
          <div className="header-auth">
            {isAuthenticated ? (
              <button onClick={() => navigate('/client/dashboard')} className="login-btn">Dashboard</button>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="login-btn">LOG IN</button>
                <button onClick={() => navigate('/registro-cliente')} className="signup-btn">SIGN UP</button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <div className="profile-content">
        {/* Left Panel - Architect Info */}
        <aside className="architect-info-panel">
          <div className="architect-avatar-large" style={{ backgroundColor: avatarColor }}>
            {arquitecto.usuario?.foto_perfil ? (
              <img src={arquitecto.usuario.foto_perfil} alt={nombreCompleto} />
            ) : (
              <span>{iniciales}</span>
            )}
          </div>
          <h1 className="architect-name-large">{nombreCompleto}</h1>
          <p className="architect-title">{ubicacion}</p>
          {arquitecto.descripcion && (
            <p className="architect-description">{arquitecto.descripcion}</p>
          )}
          <div className="architect-specialties">
            {especialidades.map((especialidad, index) => (
              <span key={index} className="specialty-tag">{especialidad}</span>
            ))}
          </div>
          <button className="contact-button" onClick={handleContact}>
            Contact Architect
          </button>
        </aside>

        {/* Right Panel - Portfolio */}
        <main className="portfolio-panel">
          <h2 className="portfolio-title">Portfolio</h2>
          <div className="projects-grid">
            {proyectos.map((proyecto) => (
              <div key={proyecto.id} className="project-card">
                <div className="project-image">
                  <div className="project-placeholder">
                    🏗️
                  </div>
                </div>
                <div className="project-details">
                  <h3 className="project-name">{proyecto.titulo_proyecto}</h3>
                  <p className="project-date">
                    {new Date(2023 - Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

