class Moderador < ApplicationRecord
  # Cuando se elimina un moderador, se elimina también su usuario asociado
  belongs_to :usuario, dependent: :destroy
  accepts_nested_attributes_for :usuario

  # Un moderador puede tener muchas verificaciones
  has_many :verificaciones

  validates :usuario, presence: true
end
