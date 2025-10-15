class Notificacion < ApplicationRecord
  # Una notificación pertenece a un usuario
  belongs_to :usuario

  validates :mensaje, :fecha, presence: true
  validates :leido, inclusion: { in: [ true, false ] }
end
