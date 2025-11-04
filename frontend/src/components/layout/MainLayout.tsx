import { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

interface MainLayoutProps {
  children: ReactNode
}

/**
 * Layout principal que envuelve todas las páginas
 * Incluye Header y Footer comunes
 */
function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
