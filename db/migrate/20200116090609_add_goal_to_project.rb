# typed: true
class AddGoalToProject < ActiveRecord::Migration[6.0]
  def change
    add_column :projects, :goal, :integer
  end
end
