import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import { useEffect } from 'react'
import apolloClient from './services/graphql/apolloClient'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { notificationService } from './services/websocket/notificationService'
import ErrorBoundary from './components/common/ErrorBoundary'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Home from './pages/Home'
import FindArchitects from './pages/FindArchitects'
import AboutUs from './pages/AboutUs'
import LoginPage from './pages/auth/LoginPage'
import RegistroClientePage from './pages/auth/RegistroClientePage'
import RegistroArquitectoPage from './pages/auth/RegistroArquitectoPage'
import RegistroModeradorPage from './pages/auth/RegistroModeradorPage'

import { ModeratorDashboard, Verificaciones, Incidencias } from './pages/Moderator'
import ClienteLayout from './components/layout/Cliente/ClienteLayout'
import ClienteHome from './pages/Cliente/ClienteHomePage'
import ArquitectoProfile from './pages/ArquitectoProfile'
import './App.css'
import MainLayout from './components/layout/MainLayout'
// Componente interno para manejar WebSocket
function WebSocketManager() {
  const { user } = useAuth()

  useEffect(() => {
    // Solo conectar si el usuario es moderador
    if (user && user.rol === 'moderador') {
      notificationService.connect(Number(user.id), user.rol)

      // Cleanup al desmontar
      return () => {
        notificationService.disconnect()
      }
    }
  }, [user])

  return null
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ApolloProvider client={apolloClient}>
          <Router>
            <WebSocketManager />
            <Routes>
              {/* Rutas Públicas */}
              <Route path="/" element={<MainLayout children={<Home/>} />} />
              <Route path="/architects" element={<MainLayout children={<FindArchitects />}/>} />
              <Route path="/about" element={<MainLayout children={<AboutUs />}/>} />
              <Route path="/architects/:id" element={<MainLayout children={<ArquitectoProfile />}/>} />

              <Route path="/login" element={<LoginPage/>}/>
              <Route path="/registro-cliente" element={<RegistroClientePage/>}/>
              <Route path="/registro-arquitecto" element={<RegistroArquitectoPage/>}/>
              <Route path="/registro-moderador" element={<RegistroModeradorPage/>}/>
              
              {/* Rutas Protegidas - Cliente */}
              <Route 
                path="/cliente" 
                element={
                  <ProtectedRoute requiredRole="cliente">
                    <ClienteLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/cliente/home" element={<ClienteHome />} />
                <Route path="/cliente/find-arquitectos" element={<FindArchitects />} />
                <Route path="/cliente/arquitecto/:id" element={<ArquitectoProfile />} />
              </Route>

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
