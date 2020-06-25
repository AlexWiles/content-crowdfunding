class AddNotificationStateToPost < ActiveRecord::Migration[6.0]
  def change
    add_column :posts, :notifications_created_at, :datetime
  end
end
