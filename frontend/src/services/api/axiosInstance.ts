import axios from 'axios'
import { API_CONFIG, getAuthToken } from '../../config/api.config'

const axiosInstance = axios.create({
  baseURL: API_CONFIG.REST_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor para agregar token y user ID
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Agregar X-User-ID para validaciones de seguridad en el backend
    const userData = localStorage.getItem('user_data')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        if (user.id) {
          config.headers['X-User-ID'] = user.id
          console.log('🔑 Agregando X-User-ID al request:', user.id, 'URL:', config.url)
        } else {
          console.warn('⚠️ user.id no encontrado en user_data')
        }
      } catch (error) {
        console.error('❌ Error parsing user_data:', error)
      }
    } else {
      console.warn('⚠️ No hay user_data en localStorage')
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor para manejar errores
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
