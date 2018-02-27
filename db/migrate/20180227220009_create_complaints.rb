class CreateComplaints < ActiveRecord::Migration[5.1]
  def change
    create_table :complaints do |t|
      t.text :complaint
      t.boolean :higher
      t.boolean :satisfied

      t.timestamps
    end
  end
end
