# typed: true
class AddDescriptionToProject < ActiveRecord::Migration[6.0]
  def change
    add_column :projects, :description, :string
  end
end
