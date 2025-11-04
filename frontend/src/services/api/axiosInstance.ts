import axios from 'axios'
import { API_CONFIG, getAuthToken } from '../../config/api.config'

const axiosInstance = axios.create({
  baseURL: API_CONFIG.REST_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor para agregar token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
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
