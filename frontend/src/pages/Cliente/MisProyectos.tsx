import { useEffect, useState } from 'react'
import { FolderKanban, Plus } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import proyectosService from '../../services/api/proyectosService'
import TarjetaProyecto from '../../components/common/TarjetaProyecto'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import type { Proyecto } from '../../types'
import '../../styles/MisProyectos.css'

function MisProyectos() {
  const { user } = useAuth()
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      } catch (err) {
        console.error('Error al cargar proyectos:', err)
        setError('No se pudieron cargar los proyectos')
      } finally {
        setLoading(false)
      }
    }

    fetchProyectos()
  }, [user?.id])

  if (loading) {
    return (
      <div className="mp-proyectos-container">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mp-proyectos-container">
        <ErrorMessage message={error} />
      </div>
    )
  }

  return (
    <div className="mp-proyectos-container">
      <div className="mp-proyectos-content">
        {/* Header */}
        <div className="mp-proyectos-header">
          <div className="mp-header-title-section">
            <FolderKanban size={32} className="mp-header-icon" />
            <div>
              <h1 className="mp-page-title">Mis Proyectos</h1>
              <p className="mp-page-subtitle">
                Gestiona y da seguimiento a todos tus proyectos arquitectónicos
              </p>
            </div>
          </div>
        </div>

        {/* Proyectos Grid */}
        {proyectos.length > 0 ? (
          <div className="mp-proyectos-grid">
            {proyectos.map((proyecto) => (
              <TarjetaProyecto key={proyecto.id} proyecto={proyecto} />
            ))}
          </div>
        ) : (
          <div className="mp-no-proyectos">
            <FolderKanban size={64} className="mp-empty-icon" />
            <h3>No tienes proyectos todavía</h3>
            <p>Comienza creando tu primer proyecto arquitectónico</p>
            <button className="mp-crear-proyecto-btn">
              <Plus size={20} />
              Crear Primer Proyecto
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MisProyectos
