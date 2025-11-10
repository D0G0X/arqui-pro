class Proyecto < ApplicationRecord
  # Un Proyecto pertenece a un arquitecto
  belongs_to :arquitecto

  # Un proyecto puede pertenecer a un cliente (opcional)
  belongs_to :cliente, optional: true

  # Un proyecto puede pertenecer a una solicitud_proyecto (opcional)
  belongs_to :solicitud_proyecto, optional: true

  # Un proyecto puede pertenecer a una conversacion (opcional)
  belongs_to :conversacion, optional: true

  # Un proyecto tiene muchos avances
  # Si se elimina un proyecto, se eliminan tambien todos sus avances
  has_many :avances, dependent: :destroy

  # Un proyecto puede tener muchas valoraciones
  # Si se elimina un proyecto, se eliminan tambien todas sus valoraciones
  has_many :valoraciones

  has_many :imagen_asociaciones, as: :asociable, dependent: :destroy
  has_many :imagenes, through: :imagen_asociaciones

  # Validaciones
  validates :titulo_proyecto, :descripcion, presence: true
  validates :valoracion_promedio, numericality: { greater_than_or_equal_to: 0.0, less_than_or_equal_to: 5.0 }, allow_nil: true
  validates :tipo_proyecto, presence: true, inclusion: { in: [ "portafolio", "contratado" ] }
end
