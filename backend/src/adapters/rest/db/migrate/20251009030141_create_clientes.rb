class CreateClientes < ActiveRecord::Migration[8.0]
  def change
    create_table :clientes, id: :uuid do |t|
      t.string :cedula
      t.references :usuario, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
      add_index :clientes, :cedula, unique: true
  end
end
