# typed: true
class DropStateFromPledge < ActiveRecord::Migration[6.0]
  def change
    remove_column :pledges, :state
  end
end
