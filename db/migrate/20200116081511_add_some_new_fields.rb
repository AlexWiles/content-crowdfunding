# typed: true
class AddSomeNewFields < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :username, :string
    remove_column :projects, :description
  end
end
