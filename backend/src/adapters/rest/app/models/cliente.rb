class Cliente < ApplicationRecord
  belongs_to :usuario, dependent: :destroy
  accepts_nested_attributes_for :usuario
  validates :cedula, presence: true, uniqueness: true
end
