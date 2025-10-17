class Valoracion < ApplicationRecord
  defore_create :set_fecha
  # Una valoracion le pertence a un cliente
  belongs_to :cliente

  # Una valoracion le pertenece a un proyecto
  belongs_to :proyecto

  # Validaciones
  validates :calificacion, comentario, presence: true

  private
  def set_fecha()
    self.fecha ||= Time.current
  end
end
