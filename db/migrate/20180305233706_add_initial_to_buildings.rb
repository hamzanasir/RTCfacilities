class AddInitialToBuildings < ActiveRecord::Migration[5.1]
  def change
    add_column :buildings, :initial, :string
  end
end
