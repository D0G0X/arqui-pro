class ModeradorSerializer < ActiveModel::Serializer
  attributes :id, :num_incidencias_resueltas, :num_arquitectos_verificados
end
