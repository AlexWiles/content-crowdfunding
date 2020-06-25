# typed: true
class AddTypeToProject < ActiveRecord::Migration[6.0]
  def change
    add_column :projects, :project_type, :string
  end
end
