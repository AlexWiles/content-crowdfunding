# typed: true
class AddDisplayNameToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :display_name, :string
  end
end
