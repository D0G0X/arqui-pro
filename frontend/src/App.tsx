import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import apolloClient from './services/graphql/apolloClient'
import { AuthProvider } from './contexts/AuthContext'
import ErrorBoundary from './components/common/ErrorBoundary'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Home from './pages/Home'
import FindArchitects from './pages/FindArchitects'
import AboutUs from './pages/AboutUs'
import LoginPage from './pages/auth/LoginPage'
import RegistroClientePage from './pages/auth/RegistroCliente'

import { ModeratorDashboard, Verificaciones, Incidencias } from './pages/Moderator'
import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ApolloProvider client={apolloClient}>
          <Router>
            <Routes>
              {/* Rutas Públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/architects" element={<FindArchitects />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/login" element={<LoginPage/>}/>
              <Route path="/registro-cliente" element={<RegistroClientePage/>}/>
              
              {/* Rutas Protegidas - Moderador */}
              <Route 
                path="/moderador/dashboard" 
                element={
                  <ProtectedRoute requiredRole="moderador">
                    <ModeratorDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/moderador/verificaciones" 
                element={
                  <ProtectedRoute requiredRole="moderador">
                    <Verificaciones />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/moderador/incidencias" 
                element={
                  <ProtectedRoute requiredRole="moderador">
                    <Incidencias />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Router>
        </ApolloProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
