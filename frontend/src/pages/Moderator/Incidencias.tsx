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
    estado_cuenta?: 'activo' | 'suspendido';
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
  const [modalSuspender, setModalSuspender] = useState<Incidencia | null>(null);

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

  const handleCambiarEstadoUsuario = async (
    usuarioId: number | string,
    estadoActual: 'activo' | 'suspendido' | undefined
  ) => {
    const nuevoEstado = estadoActual === 'activo' ? 'suspendido' : 'activo';
    const accion = nuevoEstado === 'suspendido' ? 'suspender' : 'activar';

    try {
      if (nuevoEstado === 'suspendido') {
        await moderadorService.suspenderUsuario(usuarioId);
      } else {
        await moderadorService.activarUsuario(usuarioId);
      }
    } catch (error) {
      console.error(`Error al ${accion} usuario:`, error);
      alert(`Error al ${accion} el usuario`);
      throw error;
    }
  };

  const handleAplicarSuspensiones = async () => {
    if (!modalSuspender) return;

    const incidenciaOriginal = incidencias.find(i => i.id === modalSuspender.id);
    if (!incidenciaOriginal) return;

    const acciones: Array<{ usuarioId: number | string; tipo: 'emisor' | 'infractor'; accion: 'suspender' | 'activar' }> = [];

    // Verificar si hay cambios en el emisor
    if (modalSuspender.emisor && incidenciaOriginal.emisor) {
      const estadoOriginal = incidenciaOriginal.emisor.estado_cuenta;
      const estadoNuevo = modalSuspender.emisor.estado_cuenta;
      if (estadoOriginal !== estadoNuevo) {
        acciones.push({
          usuarioId: modalSuspender.emisor.id,
          tipo: 'emisor',
          accion: estadoNuevo === 'suspendido' ? 'suspender' : 'activar'
        });
      }
    }

    // Verificar si hay cambios en el infractor
    if (modalSuspender.infractor && incidenciaOriginal.infractor) {
      const estadoOriginal = incidenciaOriginal.infractor.estado_cuenta;
      const estadoNuevo = modalSuspender.infractor.estado_cuenta;
      if (estadoOriginal !== estadoNuevo) {
        acciones.push({
          usuarioId: modalSuspender.infractor.id,
          tipo: 'infractor',
          accion: estadoNuevo === 'suspendido' ? 'suspender' : 'activar'
        });
      }
    }

    if (acciones.length === 0) {
      alert('No hay cambios para aplicar');
      return;
    }

    if (!confirm(`¿Seguro que deseas aplicar ${acciones.length} cambio(s)?`)) return;

    try {
      // Aplicar todas las acciones
      for (const accion of acciones) {
        const estadoActual = accion.accion === 'suspender' ? 'activo' : 'suspendido';
        await handleCambiarEstadoUsuario(
          accion.usuarioId,
          estadoActual
        );
      }
      alert('✅ Cambios aplicados exitosamente');
      setModalSuspender(null);
      await cargarIncidencias();
    } catch (error) {
      alert('Error al aplicar los cambios');
    }
  };

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'inc-badge-danger';
      case 'en revision':
        return 'inc-badge-warning';
      case 'resuelto':
        return 'inc-badge-success';
      default:
        return 'inc-badge-secondary';
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
                    <span className={`inc-badge ${getEstadoBadgeClass(incidencia.estado)}`}>
                      {incidencia.estado === 'pendiente' && 'Pendiente'}
                      {incidencia.estado === 'en revision' && 'En Revisión'}
                      {incidencia.estado === 'resuelto' && 'Resuelto'}
                    </span>
                  </td>
                  <td>{new Date(incidencia.fecha).toLocaleDateString()}</td>
                  <td>
                    <div>
                      {incidencia.emisor
                        ? `${incidencia.emisor.nombre} ${incidencia.emisor.apellido}`
                        : `Usuario ${incidencia.emisor_id}`
                      }
                      {incidencia.emisor?.estado_cuenta && (
                        <span className={`inc-badge ${incidencia.emisor.estado_cuenta === 'activo' ? 'inc-badge-success' : 'inc-badge-danger'}`} style={{ marginLeft: '8px' }}>
                          {incidencia.emisor.estado_cuenta === 'activo' ? 'Activo' : 'Suspendido'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    {incidencia.infractor
                      ? `${incidencia.infractor.nombre} ${incidencia.infractor.apellido}`
                      : `Usuario ${incidencia.infractor_id}`
                    }
                  </td>
                  <td>
                    {incidencia.infractor?.estado_cuenta ? (
                      <span className={`inc-badge ${incidencia.infractor.estado_cuenta === 'activo' ? 'inc-badge-success' : 'inc-badge-danger'}`}>
                        {incidencia.infractor.estado_cuenta === 'activo' ? 'Activo' : 'Suspendido'}
                      </span>
                    ) : (
                      <span className="inc-badge inc-badge-secondary">-</span>
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
                      {/* Botón único para suspender/activar usuarios */}
                      {((incidencia.emisor_id || incidencia.emisor?.id) || (incidencia.infractor_id || incidencia.infractor?.id)) && (
                        <button
                          onClick={() => setModalSuspender(incidencia)}
                          className="btn-suspender"
                          title="Gestionar suspensión de usuarios"
                        >
                          Suspender
                        </button>
                      )}
                      {/* Botones de acción de incidencia */}
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
          <div className="inc-modal-overlay" onClick={() => setModalDescripcion(null)}>
            <div className="inc-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="inc-modal-header">
                <h3>Descripción Completa</h3>
                <button className="inc-modal-close" onClick={() => setModalDescripcion(null)}>×</button>
              </div>
              <div className="inc-modal-body">
                <p>{modalDescripcion}</p>
              </div>
            </div>
          </div>
        )}

        {/* Modal para suspender/activar usuarios */}
        {modalSuspender && (
          <div className="inc-modal-overlay" onClick={() => setModalSuspender(null)}>
            <div className="inc-modal-content inc-modal-suspender" onClick={(e) => e.stopPropagation()}>
              <div className="inc-modal-header">
                <h3>Gestionar Suspensión de Usuarios</h3>
                <button className="inc-modal-close" onClick={() => setModalSuspender(null)}>×</button>
              </div>
              <div className="inc-modal-body">
                <div className="suspender-usuarios-list">
                  {/* Usuario Emisor */}
                  {modalSuspender.emisor && (
                    <div className="suspender-usuario-item">
                      <div className="suspender-usuario-info">
                        <h4>Usuario Emisor</h4>
                        <p>
                          {modalSuspender.emisor.nombre} {modalSuspender.emisor.apellido}
                        </p>
                        <p className="suspender-usuario-email">{modalSuspender.emisor.email}</p>
                        <span className={`inc-badge ${modalSuspender.emisor.estado_cuenta === 'activo' ? 'inc-badge-success' : 'inc-badge-danger'}`}>
                          {modalSuspender.emisor.estado_cuenta === 'activo' ? 'Activo' : 'Suspendido'}
                        </span>
                      </div>
                      <div className="suspender-usuario-actions">
                        <button
                          onClick={() => {
                            setModalSuspender({
                              ...modalSuspender,
                              emisor: {
                                ...modalSuspender.emisor!,
                                estado_cuenta: modalSuspender.emisor!.estado_cuenta === 'activo' ? 'suspendido' : 'activo'
                              }
                            });
                          }}
                          className={modalSuspender.emisor.estado_cuenta === 'activo' ? 'btn-suspender' : 'btn-activar'}
                        >
                          {modalSuspender.emisor.estado_cuenta === 'activo' ? 'Suspender' : 'Activar'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Usuario Infractor */}
                  {modalSuspender.infractor && (
                    <div className="suspender-usuario-item">
                      <div className="suspender-usuario-info">
                        <h4>Usuario Infractor</h4>
                        <p>
                          {modalSuspender.infractor.nombre} {modalSuspender.infractor.apellido}
                        </p>
                        <p className="suspender-usuario-email">{modalSuspender.infractor.email}</p>
                        <span className={`inc-badge ${modalSuspender.infractor.estado_cuenta === 'activo' ? 'inc-badge-success' : 'inc-badge-danger'}`}>
                          {modalSuspender.infractor.estado_cuenta === 'activo' ? 'Activo' : 'Suspendido'}
                        </span>
                      </div>
                      <div className="suspender-usuario-actions">
                        <button
                          onClick={() => {
                            setModalSuspender({
                              ...modalSuspender,
                              infractor: {
                                ...modalSuspender.infractor!,
                                estado_cuenta: modalSuspender.infractor!.estado_cuenta === 'activo' ? 'suspendido' : 'activo'
                              }
                            });
                          }}
                          className={modalSuspender.infractor.estado_cuenta === 'activo' ? 'btn-suspender' : 'btn-activar'}
                        >
                          {modalSuspender.infractor.estado_cuenta === 'activo' ? 'Suspender' : 'Activar'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="inc-modal-footer">
                <button
                  className="btn-cancelar"
                  onClick={() => setModalSuspender(null)}
                >
                  Cancelar
                </button>
                <button
                  className="btn-aplicar"
                  onClick={handleAplicarSuspensiones}
                >
                  Aplicar Cambios
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ModeratorLayout>
  );
};