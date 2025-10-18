class Incidencia < ApplicationRecord
  before_create :set_fecha

  belongs_to :usuario_emisor, class_name: "Usuario"
  belongs_to :usuario_infractor, class_name: "Usuario"
  belongs_to :moderador

  has_many :imagen_asociaciones, as: :asociable, dependent: :destroy
  has_many :imagenes, through: :imagen_asociaciones

  # validaciones
  validates :descripcion, presence: true
  validates :estado, presence: true, inclusion: { in: [ 'pendiente', 'resuelto', 'en revision' ] }
  private
  def set_fecha()
    self.fecha ||= Time.current
  end
end
