class Conversacion < ApplicationRecord
  # Una conversacion le pertence a un cliente 
  belongs_to :cliente

  # Una converscion le pertenece a un arquitecto
  belongs_to :arquitecto

  # Una conversacion puede tener muchos mensajes
  # Si se elimina una conversacion, se eliminan tambien todos los mensajes
  has_many :mensajes, dependent: :destroy

  # Validaciones
  # fecha tiene default (CURRENT_DATE), por lo que no es obligatoria en entrada
end
