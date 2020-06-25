class CreateUnconfirmedFollows < ActiveRecord::Migration[6.0]
  def change
    create_table :unconfirmed_follows do |t|
      t.references :user, null: false, foreign_key: true
      t.references :project, null: false, foreign_key: true
      t.string :aasm_state
      t.timestamps

      t.index [:user_id, :project_id], unique: true
    end
  end
end
