class AddHoraEnvioToMensaje < ActiveRecord::Migration[8.0]
  def change
    add_column :mensajes, :hora_envio, :time, null: false, default: -> { "CURRENT_TIME" }
  end
end
