class Notificacion < ApplicationRecord
  # Una notificación ya no pertenece a un objeto usuario en DB, solo guarda su UUID
  # belongs_to :usuario
  
  # validaciones
  validates :usuario_id, presence: true
  validates :mensaje, presence: true
  validates :leido, inclusion: { in: [ true, false ] }
end
