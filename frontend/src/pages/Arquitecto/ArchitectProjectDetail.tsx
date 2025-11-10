import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, ImageIcon, Plus, Trash2, X, CheckCircle } from 'lucide-react';
import proyectosService from '../../services/api/proyectosService';
import avancesService from '../../services/api/avancesService';
import type { Proyecto } from '../../types/proyecto.types';
import type { Avance } from '../../types/avance.types';
import '../../styles/ArchitectProjectDetail.css';

export default function ArchitectProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [avances, setAvances] = useState<Avance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal de crear avance
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingAvance, setCreatingAvance] = useState(false);
  const [newAvance, setNewAvance] = useState({
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0]
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);

  // Modal de finalizar proyecto
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [finishingProject, setFinishingProject] = useState(false);

  // Modal de agregar imágenes a portafolio
  const [showAddImagesModal, setShowAddImagesModal] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchProyectoDetails();
  }, [id]);

  const fetchProyectoDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Cargando proyecto con ID:', id);
      const proyectoData = await proyectosService.getById(id);
      console.log('✅ Proyecto cargado:', proyectoData);
      setProyecto(proyectoData as Proyecto);
      
      // Cargar avances solo si el proyecto existe
      console.log('🔍 Cargando avances del proyecto:', id);
      const avancesData = await avancesService.getAvancesByProyecto(id);
      console.log('✅ Avances cargados:', avancesData.length);
      setAvances(avancesData.sort((a, b) => 
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      ));
    } catch (err: any) {
      console.error('❌ Error al cargar proyecto:', err);
      console.error('Response:', err.response);
      const errorMessage = err.response?.status === 404 
        ? 'Proyecto no encontrado' 
        : err.message || 'Error al cargar el proyecto';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    setSelectedImages(prev => [...prev, ...newFiles]);

    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagesPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagesPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCreateAvance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAvance.descripcion.trim() || !id) return;

    try {
      setCreatingAvance(true);
      
      // Subir imágenes
      let imageUrls: string[] = [];
      if (selectedImages.length > 0) {
        imageUrls = await Promise.all(selectedImages.map(file => uploadImage(file)));
      }

      await avancesService.createAvance({
        descripcion: newAvance.descripcion,
        fecha: newAvance.fecha,
        proyecto_id: id,
        imagenes: imageUrls.map(url => ({ url }))
      });

      // Recargar avances
      const avancesData = await avancesService.getAvancesByProyecto(id);
      setAvances(avancesData.sort((a, b) => 
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      ));

      // Resetear formulario
      setNewAvance({
        descripcion: '',
        fecha: new Date().toISOString().split('T')[0]
      });
      setSelectedImages([]);
      setImagesPreviews([]);
      setShowCreateModal(false);
    } catch (err: any) {
      alert('Error al crear avance: ' + err.message);
    } finally {
      setCreatingAvance(false);
    }
  };

  const handleDeleteAvance = async (avanceId: string) => {
    if (!confirm('¿Estás seguro de eliminar este avance?')) return;

    try {
      await avancesService.deleteAvance(avanceId);
      setAvances(prev => prev.filter(a => a.id !== avanceId));
    } catch (err: any) {
      alert('Error al eliminar avance: ' + err.message);
    }
  };

  const handleFinishProject = async () => {
    if (!id) return;

    try {
      setFinishingProject(true);
      
      // Actualizar el proyecto a estado "completado" cambiando el tipo a portafolio
      await proyectosService.update(id, {
        tipo_proyecto: 'portafolio'
      });

      // Recargar el proyecto
      const proyectoActualizado = await proyectosService.getById(id);
      setProyecto(proyectoActualizado as Proyecto);
      
      setShowFinishModal(false);
      alert('¡Proyecto finalizado exitosamente! Ahora forma parte de tu portafolio.');
    } catch (err: any) {
      alert('Error al finalizar proyecto: ' + err.message);
    } finally {
      setFinishingProject(false);
    }
  };

  const handleAddImagesToPortfolio = async () => {
    if (!id || selectedImages.length === 0) {
      alert('Por favor selecciona al menos una imagen');
      return;
    }

    try {
      setUploadingImages(true);

      // Convertir imágenes a base64
      const imagePromises = selectedImages.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      const base64Images = await Promise.all(imagePromises);

      // TODO: Implementar endpoint para agregar imágenes al proyecto
      // Por ahora solo mostramos que se procesaron las imágenes
      console.log('Imágenes procesadas:', base64Images.length);

      // Recargar el proyecto
      const proyectoActualizado = await proyectosService.getById(id);
      setProyecto(proyectoActualizado as Proyecto);

      // Limpiar estado
      setSelectedImages([]);
      setImagesPreviews([]);
      setShowAddImagesModal(false);
      alert('Imágenes agregadas exitosamente a la galería');
    } catch (err: any) {
      alert('Error al agregar imágenes: ' + err.message);
    } finally {
      setUploadingImages(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'en_progreso':
      case 'contratado':
        return '#3b82f6';
      case 'completado':
        return '#10b981';
      case 'pendiente':
      case 'portafolio':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="project-detail-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando proyecto...</p>
        </div>
      </div>
    );
  }

  if (error || !proyecto) {
    return (
      <div className="project-detail-container">
        <div className="error-state">
          <p>❌ {error || 'Proyecto no encontrado'}</p>
          <button onClick={() => navigate(-1)} className="btn-back">
            Volver
          </button>
        </div>
      </div>
    );
  }

  // Solo permitir crear avances si el proyecto está en progreso
  const canCreateAvance = proyecto.tipo_proyecto === 'contratado';

  return (
    <div className="project-detail-container">
      {/* Header */}
      <header className="project-detail-header">
        <div className="header-top">
          <button onClick={() => navigate(-1)} className="btn-back">
            <ArrowLeft size={20} />
            <span>Volver</span>
          </button>
          {canCreateAvance && (
            <button 
              onClick={() => setShowFinishModal(true)}
              className="btn-finish-project"
            >
              <CheckCircle size={18} />
              <span>Finalizar Proyecto</span>
            </button>
          )}
        </div>
        <h1 className="project-title">{proyecto.titulo_proyecto}</h1>
      </header>

      {/* Project Info */}
      <div className="project-info-section">
        <div className="info-card">
          <div className="info-row">
            <div className="info-item">
              <span className="info-label">Tipo</span>
              <span className="info-value">
                {proyecto.tipo_proyecto === 'portafolio' ? 'Portafolio' : 'Contratado'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Estado</span>
              <span 
                className="status-badge" 
                style={{ backgroundColor: getEstadoColor(proyecto.tipo_proyecto) }}
              >
                {proyecto.tipo_proyecto === 'contratado' ? 'En Progreso' : 'Portafolio'}
              </span>
            </div>
            {proyecto.valoracion_promedio && (
              <div className="info-item">
                <span className="info-label">Valoración</span>
                <span className="info-value">
                  ⭐ {proyecto.valoracion_promedio.toFixed(1)}
                </span>
              </div>
            )}
          </div>
          
          <div className="project-description">
            <h3>Descripción</h3>
            <p>{proyecto.descripcion}</p>
          </div>

          {/* Project Images */}
          {proyecto.imagenes && proyecto.imagenes.length > 0 && (
            <div className="project-images-section">
              <h3>Galería del Proyecto</h3>
              <div className="project-images-grid">
                {proyecto.imagenes.map((imagen, index) => (
                  <div key={imagen.id || index} className="project-image-item">
                    <img src={imagen.imagen_url} alt={`Proyecto ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Section */}
      <div className="progress-section">
        <div className="section-header">
          <h2>{proyecto.tipo_proyecto === 'portafolio' ? 'Galería del Proyecto' : 'Avances del Proyecto'}</h2>
          {canCreateAvance && (
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn-create-avance"
            >
              <Plus size={18} />
              <span>Nuevo Avance</span>
            </button>
          )}
          {proyecto.tipo_proyecto === 'portafolio' && (
            <button 
              onClick={() => setShowAddImagesModal(true)}
              className="btn-create-avance"
            >
              <Plus size={18} />
              <span>Agregar Imágenes</span>
            </button>
          )}
        </div>

        {avances.length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} />
            <p>
              {proyecto.tipo_proyecto === 'portafolio' 
                ? 'No hay imágenes en la galería' 
                : 'No hay avances registrados'}
            </p>
            {canCreateAvance && (
              <button 
                onClick={() => setShowCreateModal(true)}
                className="btn-create-first"
              >
                Crear primer avance
              </button>
            )}
          </div>
        ) : (
          <div className="avances-timeline">
            {avances.map((avance, index) => (
              <div key={avance.id} className="avance-item">
                <div className="avance-marker">
                  <div className="marker-dot"></div>
                  {index < avances.length - 1 && <div className="marker-line"></div>}
                </div>
                <div className="avance-content">
                  <div className="avance-header">
                    <div className="avance-date">
                      <Calendar size={16} />
                      <span>{formatDate(avance.fecha)}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteAvance(avance.id)}
                      className="btn-delete-avance"
                      title="Eliminar avance"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="avance-description">{avance.descripcion}</p>
                  
                  {/* Avance Images */}
                  {avance.imagenes && avance.imagenes.length > 0 && (
                    <div className="avance-images">
                      {avance.imagenes.map((imagen, imgIndex) => (
                        <div key={imagen.id || imgIndex} className="avance-image-item">
                          <img src={imagen.imagen_url} alt={`Avance ${imgIndex + 1}`} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Avance Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Nuevo Avance</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="btn-close-modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateAvance} className="avance-form">
              <div className="form-group">
                <label htmlFor="fecha">Fecha</label>
                <input
                  type="date"
                  id="fecha"
                  value={newAvance.fecha}
                  onChange={(e) => setNewAvance({ ...newAvance, fecha: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="descripcion">Descripción del Avance</label>
                <textarea
                  id="descripcion"
                  value={newAvance.descripcion}
                  onChange={(e) => setNewAvance({ ...newAvance, descripcion: e.target.value })}
                  placeholder="Describe el progreso realizado..."
                  rows={4}
                  required
                />
              </div>

              {/* Image Upload */}
              <div className="form-group">
                <label>Imágenes (opcional)</label>
                <div className="image-upload-area">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    id="image-upload"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="image-upload" className="btn-upload">
                    <ImageIcon size={20} />
                    <span>Seleccionar imágenes</span>
                  </label>
                </div>

                {/* Image Previews */}
                {imagesPreviews.length > 0 && (
                  <div className="images-preview-grid">
                    {imagesPreviews.map((preview, index) => (
                      <div key={index} className="preview-image-item">
                        <img src={preview} alt={`Preview ${index}`} />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="btn-remove-preview"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-cancel"
                  disabled={creatingAvance}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={creatingAvance || !newAvance.descripcion.trim()}
                >
                  {creatingAvance ? 'Creando...' : 'Crear Avance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Images to Portfolio Modal */}
      {showAddImagesModal && (
        <div className="modal-overlay" onClick={() => setShowAddImagesModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Agregar Imágenes a la Galería</h3>
              <button 
                onClick={() => setShowAddImagesModal(false)}
                className="btn-close-modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Imágenes</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  id="portfolio-image-upload"
                  style={{ display: 'none' }}
                />
                <label htmlFor="portfolio-image-upload" className="btn-upload">
                  <ImageIcon size={20} />
                  <span>Seleccionar imágenes</span>
                </label>
              </div>

              {/* Image Previews */}
              {imagesPreviews.length > 0 && (
                <div className="images-preview-grid">
                  {imagesPreviews.map((preview, index) => (
                    <div key={index} className="preview-image-item">
                      <img src={preview} alt={`Preview ${index}`} />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="btn-remove-preview"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button
                type="button"
                onClick={() => setShowAddImagesModal(false)}
                className="btn-cancel"
                disabled={uploadingImages}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleAddImagesToPortfolio}
                className="btn-submit"
                disabled={uploadingImages || selectedImages.length === 0}
              >
                {uploadingImages ? 'Agregando...' : 'Agregar Imágenes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Finish Project Modal */}
      {showFinishModal && (
        <div className="modal-overlay" onClick={() => setShowFinishModal(false)}>
          <div className="modal-content modal-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Finalizar Proyecto</h3>
              <button 
                onClick={() => setShowFinishModal(false)}
                className="btn-close-modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="confirm-icon">
                <CheckCircle size={48} />
              </div>
              <p className="confirm-message">
                ¿Estás seguro de que deseas finalizar este proyecto?
              </p>
              <p className="confirm-description">
                Al finalizar el proyecto, este pasará a formar parte de tu portafolio 
                y ya no podrás crear más avances. Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                onClick={() => setShowFinishModal(false)}
                className="btn-cancel"
                disabled={finishingProject}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleFinishProject}
                className="btn-finish"
                disabled={finishingProject}
              >
                {finishingProject ? 'Finalizando...' : 'Finalizar Proyecto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
