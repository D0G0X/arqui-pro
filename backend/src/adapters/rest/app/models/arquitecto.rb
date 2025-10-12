class Arquitecto < ApplicationRecord
  belongs_to :usuario, dependent: :destroy
  accepts_nested_attributes_for :usuario
  validates :cedula, :valoracion_prom_proyecto, :descripcion, :especialidades, :ubicacion, :vistas_perfil, presence: true
  validates :verificado, inclusion: { in: [ true, false ] }
  validates :cedula, uniqueness: true
end
