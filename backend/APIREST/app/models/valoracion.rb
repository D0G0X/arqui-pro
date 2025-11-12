class Valoracion < ApplicationRecord
  before_create :set_fecha
  after_create :update_proyecto_valoracion_promedio
  after_update :update_proyecto_valoracion_promedio
  after_destroy :update_proyecto_valoracion_promedio

  # Una valoracion le pertence a un cliente
  belongs_to :cliente

  # Una valoracion le pertenece a un proyecto
  belongs_to :proyecto

  # Validaciones
  validates :calificacion, :comentario, presence: true

  private

  def set_fecha()
    self.fecha ||= Time.current
  end

  def update_proyecto_valoracion_promedio
    return unless proyecto

    # Calcular el promedio de todas las valoraciones del proyecto
    valoraciones = proyecto.valoraciones
    
    if valoraciones.any?
      promedio = valoraciones.average(:calificacion).to_f.round(2)
      proyecto.update(valoracion_promedio: promedio)
    else
      proyecto.update(valoracion_promedio: 0.0)
    end
  end
end
