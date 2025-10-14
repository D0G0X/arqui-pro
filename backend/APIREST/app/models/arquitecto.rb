class Arquitecto < ApplicationRecord
  # Un arquitecto pertenece a un usuario
  # Cuando se elimina un arquitecto, se elimina también su usuario asociado
  belongs_to :usuario, dependent: :destroy
  accepts_nested_attributes_for :usuario
  # Un arquitecto puede tener muchas conversaciones
  # Cuando se elimina un arquitecto, se eliminan también sus conversaciones
  has_many :conversaciones, dependent: :destroy

  # Un arquitecto puede tener una verificacion
  # Cuando se elimina un arquitecto, se elimina también su verificacion
  has_one :verificaciones, dependent: :destroy

  # validaciones
  validates :cedula, :valoracion_prom_proyecto, :descripcion, :especialidades, :ubicacion, :vistas_perfil, presence: true
  validates :verificado, inclusion: { in: [ true, false ] }
  validates :cedula, uniqueness: true
end
