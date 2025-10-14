class Conversacion < ApplicationRecord
  belongs_to :cliente
  belongs_to :arquitecto

  validates :fecha, presence: true
end
