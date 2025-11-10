class MensajeSerializer < ActiveModel::Serializer
  attributes :id, :contenido, :fecha_envio, :hora_envio, :leido, :conversacion_id, :remitente_id, :imagenes
end
