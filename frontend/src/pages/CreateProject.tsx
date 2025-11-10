import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ArrowLeft, FolderPlus } from 'lucide-react';
import proyectosService, { type Proyecto } from '../services/api/proyectosService';
import arquitectosService from '../services/api/arquitectosService';
import { NotificationInbox } from '../components/NotificationInbox';
import '../styles/CreateProject.css';

export default function CreateProject() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clienteId = searchParams.get('cliente_id');

  const [arquitectoId, setArquitectoId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    titulo_proyecto: '',
    descripcion: '',
    tipo_proyecto: 'contratado' as 'portafolio' | 'contratado',
    cliente_id: clienteId || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Si no es arquitecto, redirigir
  useEffect(() => {
    if (!user || user.rol !== 'arquitecto') {
      navigate('/');
      return;
    }

    // Obtener el arquitecto_id del usuario actual
    const fetchArquitecto = async () => {
      try {
        const response = await arquitectosService.getAll();
        const arquitectoActual = response.arquitectos.find(
          (arq) => arq.usuario?.id === user.id
        );
        
        if (arquitectoActual) {
          setArquitectoId(Number(arquitectoActual.id));
        }
      } catch (err) {
        console.error('Error al obtener arquitecto:', err);
        // No mostrar error al usuario, solo log en consola
      }
    };

    fetchArquitecto();
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!arquitectoId) {
        throw new Error('No se encontró el ID del arquitecto');
      }

      const proyecto: Proyecto = {
        titulo_proyecto: formData.titulo_proyecto,
        descripcion: formData.descripcion,
        tipo_proyecto: formData.tipo_proyecto,
        arquitecto_id: arquitectoId,
        ...(formData.cliente_id && { cliente_id: parseInt(formData.cliente_id) }),
      };

      await proyectosService.createProyecto(proyecto);
      
      // Redirigir al dashboard del arquitecto
      navigate('/arquitecto/profile');
    } catch (err: any) {
      console.error('Error al crear proyecto:', err);
      setError(err.response?.data?.message || 'Error al crear el proyecto');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="create-project-page">
      <div className="create-project-container">
        <div className="create-project-header">
          <button onClick={() => navigate(-1)} className="back-btn">
            <ArrowLeft size={20} />
            Volver
          </button>
          <h1 className="page-title">
            <FolderPlus size={32} />
            Crear Nuevo Proyecto
          </h1>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="project-form">
          <div className="form-group">
            <label htmlFor="titulo_proyecto">Título del Proyecto *</label>
            <input
              type="text"
              id="titulo_proyecto"
              name="titulo_proyecto"
              value={formData.titulo_proyecto}
              onChange={handleChange}
              required
              placeholder="Ej: Casa Moderna en las Colinas"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción *</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
              placeholder="Describe el proyecto..."
              rows={6}
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label htmlFor="tipo_proyecto">Tipo de Proyecto *</label>
            <select
              id="tipo_proyecto"
              name="tipo_proyecto"
              value={formData.tipo_proyecto}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="contratado">Contratado</option>
              <option value="portafolio">Portafolio</option>
            </select>
          </div>

          {clienteId && (
            <div className="form-group">
              <label>Cliente ID</label>
              <input
                type="text"
                value={formData.cliente_id}
                disabled
                className="form-input disabled"
              />
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-cancel"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Proyecto'}
            </button>
          </div>
        </form>
      </div>
      <NotificationInbox />
    </div>
  );
}
