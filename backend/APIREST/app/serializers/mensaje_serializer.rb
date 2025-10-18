class MensajeSerializer < ActiveModel::Serializer
  attributes :id, :contenido, :fecha_envio, :leido, :conversacion_id, :remitente_id, :imagenes
end
