import { memo } from 'react'
import type { Arquitecto } from '../../types'
import { AVATAR_COLORS } from '../../config/constants'
import { getInitials, getAvatarColor } from '../../utils/formatters'
import '../../styles/ArquitectoCard.css'

interface ArquitectoCardProps {
  arquitecto: Arquitecto
}

const ArquitectoCard = memo(function ArquitectoCard({ arquitecto }: ArquitectoCardProps) {
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
  
  // Iniciales para avatar usando utilidad
  const iniciales = usuario 
    ? getInitials(usuario.nombre || '', usuario.apellido || '')
    : (ubicacion && ubicacion.length >= 2 ? ubicacion.substring(0, 2).toUpperCase() : 'AR')
  
  const fotoPerfil = usuario?.foto_perfil
  
  // Generar color basado en el nombre usando utilidad
  const avatarColor = getAvatarColor(nombreCompleto, AVATAR_COLORS)

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
        <span className="rating-star" aria-hidden="true">⭐</span>
        <span className="rating-value">{rating.toFixed(1)}</span>
        <span className="sr-only">Rating: {rating.toFixed(1)} out of 5</span>
      </div>
    </div>
  )
})

export default ArquitectoCard
