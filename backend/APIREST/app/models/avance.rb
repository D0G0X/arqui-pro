class Avance < ApplicationRecord
  defore_create :set_fecha

  # Un avance pertence a un proyecto
  belongs_to :proyecto

  # Validaciones
  validates :descripcion, presence: true

  private
  def set_fecha()
    self.fecha ||= Time.current
  end
end
