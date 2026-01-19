class Mensaje < ApplicationRecord
  # Un mensaje pertenece a una conversacion
  belongs_to :conversacion

  # Un mensaje ya no pertenece a un objeto remitente (usuario) en DB, solo guarda su UUID
  # belongs_to :remitente, class_name: "Usuario"
  validates :remitente_id, presence: true
  
  has_many :imagen_asociaciones, as: :asociable, dependent: :destroy
  has_many :imagenes, through: :imagen_asociaciones
  
  # Callbacks - asignar fecha y hora antes de crear
  before_create :set_fecha_y_hora
  
  # Validaciones
  # Permitir contenido vacío (puede ser solo imágenes)
  validates :leido, inclusion: { in: [ true, false ] }
  
  private
  
  def set_fecha_y_hora
    ahora = Time.current
    self.fecha_envio ||= ahora.to_date
    self.hora_envio ||= ahora.strftime('%H:%M:%S')
  end
end
