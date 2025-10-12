class UsuarioSerializer < ActiveModel::Serializer
  attributes :id, :nombre, :apellido, :email, :estado, :password, :rol, :fecha_registro, :foto_perfil
end
