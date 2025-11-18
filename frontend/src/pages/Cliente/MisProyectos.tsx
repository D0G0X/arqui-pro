import { useEffect, useState } from 'react'
import { FolderKanban, Plus, Search } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import proyectosService from '../../services/api/proyectosService'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import type { Proyecto } from '../../types'
import '../../styles/MisProyectos.css'

function MisProyectos() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [filteredProyectos, setFilteredProyectos] = useState<Proyecto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtro, setFiltro] = useState<'todos' | 'contratado' | 'portafolio'>('todos')
  const [ordenar, setOrdenar] = useState<'reciente' | 'antiguo' | 'nombre'>('reciente')

  useEffect(() => {
    const fetchProyectos = async () => {
      if (!user?.id) {
        setError('Usuario no autenticado')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const proyectosData = await proyectosService.getByUsuarioCliente(user.id)
        setProyectos(proyectosData)
        setFilteredProyectos(proyectosData)
      } catch (err) {
        console.error('Error al cargar proyectos:', err)
        setError('No se pudieron cargar los proyectos')
      } finally {
        setLoading(false)
      }
    }

    fetchProyectos()
  }, [user?.id])

  // Aplicar filtros y ordenamiento
  useEffect(() => {
    let resultado = [...proyectos]

    // Filtrar por tipo_proyecto
    if (filtro !== 'todos') {
      resultado = resultado.filter(p => p.tipo_proyecto === filtro)
    }

    // Ordenar
    resultado.sort((a, b) => {
      if (ordenar === 'reciente') {
        return new Date(b.fecha_publicacion || '').getTime() - new Date(a.fecha_publicacion || '').getTime()
      } else if (ordenar === 'antiguo') {
        return new Date(a.fecha_publicacion || '').getTime() - new Date(b.fecha_publicacion || '').getTime()
      } else {
        return (a.titulo_proyecto || '').localeCompare(b.titulo_proyecto || '')
      }
    })

    setFilteredProyectos(resultado)
  }, [proyectos, filtro, ordenar])

  if (loading) {
    return (
      <div className="mis-proyectos-container">
        <div className="mis-proyectos-loading">
          <div className="loading-spinner"></div>
          <p>Cargando proyectos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mis-proyectos-container">
        <ErrorMessage message={error} />
      </div>
    )
  }

  return (
    <div className="mis-proyectos-container">
      {/* Header con título */}
      <div className="mis-proyectos-header">
        <div className="header-content">
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1a202c', marginBottom: '0.5rem' }}>
              <FolderKanban size={32} style={{ display: 'inline', marginRight: '0.75rem', color: '#ff6b35' }} />
              Mis Proyectos
            </h1>
            <p style={{ color: '#6c757d', fontSize: '1rem' }}>
              Gestiona y da seguimiento a todos tus proyectos arquitectónicos
            </p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filtros-container">
        <div className="filtros-section">
          <div className="filtros-grupo">
            <span className="filtros-label">Tipo:</span>
            <div className="filtros-botones">
              <button
                className={`filtro-btn ${filtro === 'todos' ? 'active' : ''}`}
                onClick={() => setFiltro('todos')}
              >
                Todos
              </button>
              <button
                className={`filtro-btn ${filtro === 'contratado' ? 'active' : ''}`}
                onClick={() => setFiltro('contratado')}
              >
                En Progreso
              </button>
              <button
                className={`filtro-btn ${filtro === 'portafolio' ? 'active' : ''}`}
                onClick={() => setFiltro('portafolio')}
              >
                Finalizados
              </button>
            </div>
          </div>

          <div className="filtros-grupo">
            <span className="filtros-label">Ordenar:</span>
            <select
              className="select-ordenar"
              value={ordenar}
              onChange={(e) => setOrdenar(e.target.value as 'reciente' | 'antiguo' | 'nombre')}
            >
              <option value="reciente">Más reciente</option>
              <option value="antiguo">Más antiguo</option>
              <option value="nombre">Nombre A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Proyectos */}
      {filteredProyectos.length > 0 ? (
        <div className="proyectos-grid-full">
          {filteredProyectos.map((proyecto) => (
            <div
              key={proyecto.id}
              className="proyecto-card-full"
              onClick={() => navigate(`/cliente/proyectos/${proyecto.id}`)}
            >
              <div className="proyecto-imagen-container">
                {proyecto.imagenes && proyecto.imagenes.length > 0 ? (
                  <img
                    src={proyecto.imagenes[0].imagen_url}
                    alt={proyecto.titulo_proyecto}
                    className="proyecto-imagen"
                  />
                ) : (
                  <div className="proyecto-sin-imagen">
                    <FolderKanban size={48} />
                  </div>
                )}
                <div className="proyecto-tipo-badge">
                  {proyecto.tipo_proyecto === 'portafolio' ? '✓ Finalizado' : '⏳ En Progreso'}
                </div>
              </div>
              <div className="proyecto-info">
                <h3 className="proyecto-titulo">{proyecto.titulo_proyecto}</h3>
                <p className="proyecto-descripcion">
                  {proyecto.descripcion || 'Sin descripción'}
                </p>
                <div className="proyecto-meta">
                  <span className="proyecto-arquitecto">
                    Por {proyecto.arquitecto?.usuario?.nombre} {proyecto.arquitecto?.usuario?.apellido}
                  </span>
                  <span className="proyecto-imagenes">
                    {proyecto.imagenes?.length || 0} imágenes
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <FolderKanban size={64} style={{ color: '#cbd5e0', margin: '0 auto 1.5rem' }} />
          <h3 style={{ color: '#4a5568', marginBottom: '0.5rem' }}>No hay proyectos</h3>
          <p style={{ color: '#6c757d' }}>
            {filtro !== 'todos' 
              ? `No tienes proyectos ${filtro === 'portafolio' ? 'finalizados' : 'en progreso'}`
              : 'Aún no tienes proyectos arquitectónicos'}
          </p>
          <button
            className="btn-crear-proyecto"
            onClick={() => navigate('/cliente/buscar-arquitecto')}
            style={{ marginTop: '1.5rem' }}
          >
            <Search size={20} />
            Buscar Arquitecto
          </button>
        </div>
      )}
    </div>
  )
}

export default MisProyectos
