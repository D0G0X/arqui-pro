import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Star, FolderKanban, Eye, MapPin, MessageCircle, CheckCircle } from 'lucide-react'
import arquitectosService from '../services/api/arquitectosService'
import { useQuery } from '@apollo/client'
import { PERFIL_COMPLETO_ARQUITECTO } from '../services/graphql/queries'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import type { Arquitecto, Proyecto } from '../types'
import '../styles/ArquitectoProfile.css'

const AVATAR_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
  '#98D8C8', '#6C5CE7', '#FDA7DF', '#F8B500',
  '#95E1D3', '#F38181'
]

function ArquitectoProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation();

  const [arquitecto, setArquitecto] = useState<Arquitecto | null>(null)
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Usamos la consulta GraphQL en lugar de los servicios REST para obtener el perfil completo.
    // La actualización de vistas se hará vía REST (solo update) después de recibir los datos.
    const fetchFromGraphql = async () => {
      if (!id) return

      setLoading(true)
      setError(null)

      try {
        // La consulta se lanza fuera (useQuery) — aquí solo esperamos a que llegue 'data' via efecto
      } catch (err) {
        console.error('Error al preparar la carga del arquitecto:', err)
        setError('No se pudo preparar la información del arquitecto')
      } finally {
        setLoading(false)
      }
    }

    fetchFromGraphql()
  }, [id])

  // Query GraphQL: perfil completo
  const { data: gqlData, loading: gqlLoading, error: gqlError } = useQuery(PERFIL_COMPLETO_ARQUITECTO, {
    variables: { arquitectoId: id },
    skip: !id,
    fetchPolicy: 'network-only',
  })

  // Cuando llegan datos GraphQL, mapearlos a los estados locales usados por el componente
  useEffect(() => {
    const populateFromGql = async () => {
      if (!gqlData || !gqlData.perfilCompletoArquitecto) return

      const perfil = gqlData.perfilCompletoArquitecto

      // Soportar dos posibles shapes retornadas por el backend:
      // 1) { datosBasicos, estadisticas, proyectos, valoracionesRecientes }
      // 2) { arquitecto, usuario, proyectos, total_proyectos, valoracion_promedio }

      // Extraer usuario
      let usuarioObj: any = null
      if (perfil.datosBasicos) {
        usuarioObj = {
          nombre: perfil.datosBasicos.nombre,
          apellido: perfil.datosBasicos.apellido,
          email: perfil.datosBasicos.email,
          foto_perfil: perfil.datosBasicos.fotoPerfil || null,
        }
      } else if (perfil.usuario) {
        usuarioObj = {
          nombre: perfil.usuario.nombre,
          apellido: perfil.usuario.apellido,
          email: perfil.usuario.email,
          foto_perfil: perfil.usuario.foto_perfil || perfil.usuario.fotoPerfil || null,
        }
      }

      // Extraer arquitecto básico
      const arquitectoFromGql: any = {}
      if (perfil.datosBasicos) {
        arquitectoFromGql.descripcion = perfil.datosBasicos.descripcion || ''
        arquitectoFromGql.verificado = perfil.datosBasicos.verificado || false
        arquitectoFromGql.cedula = perfil.datosBasicos.cedula || ''
        arquitectoFromGql.especialidades = perfil.datosBasicos.especialidades || ''
        arquitectoFromGql.valoracion_prom_proyecto =
          perfil.estadisticas?.valoracionPromedio ?? perfil.valoracionPromedio ?? perfil.datosBasicos?.valoracionPromProyecto ?? perfil.datosBasicos?.valoracion_prom_proyecto ?? 0
        arquitectoFromGql.vistas_perfil =
          perfil.datosBasicos?.vistasPerfil ?? perfil.datosBasicos?.vistas_perfil ?? perfil.arquitecto?.vistasPerfil ?? perfil.arquitecto?.vistas_perfil ?? 0
      } else if (perfil.arquitecto) {
        arquitectoFromGql.descripcion = perfil.arquitecto.descripcion || ''
        arquitectoFromGql.verificado = perfil.arquitecto.verificado || false
        arquitectoFromGql.cedula = perfil.arquitecto.cedula || ''
        arquitectoFromGql.especialidades = perfil.arquitecto.especialidades || ''
        arquitectoFromGql.valoracion_prom_proyecto =
          perfil.arquitecto?.valoracionPromProyecto ?? perfil.arquitecto?.valoracion_prom_proyecto ?? perfil.valoracionPromedio ?? perfil.valoracion_promedio ?? 0
        arquitectoFromGql.vistas_perfil =
          perfil.arquitecto?.vistasPerfil ?? perfil.arquitecto?.vistas_perfil ?? 0
      }

      // Mapear proyectos: soportar campos en diferentes formatos
      const proyectosFromGql: Proyecto[] = (perfil.proyectos || []).map((p: any) => {
        const imagenes = (p.imagenes || []).map((img: any) => ({ imagen_url: img.imagenUrl || img.imagen_url }))
        return {
          id: String(p.id),
          titulo_proyecto: p.tituloProyecto || p.titulo_proyecto || p.titulo || '',
          descripcion: p.descripcion || '',
          tipo_proyecto: p.tipoProyecto || p.tipo_proyecto || p.tipo || '',
          valoracion_promedio: p.valoracionPromedio ?? p.valoracion_promedio ?? 0,
          imagenes,
          avances: p.avances || [],
          arquitecto_id: String(p.arquitectoId || p.arquitecto_id || id),
        } as Proyecto
      })

      // Construir objeto arquitecto compatible con el componente
      const arquitectoState: any = {
        usuario: usuarioObj,
        descripcion: arquitectoFromGql.descripcion,
        verificado: arquitectoFromGql.verificado,
        cedula: arquitectoFromGql.cedula,
        especialidades: arquitectoFromGql.especialidades,
        valoracion_prom_proyecto: arquitectoFromGql.valoracion_prom_proyecto,
        vistas_perfil: arquitectoFromGql.vistas_perfil || 0,
      }

      setArquitecto(arquitectoState)
      setProyectos(proyectosFromGql)

      // Actualizar vistas vía REST: solo la actualización
      try {
        const currentViews = arquitectoState.vistas_perfil ?? 0
        // Llamada REST para incrementar vistas en backend
        await arquitectosService.update(String(id), { vistas_perfil: currentViews + 1 })
        // actualizar estado local para reflejar incremento inmediato
        setArquitecto((prev: any) => prev ? { ...prev, vistas_perfil: currentViews + 1 } : prev)
      } catch (e) {
        console.warn('No se pudo actualizar vistas vía REST:', e)
      }
    }

    populateFromGql()
  }, [gqlData, id])

  const getAvatarColor = (name: string) => {
    const index = name.charCodeAt(0) % AVATAR_COLORS.length
    return AVATAR_COLORS[index]
  }

  const getProyectoImage = (proyecto: Proyecto): string => {
    // Primero intentar obtener imagen del proyecto
    if (proyecto.imagenes && proyecto.imagenes.length > 0) {
      return proyecto.imagenes[0].imagen_url
    }

    // Si no hay imágenes del proyecto, buscar en avances
    if (proyecto.avances && proyecto.avances.length > 0) {
      for (const avance of proyecto.avances) {
        if (avance.imagenes && avance.imagenes.length > 0) {
          return avance.imagenes[0].imagen_url
        }
      }
    }

    // Imagen por defecto si no hay nada
    return '/placeholder-project.jpg'
  }

  const handleContactar = () => {
    // TODO: Implementar navegación a conversación
    console.log('Contactar arquitecto:', arquitecto?.id)
    // navigate(`/conversacion/${arquitecto?.id}`)
    alert('La funcionalidad de conversación estará disponible próximamente')
  }

  const handleProyectoClick = (proyectoId: string) => {
    if(location.pathname === `/architect/${id}`){
        navigate(`/proyecto/${proyectoId}`)
    }else{
        navigate(`/cliente/proyecto/${proyectoId}`)
    }
  }

  if (loading || gqlLoading) {
    return (
      <div className="arquitecto-profile-container">
        <LoadingSpinner />
      </div>
    )
  }
  if (error || gqlError || !arquitecto) {
    return (
      <div className="arquitecto-profile-container">
        <ErrorMessage message={error || 'Arquitecto no encontrado'} />
      </div>
    )
  }

  const nombreCompleto = arquitecto.usuario 
    ? `${arquitecto.usuario.nombre} ${arquitecto.usuario.apellido}`
    : 'Arquitecto'
  
  const iniciales = arquitecto.usuario
    ? `${arquitecto.usuario.nombre[0]}${arquitecto.usuario.apellido[0]}`
    : 'AR'

  const especialidadesList = arquitecto.especialidades
    ? arquitecto.especialidades.split(',').map(esp => esp.trim())
    : []

  const avatarColor = getAvatarColor(nombreCompleto)

  return (
    <div className="arquitecto-profile-container">
      <div className="arquitecto-profile-content">
        {/* Sidebar Izquierdo - Información del Arquitecto */}
        <div className="profile-sidebar">
          {/* Avatar y Nombre */}
          <div className="sidebar-header">
            <div className="profile-avatar-large" style={{ backgroundColor: avatarColor }}>
              {arquitecto.usuario?.foto_perfil ? (
                <img src={arquitecto.usuario.foto_perfil} alt={nombreCompleto} />
              ) : (
                <span className="avatar-initials-large">{iniciales}</span>
              )}
            </div>

            <h1 className="profile-name">{nombreCompleto}</h1>
            
            {arquitecto.verificado && (
              <span className="verified-badge">
                <CheckCircle size={18} />
                Verificado
              </span>
            )}
          </div>

          {/* Estadísticas */}
          <div className="profile-stats">
            <div className="stat-item">
              <Star className="stat-icon" size={28} />
              <span className="stat-value">{arquitecto.valoracion_prom_proyecto.toFixed(1)}</span>
              <span className="stat-label">Valoración</span>
            </div>
            <div className="stat-item">
              <FolderKanban className="stat-icon" size={28} />
              <span className="stat-value">{proyectos.length}</span>
              <span className="stat-label">Proyectos</span>
            </div>
            <div className="stat-item">
              <Eye className="stat-icon" size={28} />
                <span className="stat-value">{arquitecto.vistas_perfil}</span>
                <span className="stat-label">Vistas</span>
              </div>
          </div>

          {/* Ubicación */}
          {arquitecto.ubicacion && (
            <div className="sidebar-section">
              <div className="profile-location">
                <MapPin className="location-icon" size={20} />
                <span>{arquitecto.ubicacion}</span>
              </div>
            </div>
          )}

          {/* Botón Contactar */}
          <button className="contact-button" onClick={handleContactar}>
            <MessageCircle size={20} />
            Contactar Arquitecto
          </button>

          {/* Especialidades */}
          {especialidadesList.length > 0 && (
            <div className="sidebar-section">
              <h3 className="sidebar-title">Especialidades</h3>
              <div className="especialidades-list">
                {especialidadesList.map((especialidad, index) => (
                  <span key={index} className="especialidad-tag">
                    {especialidad}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Descripción */}
          {arquitecto.descripcion && (
            <div className="sidebar-section">
              <h3 className="sidebar-title">Acerca de</h3>
              <p className="profile-description">{arquitecto.descripcion}</p>
            </div>
          )}

          {/* Información Profesional */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Información Profesional</h3>
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">Cédula Profesional</span>
                <span className="info-value">{arquitecto.cedula}</span>
              </div>
              {arquitecto.usuario?.email && (
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{arquitecto.usuario.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Área Principal - Proyectos */}
        <div className="profile-main">
          <div className="main-header">
            <h2 className="section-title">
              Portafolio
            </h2>
            <span className="proyectos-count">
              {proyectos.length} {proyectos.length === 1 ? 'Proyecto' : 'Proyectos'}
            </span>
          </div>
          
          {proyectos.length > 0 ? (
            <div className="proyectos-grid">
              {proyectos.map((proyecto) => (
                <div
                  key={proyecto.id}
                  className="proyecto-card"
                  onClick={() => handleProyectoClick(proyecto.id)}
                >
                  <div className="proyecto-image">
                    <img src={getProyectoImage(proyecto)} alt={proyecto.titulo_proyecto} />
                    <div className="proyecto-overlay">
                      <h3 className="proyecto-titulo">{proyecto.titulo_proyecto}</h3>
                      {proyecto.tipo_proyecto && (
                        <span className="proyecto-tipo">{proyecto.tipo_proyecto}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-proyectos">
              <p>Este arquitecto aún no ha publicado proyectos en su portafolio.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ArquitectoProfile
