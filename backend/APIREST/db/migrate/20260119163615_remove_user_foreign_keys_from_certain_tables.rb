class RemoveUserForeignKeysFromCertainTables < ActiveRecord::Migration[8.0]
  def change
    # Remover llaves foráneas de incidencias
    remove_foreign_key :incidencias, column: :usuario_emisor_id
    remove_foreign_key :incidencias, column: :usuario_infractor_id
    
    # Remover llave foránea de mensajes
    remove_foreign_key :mensajes, column: :remitente_id
    
    # Remover llave foránea de notificaciones
    remove_foreign_key :notificaciones, :usuarios
  end
end
