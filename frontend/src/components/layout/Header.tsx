import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import '../../styles/Header.css'

function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : ''
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🏛️</span>
          <span className="logo-text">ArquiPro</span>
        </Link>
        
        <nav className="nav-menu">
          <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
          <Link to="/architects" className={`nav-link ${isActive('/architects')}`}>Find Architects</Link>
          <Link to="/about" className={`nav-link ${isActive('/about')}`}>About Us</Link>
          {isAuthenticated && user?.rol === 'moderador' && (
            <Link to="/moderador/dashboard" className={`nav-link ${isActive('/moderador/dashboard')}`}>
              Moderador
            </Link>
          )}
        </nav>

        <div className="auth-buttons">
          {isAuthenticated ? (
            <>
              <span className="user-greeting">Hi, {user?.nombre}!</span>
              <button onClick={handleLogout} className="login-btn">
                LOG OUT
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => navigate('/registro-cliente')} 
                className="signin-btn"
                aria-label="Registrarse como cliente"
              >
                SIGN IN
              </button>
              <button 
                onClick={() => navigate('/login')} 
                className="login-btn"
                aria-label="Iniciar sesión"
              >
                LOG IN
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
