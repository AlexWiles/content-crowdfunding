# typed: true
class AddStateToPledge < ActiveRecord::Migration[6.0]
  def change
    add_column :pledges, :state, :string, default: "pending"
  end
end
