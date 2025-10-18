class ValoracionSerializer < ActiveModel::Serializer
  attributes :id, :calificacion, :comentario, :fecha, :cliente_id, :proyecto_id
end
