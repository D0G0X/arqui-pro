class Incidencia < ApplicationRecord
  before_create :set_fecha

  belongs_to :usuario_emisor, class_name: "Usuario", foreign_key: "usuario_emisor_id"
  belongs_to :usuario_infractor, class_name: "Usuario", foreign_key: "usuario_infractor_id"
  belongs_to :moderador, optional: true
  
  # Métodos para facilitar el acceso desde el controlador (en lugar de alias_attribute)
  def emisor
    usuario_emisor
  end
  
  def infractor
    usuario_infractor
  end

  has_many :imagen_asociaciones, as: :asociable, dependent: :destroy
  has_many :imagenes, through: :imagen_asociaciones

  # validaciones
  validates :descripcion, presence: true
  validates :estado, inclusion: { in: [ 'pendiente', 'resuelto', 'en_revision', 'rechazado' ] }
  private
  def set_fecha()
    self.fecha ||= Time.current
  end
end
