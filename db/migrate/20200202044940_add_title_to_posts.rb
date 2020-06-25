# typed: true
class AddTitleToPosts < ActiveRecord::Migration[6.0]
  def change
    add_column :posts, :title, :string
    add_column :posts, :published_at, :datetime
    add_column :posts, :description, :string
  end
end
