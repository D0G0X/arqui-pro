class Proyecto < ApplicationRecord
  # Un Proyecto pertenece a un arquitecto
  belongs_to :arquitecto

  # Un proyecto puede pertenecer a un cliente (opcional)
  belongs_to :cliente, optional: true

  # Un proyecto puede pertenecer a una solicitud_proyecto (opcional)
  belongs_to :solicitud_proyecto, optional: true

  # Un proyecto puede pertenecer a una conversacion (opcional)
  belongs_to :conversacion, optional: true

  # Validaciones
  validates :titulo_proyecto, :valoracion_promedio, :descripcion, :fecha_publicacion, presence: true
  validates :tipo_proyecto, presence: true, inclusion: { in: [ "portafolio", "contratado" ] }
end
