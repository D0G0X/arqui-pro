import { Link, useLocation } from 'react-router-dom'
import '../../styles/Header.css'

function Header() {
  const location = useLocation()

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
          <button className="signin-btn">SIGN IN</button>
          <button className="login-btn">LOG IN</button>
        </div>
      </div>
    </header>
  )
}

export default Header
