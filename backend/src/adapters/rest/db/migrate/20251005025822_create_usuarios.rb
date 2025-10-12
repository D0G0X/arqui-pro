class CreateUsuarios < ActiveRecord::Migration[8.0]
  def change
    create_table :usuarios, id: :uuid do |t|
      t.string :nombre
      t.string :apellido
      t.string :email
      t.string :estado
      t.string :password
      t.string :rol
      t.date :fecha_registro
      t.string :foto_perfil

      t.timestamps
    end
      add_index :usuarios, :email, unique: true
  end
end
