class CreateArquitectos < ActiveRecord::Migration[8.0]
  def change
    create_table :arquitectos, id: :uuid do |t|
      t.string :cedula
      t.float :valoracion_prom_proyecto
      t.text :descripcion
      t.string :especialidades
      t.string :ubicacion
      t.boolean :verificado
      t.integer :vistas_perfil
      t.references :usuario, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
      add_index :arquitectos, :cedula, unique: true
  end
end
