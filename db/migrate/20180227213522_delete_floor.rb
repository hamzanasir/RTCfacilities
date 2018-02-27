class DeleteFloor < ActiveRecord::Migration[5.1]
  def change
    drop_table(:floors)
  end
end
