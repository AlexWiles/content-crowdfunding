class AddPostOrderToProject < ActiveRecord::Migration[6.0]
  def change
    add_column :projects, :post_order, :string
  end
end
