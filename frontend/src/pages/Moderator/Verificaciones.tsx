import { useState, useEffect } from 'react';
import { ModeratorLayout } from '../../components/Moderator/ModeratorLayout';
import { moderadorService } from '../../services/api/moderador/moderadorService';
import '../../styles/Moderator/Verificaciones.css';

interface Verificacion {
  id: number;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  fecha_verificacion: string;
  arquitecto: {
    id: number;
    nombre: string;
    apellido: string;
  };
  moderador: {
    id: number;
    nombre: string;
    apellido: string;
  } | null;
}

export const Verificaciones = () => {
  const [verificaciones, setVerificaciones] = useState<Verificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    cargarVerificaciones();
  }, [page]);

  const cargarVerificaciones = async () => {
    try {
      setLoading(true);
      const data = await moderadorService.getVerificaciones({ page, per_page: 10 });
      setVerificaciones(data.verificaciones || []);
      setTotalPages(data.total_pages || 1);
    } catch (error) {
      console.error('Error al cargar verificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAprobar = async (id: number) => {
    if (!confirm('¿Estás seguro de aprobar esta verificación?')) return;
    
    try {
      await moderadorService.aprobarVerificacion(id, {});
      cargarVerificaciones();
    } catch (error) {
      console.error('Error al aprobar:', error);
      alert('Error al aprobar la verificación');
    }
  };

  const handleRechazar = async (id: number) => {
    const razon = prompt('Motivo del rechazo:');
    if (!razon) return;

    try {
      await moderadorService.rechazarVerificacion(id, { razon });
      cargarVerificaciones();
    } catch (error) {
      console.error('Error al rechazar:', error);
      alert('Error al rechazar la verificación');
    }
  };

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'badge-warning';
      case 'aprobado':
        return 'badge-success';
      case 'rechazado':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  };

  if (loading) {
    return (
      <ModeratorLayout>
        <div className="verificaciones-loading">Cargando...</div>
      </ModeratorLayout>
    );
  }

  return (
    <ModeratorLayout>
      <div className="verificaciones-page">
        <h1 className="page-title">Verificaciones</h1>

        <div className="table-container">
          <table className="verificaciones-table">
            <thead>
              <tr>
                <th>ESTADO</th>
                <th>FECHA DE VERIFICACIÓN</th>
                <th>ARQUITECTO</th>
                <th>MODERADOR</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {verificaciones.map((verificacion) => (
                <tr key={verificacion.id}>
                  <td>
                    <span className={`badge ${getEstadoBadgeClass(verificacion.estado)}`}>
                      {verificacion.estado === 'pendiente' && '⏱ Pendiente'}
                      {verificacion.estado === 'aprobado' && '✓ Aprobado'}
                      {verificacion.estado === 'rechazado' && '✗ Rechazado'}
                    </span>
                  </td>
                  <td>{new Date(verificacion.fecha_verificacion).toLocaleDateString()}</td>
                  <td>
                    Arq. {verificacion.arquitecto.nombre} {verificacion.arquitecto.apellido}
                  </td>
                  <td>
                    {verificacion.moderador
                      ? `${verificacion.moderador.nombre} ${verificacion.moderador.apellido}`
                      : 'Admin'}
                  </td>
                  <td>
                    {verificacion.estado === 'pendiente' ? (
                      <div className="action-buttons">
                        <button
                          onClick={() => handleAprobar(verificacion.id)}
                          className="btn-aprobar"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleRechazar(verificacion.id)}
                          className="btn-rechazar"
                        >
                          Rechazar
                        </button>
                      </div>
                    ) : (
                      <button className="btn-ver">Ver</button>
                    )}
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
      </div>
    </ModeratorLayout>
  );
};