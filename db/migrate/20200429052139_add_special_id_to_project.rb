class AddSpecialIdToProject < ActiveRecord::Migration[6.0]
  def change
    add_column :projects, :special_id, :string, unique: true
    add_column :projects, :platform_fee_override, :integer
  end
end
