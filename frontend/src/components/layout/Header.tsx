import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import '../../styles/Header.css'

function Header() {
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuth()

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : ''
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
        </nav>

        <div className="auth-buttons">
          {isAuthenticated ? (
            <>
              <span className="user-greeting">Hi, {user?.nombre}!</span>
              <button onClick={logout} className="login-btn">
                LOG OUT
              </button>
            </>
          ) : (
            <>
              <button className="signin-btn">SIGN IN</button>
              <button className="login-btn">LOG IN</button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
