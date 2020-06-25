class CreatePostNotifications < ActiveRecord::Migration[6.0]
  def change
    create_table :post_notifications do |t|
      t.references :post, null: false, foreign_key: true
      t.references :follow, null: false, foreign_key: true
      t.datetime :sent_at
      t.string :aasm_state

      t.timestamps
    end

    add_index :post_notifications, [:post_id, :follow_id], unique: true
  end
end
