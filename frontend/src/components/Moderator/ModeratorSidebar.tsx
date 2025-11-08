import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Home, AlertCircle, CheckCircle, LogOut } from 'lucide-react';
import '../../styles/Moderator/ModeratorSidebar.css';

export const ModeratorSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const menuItems = [
    {
      path: '/moderador/dashboard',
      label: 'Dashboard',
      icon: Home
    },
    {
      path: '/moderador/incidencias',
      label: 'Incidencias',
      icon: AlertCircle
    },
    {
      path: '/moderador/verificaciones',
      label: 'Verificaciones',
      icon: CheckCircle
    }
  ];

  return (
    <aside className="moderator-sidebar">
      <div className="moderator-sidebar__header">
        <h2 className="moderator-sidebar__logo">ArquiPro</h2>
        <div className="moderator-sidebar__user">
          <p className="moderator-sidebar__role">Moderator</p>
          <p className="moderator-sidebar__access">Admin Access</p>
        </div>
      </div>

      <nav className="moderator-sidebar__nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`moderator-sidebar__link ${isActive ? 'moderator-sidebar__link--active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="moderator-sidebar__logout"
      >
        <LogOut size={20} />
        <span>Log Out</span>
      </button>
    </aside>
  );
};
