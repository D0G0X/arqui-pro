import { useState, useEffect } from 'react';
import { ModeratorLayout } from '../../components/Moderator/ModeratorLayout';
import { moderadorService } from '../../services/api/moderador/moderadorService';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/Moderator/Incidencias.css';

interface Incidencia {
  id: number;
  descripcion: string;
  estado: 'pendiente' | 'en_revision' | 'resuelto';
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
    const resolucion = prompt('Describe la resolución:');
    if (!resolucion) return;

    try {
      await moderadorService.resolverIncidencia(id, {
        moderador_id: user?.id || '',
        resolucion
      });
      alert('✅ Incidencia resuelta exitosamente');
      cargarIncidencias();
    } catch (error) {
      console.error('Error al resolver:', error);
      alert('Error al resolver la incidencia');
    }
  };

  const handleRechazar = async (id: number) => {
    const resolucion = prompt('Motivo del rechazo:');
    if (!resolucion) return;

    try {
      await moderadorService.rechazarIncidencia(id, {
        moderador_id: user?.id || '',
        resolucion
      });
      alert('✅ Incidencia rechazada');
      cargarIncidencias();
    } catch (error) {
      console.error('Error al rechazar:', error);
      alert('Error al rechazar la incidencia');
    }
  };

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'badge-danger';
      case 'en_revision':
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
                <th>MODERADOR</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {incidencias.map((incidencia: any) => (
                <tr key={incidencia.id}>
                  <td className="descripcion-cell">{incidencia.descripcion}</td>
                  <td>
                    <span className={`badge ${getEstadoBadgeClass(incidencia.estado)}`}>
                      {incidencia.estado === 'pendiente' && 'Pendiente'}
                      {incidencia.estado === 'en_revision' && 'En Revisión'}
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
                    {incidencia.moderador?.usuario
                      ? `${incidencia.moderador.usuario.nombre} ${incidencia.moderador.usuario.apellido}`
                      : '-'
                    }
                  </td>
                  <td>
                    {incidencia.estado === 'pendiente' ? (
                      <div className="action-buttons">
                        <button
                          onClick={() => handleResolver(incidencia.id)}
                          className="btn-resolver"
                        >
                          Resolver
                        </button>
                        <button
                          onClick={() => handleRechazar(incidencia.id)}
                          className="btn-rechazar"
                        >
                          Rechazar
                        </button>
                      </div>
                    ) : (
                      <button className="btn-more">⋮</button>
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