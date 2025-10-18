class Avance < ApplicationRecord
  before_create :set_fecha

  # Un avance pertence a un proyecto
  belongs_to :proyecto

  has_many :imagen_asociaciones, as: :asociable, dependent: :destroy
  has_many :imagenes, through: :imagen_asociaciones

  # Validaciones
  validates :descripcion, presence: true

  private
  def set_fecha()
    self.fecha ||= Time.current
  end
end
