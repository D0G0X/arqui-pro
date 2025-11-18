import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Star, FolderKanban, Eye, MapPin, MessageCircle, CheckCircle } from 'lucide-react'
import { AlertTriangle } from 'lucide-react'
import arquitectosService from '../../services/api/arquitectosService'
import conversacionesService from '../../services/api/conversacionesService'
import incidenciasService from '../../services/api/incidenciasService'
import imagenesService from '../../services/api/imagenesService'
import supabaseStorage from '../../services/supabaseStorage'
import axiosInstance from '../../services/api/axiosInstance'
import { useAuth } from '../../contexts/AuthContext'
import { useValoraciones } from '../../hooks/useValoraciones'
import ReportIncidenceModal from '../../components/common/ReportIncidenceModal'
import { useQuery } from '@apollo/client'
import { PERFIL_COMPLETO_ARQUITECTO } from '../../services/graphql/queries'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import { CacheService } from '../../utils/cacheService'
import type { Arquitecto, Proyecto } from '../../types'
import '../../styles/ArquitectoProfile.css'

const AVATAR_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
  '#98D8C8', '#6C5CE7', '#FDA7DF', '#F8B500',
  '#95E1D3', '#F38181'
]

function ArquitectoProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [reportModalVisible, setReportModalVisible] = useState(false)

  const [arquitecto, setArquitecto] = useState<Arquitecto | null>(null)
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creatingConversation, setCreatingConversation] = useState(false)
  const [arquitectoIdReal, setArquitectoIdReal] = useState<string | null>(null) // ID de la tabla arquitectos

  // Hook para actualizaciones en tiempo real de valoraciones
  // NO pasamos arquitectoId aquí porque necesitamos el ID real de la tabla arquitectos
  const valoracionesHook = useValoraciones({
    autoConnect: true
  });
  
  const { promedio, totalValoraciones, isConnected: valoracionesConnected, initializePromedio, joinArquitecto } = valoracionesHook;

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

      // Inicializar el promedio en el hook de WebSocket (siempre, incluso si es 0)
      const valoracionInicial = arquitectoFromGql.valoracion_prom_proyecto || 0;
      const totalValoracionesInicial = perfil.estadisticas?.totalValoraciones || 0;
      
      console.log('📈 Inicializando valoraciones desde GraphQL:', {
        valoracionInicial,
        totalValoracionesInicial,
        arquitectoId: id
      });
      
      initializePromedio(valoracionInicial, totalValoracionesInicial);

      // 🔧 El ID de la URL puede ser arquitecto_id o usuario_id
      // Intentar ambos para obtener el arquitecto_id real
      try {
        let realArquitectoId: string | null = null
        
        // Primero intentar como arquitecto_id directo
        try {
          const directResponse = await axiosInstance.get(`/arquitectos/${id}`)
          if (directResponse.data && directResponse.data.id) {
            realArquitectoId = String(directResponse.data.id)
            console.log('✅ Arquitecto ID obtenido directamente:', realArquitectoId)
          }
        } catch (directError) {
          // Si falla, intentar buscarlo por usuario_id
          console.log('⚠️ No se encontró como arquitecto_id, intentando como usuario_id...')
          const byUsuarioResponse = await axiosInstance.get(`/arquitectos?usuario_id=${id}`)
          const arquitectos = Array.isArray(byUsuarioResponse.data) ? byUsuarioResponse.data : [byUsuarioResponse.data]
          
          if (arquitectos[0] && arquitectos[0].id) {
            realArquitectoId = String(arquitectos[0].id)
            console.log('✅ Arquitecto ID obtenido por usuario_id:', realArquitectoId)
          }
        }
        
        if (realArquitectoId) {
          setArquitectoIdReal(realArquitectoId)
          
          // Actualizar vistas vía REST usando el ID real
          const currentViews = arquitectoState.vistas_perfil ?? 0
          await arquitectosService.update(realArquitectoId, { vistas_perfil: currentViews + 1 })
          setArquitecto((prev: any) => prev ? { ...prev, vistas_perfil: currentViews + 1 } : prev)
        } else {
          console.error('❌ No se pudo obtener el arquitecto_id real')
        }
      } catch (e) {
        console.warn('No se pudo obtener arquitecto_id real o actualizar vistas:', e)
      }
    }

    populateFromGql()
  }, [gqlData, id])

  // Unirse a la sala de WebSocket cuando tengamos el arquitecto_id real y la conexión esté lista
  useEffect(() => {
    if (arquitectoIdReal && valoracionesConnected) {
      console.log('🔌 Uniéndose a la sala del arquitecto (useEffect):', arquitectoIdReal);
      joinArquitecto(arquitectoIdReal);
    }
  }, [arquitectoIdReal, valoracionesConnected, joinArquitecto]);

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

  const handleContactar = async () => {
    if (!user || !arquitecto) {
      alert('Debes iniciar sesión para contactar al arquitecto')
      navigate('/login')
      return
    }

    if (user.rol !== 'cliente') {
      alert('Solo los clientes pueden contactar arquitectos')
      return
    }

    try {
      setCreatingConversation(true)

      // Obtener el cliente_id del usuario actual
      const responseCliente = await axiosInstance.get(`/clientes?usuario_id=${user.id}`)
      console.log('📋 Response clientes:', responseCliente.data)
      
      const clientes = Array.isArray(responseCliente.data) ? responseCliente.data : [responseCliente.data]
      const cliente = clientes[0]
      
      console.log('👤 Cliente encontrado:', cliente)
      
      if (!cliente || !cliente.id) {
        alert('No se encontró tu perfil de cliente')
        return
      }

      // 🔧 Usar el arquitecto_id real obtenido de la tabla arquitectos
      if (!arquitectoIdReal) {
        alert('No se pudo determinar el ID del arquitecto. Intenta recargar la página.')
        return
      }

      const clienteId = String(cliente.id)
      const arquitectoId = arquitectoIdReal // Usar el ID real de la tabla arquitectos

      console.log('🔍 Creando o buscando conversación...', { 
        clienteId, 
        arquitectoId,
        clienteIdType: typeof clienteId,
        arquitectoIdType: typeof arquitectoId 
      })

      // Crear conversación (el backend validará si ya existe y devolverá la existente)
      const response = await conversacionesService.create({
        cliente_id: clienteId,
        arquitecto_id: arquitectoId
      })

      const conversacionId = response.conversacion.id
      
      if (response.existing) {
        console.log('✅ Conversación existente encontrada:', conversacionId)
      } else {
        console.log('✅ Nueva conversación creada:', conversacionId)
        // Invalidar el caché de conversaciones para que se recargue
        CacheService.remove(`conversaciones_${user.id}_cache`)
        console.log('🗑️ Caché de conversaciones invalidado')
      }

      // Redirigir directamente al chat con la conversación seleccionada
      console.log('🚀 Redirigiendo a /cliente/conversaciones con:', { conversacionId, autoOpen: true })
      navigate('/cliente/conversaciones', { 
        state: { 
          conversacionId,
          autoOpen: true 
        } 
      })
      
    } catch (error: any) {
      console.error('❌ Error al crear conversación:', error)
      console.error('Response data:', error?.response?.data)
      console.error('Response status:', error?.response?.status)
      
      let errorMessage = 'Hubo un error al crear la conversación'
      if (error?.response?.data?.details) {
        errorMessage += ': ' + error.response.data.details.join(', ')
      } else if (error?.response?.data?.error) {
        errorMessage += ': ' + error.response.data.error
      } else if (error.message) {
        errorMessage += ': ' + error.message
      }
      
      alert(errorMessage)
    } finally {
      setCreatingConversation(false)
    }
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

  const handleReportSubmit = async ({ descripcion, imagenes }: { descripcion: string; imagenes: File[] }) => {
    if (!user) {
      alert('Debes iniciar sesión para reportar')
      return
    }

    // Obtener el ID del USUARIO infractor (no el id del registro Arquitecto)
    let usuarioInfractorId: string | null = null
    if (arquitecto?.usuario?.id) {
      usuarioInfractorId = arquitecto.usuario.id
    } else if (arquitectoIdReal) {
      // Si solo tenemos el arquitecto_id (tabla arquitectos), pedir al backend el usuario asociado
      try {
        const resp = await axiosInstance.get(`/arquitectos/${arquitectoIdReal}`)
        // Puede venir como usuario_id o usuario: { id }
        usuarioInfractorId = resp.data.usuario_id || resp.data.usuario?.id || null
      } catch (e) {
        console.warn('No se pudo obtener usuario del arquitecto por arquitecto_id:', e)
      }
    }

    // Fallback: si la URL contiene el usuario_id directamente en `id`, intentar usarlo
    if (!usuarioInfractorId && id) {
      try {
        const respUser = await axiosInstance.get(`/usuarios/${id}`)
        usuarioInfractorId = respUser.data.id || null
      } catch (e) {
        console.warn('No se pudo obtener usuario por id de URL:', e)
      }
    }

    if (!usuarioInfractorId) {
      alert('No se pudo determinar el usuario (usuario_id) del arquitecto. Intenta recargar la página.')
      return
    }

    try {
      // 1. Crear la incidencia primero (sin imágenes)
      const incidenciaPayload = {
        descripcion,
        usuario_emisor_id: user.id,
        usuario_infractor_id: usuarioInfractorId,
        estado: 'pendiente' as const,
        moderador_id: null
      }

      console.log('📝 Creando incidencia:', incidenciaPayload)

      const incidenciaResponse = await incidenciasService.create(incidenciaPayload)
      const incidenciaId = incidenciaResponse.id
      console.log('✅ Incidencia creada:', incidenciaId)

      // 2. Subir las imágenes a Supabase y crear registros de imagen
      if (imagenes && imagenes.length > 0) {
        for (let i = 0; i < imagenes.length; i++) {
          const file = imagenes[i]
          try {
            console.log(`📤 Subiendo imagen ${i + 1}/${imagenes.length}:`, file.name)

            // Generar nombre único para el archivo
            const timestamp = Date.now()
            const randomStr = Math.random().toString(36).substr(2, 9)
            const fileName = `incidencia-${incidenciaId}/${timestamp}-${randomStr}-${file.name}`

            // Subir a Supabase Storage
            const imagenUrl = await supabaseStorage.uploadImagen(file, fileName)
            console.log(`✅ Imagen subida a Supabase:`, imagenUrl)

            // Crear registro de imagen en la base de datos
            const imagenPayload = {
              imagen_url: imagenUrl,
              fecha: new Date().toISOString(),
              imagen_asociaciones_attributes: [
                {
                  asociable_type: 'Incidencia' as const,
                  asociable_id: incidenciaId
                }
              ]
            }

            await imagenesService.create(imagenPayload)
            console.log(`✅ Imagen guardada en BD`)
          } catch (imgError: any) {
            console.error(`❌ Error al procesar imagen ${i + 1}:`, imgError.message)
            alert(`Advertencia: no se pudo procesar la imagen "${file.name}". Continuando con el resto...`)
            // Continuar con las demás imágenes
          }
        }
      }

      alert('Reporte enviado correctamente')
      setReportModalVisible(false)
    } catch (error: any) {
      console.error('❌ Error al enviar incidencia:', error)
      alert('No se pudo enviar el reporte. Intenta nuevamente más tarde.')
      throw error
    }
  }

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
              <span className="stat-value">
                {(() => {
                  const valor = valoracionesConnected && promedio !== null
                    ? promedio 
                    : arquitecto.valoracion_prom_proyecto;
                  
                  console.log('🌟 Mostrando valoración:', {
                    valoracionesConnected,
                    promedio,
                    valorEstaticoArquitecto: arquitecto.valoracion_prom_proyecto,
                    valorMostrado: valor
                  });
                  
                  return valor.toFixed(1);
                })()}
              </span>
              <span className="stat-label">
                Valoración
                {valoracionesConnected && (
                  <span className="ws-status ws-connected" title="Actualización en tiempo real activa">●</span>
                )}
              </span>
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
          <button 
            className="contact-button" 
            onClick={handleContactar}
            disabled={creatingConversation}
          >
            <MessageCircle size={20} />
            {creatingConversation ? 'Creando conversación...' : 'Contactar Arquitecto'}
          </button>

          {/* Botón Reportar (solo clientes logueados) */}
          {user && user.rol === 'cliente' && (
            <button
              className="report-button"
              onClick={() => setReportModalVisible(true)}
            >
              <AlertTriangle size={16} />
              Reportar Arquitecto
            </button>
          )}

          {/* Especialidades */}
          {especialidadesList.length > 0 && (
            <div className="sidebar-section">
              <h3 className="sidebar-title">Especialidades</h3>
              <div className="especialidades-list">
                {especialidadesList.map((especialidad, index) => (
                  <span key={index} className="especialidad-tag">{especialidad}</span>
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
      <ReportIncidenceModal
        visible={reportModalVisible}
        onClose={() => setReportModalVisible(false)}
        onSubmit={handleReportSubmit}
      />
    </div>
  )
}

export default ArquitectoProfile
