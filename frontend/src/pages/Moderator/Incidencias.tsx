import { useState, useEffect } from 'react';
import { ModeratorLayout } from '../../components/Moderator/ModeratorLayout';
import { moderadorService } from '../../services/api/moderador/moderadorService';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/Moderator/Incidencias.css';

interface Incidencia {
  id: number;
  descripcion: string;
  estado: 'pendiente' | 'en revision' | 'resuelto';
  emisor_id?: number;
  infractor_id?: number;
  moderador_id: number | null;
  fecha: string;
  emisor?: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
  };
  infractor?: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    estado_cuenta?: 'activo' | 'suspendido';
  };
  moderador?: {
    usuario: {
      nombre: string;
      apellido: string;
    };
  };
}

export const Incidencias = () => {
  const { user } = useAuth();
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalDescripcion, setModalDescripcion] = useState<string | null>(null);

  useEffect(() => {
    cargarIncidencias();
  }, [page]);

  const cargarIncidencias = async () => {
    try {
      setLoading(true);
      const response = await moderadorService.getIncidencias({ page, per_page: 10 });
      setIncidencias(response.data as any || []);
      setTotalPages(Math.ceil(response.total / 10) || 1);
    } catch (error) {
      console.error('Error al cargar incidencias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolver = async (id: number) => {
    if (!confirm('¿Seguro que deseas resolver esta incidencia?')) return;

    try {
      await moderadorService.resolverIncidencia(id, {
        moderador_id: user?.id || '',
        resolucion: 'Incidencia resuelta por moderador'
      });
      alert('✅ Incidencia resuelta exitosamente');
      cargarIncidencias();
    } catch (error) {
      console.error('Error al resolver:', error);
      alert('Error al resolver la incidencia');
    }
  };

  const toggleDescripcion = (descripcion: string) => {
    setModalDescripcion(descripcion);
  };

  const handleReabrir = async (id: number) => {
    if (!confirm('¿Seguro que deseas reabrir esta incidencia?')) return;

    try {
      await moderadorService.reabrirIncidencia(id, {
        moderador_id: user?.id || ''
      });
      alert('✅ Incidencia reabierta y marcada como pendiente');
      cargarIncidencias();
    } catch (error) {
      console.error('Error al reabrir:', error);
      alert('Error al reabrir la incidencia');
    }
  };

  const handleCambiarEstadoUsuario = async (usuarioId: number, estadoActual: 'activo' | 'suspendido' | undefined) => {
    const nuevoEstado = estadoActual === 'activo' ? 'suspendido' : 'activo';
    const accion = nuevoEstado === 'suspendido' ? 'suspender' : 'activar';
    
    if (!confirm(`¿Seguro que deseas ${accion} a este usuario?`)) return;

    try {
      if (nuevoEstado === 'suspendido') {
        await moderadorService.suspenderUsuario(usuarioId, {
          moderador_id: Number(user?.id) || 0,
          razon: 'Suspensión por incidencia'
        });
      } else {
        await moderadorService.activarUsuario(usuarioId, {
          moderador_id: Number(user?.id) || 0
        });
      }
      alert(`✅ Usuario ${nuevoEstado === 'suspendido' ? 'suspendido' : 'activado'} exitosamente`);
      cargarIncidencias();
    } catch (error) {
      console.error(`Error al ${accion} usuario:`, error);
      alert(`Error al ${accion} el usuario`);
    }
  };

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'badge-danger';
      case 'en revision':
        return 'badge-warning';
      case 'resuelto':
        return 'badge-success';
      default:
        return 'badge-secondary';
    }
  };

  if (loading) {
    return (
      <ModeratorLayout>
        <div className="incidencias-loading">Cargando...</div>
      </ModeratorLayout>
    );
  }

  return (
    <ModeratorLayout>
      <div className="incidencias-page">
        <h1 className="page-title">Gestión de Incidencias</h1>

        <div className="table-container">
          <table className="incidencias-table">
            <thead>
              <tr>
                <th>DESCRIPCIÓN</th>
                <th>ESTADO</th>
                <th>FECHA</th>
                <th>EMISOR</th>
                <th>INFRACTOR</th>
                <th>ESTADO INFRACTOR</th>
                <th>MODERADOR</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {incidencias.map((incidencia: any) => (
                <tr key={incidencia.id}>
                  <td 
                    className="descripcion-cell clickeable"
                    onClick={() => toggleDescripcion(incidencia.descripcion)}
                    title="Click para ver descripción completa"
                  >
                    {incidencia.descripcion.length > 50 
                      ? `${incidencia.descripcion.substring(0, 50)}...` 
                      : incidencia.descripcion
                    }
                  </td>
                  <td>
                    <span className={`badge ${getEstadoBadgeClass(incidencia.estado)}`}>
                      {incidencia.estado === 'pendiente' && 'Pendiente'}
                      {incidencia.estado === 'en revision' && 'En Revisión'}
                      {incidencia.estado === 'resuelto' && 'Resuelto'}
                    </span>
                  </td>
                  <td>{new Date(incidencia.fecha).toLocaleDateString()}</td>
                  <td>
                    {incidencia.emisor 
                      ? `${incidencia.emisor.nombre} ${incidencia.emisor.apellido}`
                      : `Usuario ${incidencia.emisor_id}`
                    }
                  </td>
                  <td>
                    {incidencia.infractor 
                      ? `${incidencia.infractor.nombre} ${incidencia.infractor.apellido}`
                      : `Usuario ${incidencia.infractor_id}`
                    }
                  </td>
                  <td>
                    {incidencia.infractor?.estado_cuenta ? (
                      <span className={`badge ${incidencia.infractor.estado_cuenta === 'activo' ? 'badge-success' : 'badge-danger'}`}>
                        {incidencia.infractor.estado_cuenta === 'activo' ? 'Activo' : 'Suspendido'}
                      </span>
                    ) : (
                      <span className="badge badge-secondary">-</span>
                    )}
                  </td>
                  <td>
                    {incidencia.moderador?.usuario
                      ? `${incidencia.moderador.usuario.nombre} ${incidencia.moderador.usuario.apellido}`
                      : '-'
                    }
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {incidencia.infractor_id && incidencia.infractor && (
                        <button
                          onClick={() => handleCambiarEstadoUsuario(
                            incidencia.infractor_id!,
                            incidencia.infractor?.estado_cuenta
                          )}
                          className={incidencia.infractor.estado_cuenta === 'activo' ? 'btn-suspender' : 'btn-activar'}
                          title={incidencia.infractor.estado_cuenta === 'activo' ? 'Suspender usuario' : 'Activar usuario'}
                        >
                          {incidencia.infractor.estado_cuenta === 'activo' ? 'Suspender' : 'Activar'}
                        </button>
                      )}
                      {(incidencia.estado === 'pendiente' || incidencia.estado === 'en revision') ? (
                        <button
                          onClick={() => handleResolver(incidencia.id)}
                          className="btn-resolver"
                        >
                          Resolver
                        </button>
                      ) : incidencia.estado === 'resuelto' ? (
                        <button
                          onClick={() => handleReabrir(incidencia.id)}
                          className="btn-reabrir"
                        >
                          Reabrir
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="pagination-btn"
          >
            ← Anterior
          </button>
          <span className="pagination-info">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="pagination-btn"
          >
            Siguiente →
          </button>
        </div>

        {/* Modal para descripción completa */}
        {modalDescripcion && (
          <div className="modal-overlay" onClick={() => setModalDescripcion(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Descripción Completa</h3>
                <button className="modal-close" onClick={() => setModalDescripcion(null)}>×</button>
              </div>
              <div className="modal-body">
                <p>{modalDescripcion}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ModeratorLayout>
  );
};