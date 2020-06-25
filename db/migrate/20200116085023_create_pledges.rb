# typed: true
class CreatePledges < ActiveRecord::Migration[6.0]
  def change
    create_table :pledges do |t|
      t.references :project, null: false, foreign_key: true
      t.string :email
      t.integer :amount

      t.timestamps
    end
  end
end
