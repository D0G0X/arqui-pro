class UsuarioSerializer < ActiveModel::Serializer
  attributes :id, :nombre, :apellido, :email, :estado_cuenta, :password, :rol, :fecha_registro, :foto_perfil, :notificaciones
end
