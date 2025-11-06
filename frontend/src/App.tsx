import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import apolloClient from './services/graphql/apolloClient'
import { AuthProvider } from './contexts/AuthContext'
import ErrorBoundary from './components/common/ErrorBoundary'
import Home from './pages/Home'
import FindArchitects from './pages/FindArchitects'
import AboutUs from './pages/AboutUs'
import LoginPage from './pages/auth/LoginPage'
import RegistroClientePage from './pages/auth/RegistroClientePage'
import RegistroArquitectoPage from './pages/auth/RegistroArquitectoPage'
import RegistroModeradorPage from './pages/auth/RegistroModeradorPage'

import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ApolloProvider client={apolloClient}>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/architects" element={<FindArchitects />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/login" element={<LoginPage/>}/>
              <Route path="/registro-cliente" element={<RegistroClientePage/>}/>
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
