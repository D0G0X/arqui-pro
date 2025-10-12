class Usuario < ApplicationRecord
    # Solo tiene un cliente asociado
    has_one :cliente, dependent: :destroy
    # Solo tiene un arquitecto asociado
    has_one :arquitecto, dependent: :destroy
    # Validaciones
    validates :nombre, :apellido, :email, :estado, :password, :rol, :fecha_registro, :foto_perfil, presence: true
    # El email debe ser único
    validates :email, uniqueness: true
end
