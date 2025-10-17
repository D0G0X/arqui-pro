class Mensaje < ApplicationRecord
  # Un mensaje pertenece a una conversacion
  belongs_to :conversacion

  # Un mensaje pertenece a un remitente (usuario)
  belongs_to :remitente, class_name: "Usuario"

  # Validaciones
  validates :contenido, presence: true
  validates :leido, inclusion: { in: [ true, false ] }
end
