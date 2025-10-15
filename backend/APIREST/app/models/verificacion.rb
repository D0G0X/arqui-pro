class Verificacion < ApplicationRecord
  # Una verificación pertenece a un arquitecto y a un moderador
  belongs_to :arquitecto
  belongs_to :moderador

  # Validaciones
  validates :estado, :fecha_verificacion, presence: true
  # El estado debe ser uno de los valores permitidos
  validates :estado, inclusion: { in: [ "pendiente", "verificado", "rechazado" ] }
  
  # Un arquitecto solo puede tener una verificación
  # Se asegura con una validación de unicidad
  validates :arquitecto_id, uniqueness: true
end
