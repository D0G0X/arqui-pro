class Usuario < ApplicationRecord
    # Solo tiene un cliente asociado
    # Cuando se elimina un usuario, se elimina también su cliente asociado
    has_one :cliente, dependent: :destroy

    # Solo tiene un arquitecto asociado
    # Cuando se elimina un usuario, se elimina también su arquitecto asociado
    has_one :arquitecto, dependent: :destroy

    # Solo tiene un moderador asociado
    # Cuando se elimina un usuario, se elimina también su moderador asociado
    has_one :moderador, dependent: :destroy

    # Un usuario puede tener muchas notificaciones
    # Cuando se elimina un usuario, se eliminan también sus notificaciones
    has_many :notificaciones, dependent: :destroy

    # Un usuario puede tener muchas Incidencias
    has_many :incidencias_emitidas, class_name: "Incidencia", foreign_key: "usuario_emisor_id"
    has_many :incidencias_recibidas, class_name: "Incidencia", foreign_key: "usuario_infractor_id"   

    # Un usuario puede tener muchos mensajes
    has_many :mensajes, class_name: "Mensaje", foreign_key: "remitente_id"

    # Validaciones
    validates :nombre, :apellido, :email, :estado_cuenta, :password, :rol, :fecha_registro, :foto_perfil, presence: true
    validates :estado_cuenta, inclusion: { in: ['suspendido', 'activo'] }
    validates :rol, inclusion: { in: ['cliente', 'arquitecto', 'moderador'] }
    # El email debe ser único
    validates :email, uniqueness: true
end
