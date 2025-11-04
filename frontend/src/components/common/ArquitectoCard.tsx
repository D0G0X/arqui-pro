import type { Arquitecto } from '../../types'
import '../../styles/ArquitectoCard.css'

interface ArquitectoCardProps {
  arquitecto: Arquitecto
}

// Colores aleatorios para avatares
const AVATAR_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
  '#98D8C8', '#6C5CE7', '#FDA7DF', '#F8B500',
  '#95E1D3', '#F38181'
]

function ArquitectoCard({ arquitecto }: ArquitectoCardProps) {
  // Usamos los campos REALES que devuelve la API de Rails
  const {
    usuario,
    cedula,
    valoracion_prom_proyecto,
    descripcion,
    especialidades,
    ubicacion
  } = arquitecto
  
  // Obtener nombre: desde usuario o usar ubicación como fallback
  const nombreCompleto = usuario 
    ? `${usuario.nombre} ${usuario.apellido}` 
    : (ubicacion || `Arq. ${cedula?.substring(0, 4) || 'Profesional'}`)
  
  // Iniciales para avatar
  const iniciales = usuario 
    ? `${usuario.nombre?.[0] || ''}${usuario.apellido?.[0] || ''}` 
    : (ubicacion && ubicacion.length >= 2 ? ubicacion.substring(0, 2).toUpperCase() : 'AR')
  
  const fotoPerfil = usuario?.foto_perfil
  
  // Generar color basado en el nombre
  const getAvatarColor = (name: string) => {
    const index = name.charCodeAt(0) % AVATAR_COLORS.length
    return AVATAR_COLORS[index]
  }

  const avatarColor = getAvatarColor(nombreCompleto)
  const rating = valoracion_prom_proyecto || 0
  
  // Especialidades viene como string separado por comas
  const especialidadPrincipal = especialidades 
    ? especialidades.split(',')[0].trim() 
    : 'Arquitecto'

  return (
    <div className="arquitecto-card">
      <div className="arquitecto-avatar" style={{ backgroundColor: avatarColor }}>
        {fotoPerfil ? (
          <img src={fotoPerfil} alt={nombreCompleto} />
        ) : (
          <span className="avatar-initials">{iniciales}</span>
        )}
      </div>
      
      <h3 className="arquitecto-name">{nombreCompleto}</h3>
      <p className="arquitecto-specialty">{especialidadPrincipal}</p>
      
      {descripcion && (
        <p className="arquitecto-description">{descripcion}</p>
      )}
      
      <div className="arquitecto-rating">
        <span className="rating-star">⭐</span>
        <span className="rating-value">{rating.toFixed(1)}</span>
      </div>
    </div>
  )
}

export default ArquitectoCard
