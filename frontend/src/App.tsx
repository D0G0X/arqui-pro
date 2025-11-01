import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import apolloClient from './services/graphql/apolloClient'
import Home from './pages/Home'
import FindArchitects from './pages/FindArchitects'
import AboutUs from './pages/AboutUs'
import './App.css'

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/architects" element={<FindArchitects />} />
          <Route path="/about" element={<AboutUs />} />
        </Routes>
      </Router>
    </ApolloProvider>
  )
}

export default App
