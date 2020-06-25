class AddColorToProjects < ActiveRecord::Migration[6.0]
  def change
    add_column :projects, :color, :string
    add_column :posts, :color, :string
  end
end
