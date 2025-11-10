import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import { useEffect } from 'react'
import apolloClient from './services/graphql/apolloClient'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { notificationService } from './services/notificationService'
import ErrorBoundary from './components/common/ErrorBoundary'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Home from './pages/Home'
import FindArchitects from './pages/FindArchitects'
import AboutUs from './pages/AboutUs'
import LoginPage from './pages/auth/LoginPage'
import RegistroClientePage from './pages/auth/RegistroClientePage'
import RegistroArquitectoPage from './pages/auth/RegistroArquitectoPage'
import RegistroModeradorPage from './pages/auth/RegistroModeradorPage'
import ChatExample from './pages/ChatExample'
import ClientDashboard from './pages/ClientDashboard'
import ArchitectProfile from './pages/ArchitectProfile'
import ClientChat from './pages/ClientChat'
import ClientProjectRating from './pages/ClientProjectRating'
import ArchitectDashboard from './pages/ArchitectDashboard'
import ArchitectChat from './pages/ArchitectChat'
import CreateProject from './pages/CreateProject'
import ArchitectProjectDetail from './pages/ArchitectProjectDetail'

import { ModeratorDashboard, Verificaciones, Incidencias } from './pages/Moderator'
import './App.css'

// Componente interno para manejar WebSocket y notificaciones
function WebSocketManager() {
  const { user } = useAuth()

  useEffect(() => {
    // Solicitar permiso para notificaciones cuando la app carga
    notificationService.requestPermission()
  }, [])

  useEffect(() => {
    // Solo conectar si el usuario es moderador
    if (user && user.rol === 'moderador') {
      // notificationService.connect(Number(user.id), user.rol)
      console.log('WebSocket connection disabled temporarily')

      // Cleanup al desmontar
      return () => {
        // notificationService.disconnect()
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
              <Route path="/" element={<Home />} />
              <Route path="/architects" element={<FindArchitects />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/login" element={<LoginPage/>}/>
              <Route path="/registro-cliente" element={<RegistroClientePage/>}/>
              
              {/* Ruta de Ejemplo - Chat y Notificaciones */}
              <Route path="/chat-example" element={<ChatExample />} />
              
              {/* Rutas Protegidas - Cliente */}
              <Route 
                path="/client/dashboard" 
                element={
                  <ProtectedRoute requiredRole="cliente">
                    <ClientDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/client/chat" 
                element={
                  <ProtectedRoute requiredRole="cliente">
                    <ClientChat />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/client/project/:projectId/rate" 
                element={
                  <ProtectedRoute requiredRole="cliente">
                    <ClientProjectRating />
                  </ProtectedRoute>
                } 
              />
              
              {/* Rutas Públicas - Perfil de Arquitecto */}
              <Route path="/arquitecto/:id" element={<ArchitectProfile />} />
              
              {/* Rutas Protegidas - Arquitecto */}
              <Route 
                path="/arquitecto/profile" 
                element={
                  <ProtectedRoute requiredRole="arquitecto">
                    <ArchitectDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/arquitecto/chat" 
                element={
                  <ProtectedRoute requiredRole="arquitecto">
                    <ArchitectChat />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/arquitecto/create-project" 
                element={
                  <ProtectedRoute requiredRole="arquitecto">
                    <CreateProject />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/arquitecto/project/:id" 
                element={
                  <ProtectedRoute requiredRole="arquitecto">
                    <ArchitectProjectDetail />
                  </ProtectedRoute>
                } 
              />
              
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
              <Route path="/registro-arquitecto" element={<RegistroArquitectoPage/>}/>
              <Route path="/registro-moderador" element={<RegistroModeradorPage/>}/>
            </Routes>
          </Router>
        </ApolloProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
