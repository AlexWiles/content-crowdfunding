# typed: true
class AddStateToPledges < ActiveRecord::Migration[6.0]
  def change
    add_column :pledges, :state, :string
  end
end
