class AddBodyToProject < ActiveRecord::Migration[6.0]
  def change
    add_column :projects, :body, :json
  end
end
