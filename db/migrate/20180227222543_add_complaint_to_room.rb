class AddComplaintToRoom < ActiveRecord::Migration[5.1]
  def change
    add_reference :complaints, :room, foreign_key: true
  end
end
