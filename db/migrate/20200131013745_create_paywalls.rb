# typed: true
class CreatePaywalls < ActiveRecord::Migration[6.0]
  def change
    create_table :paywalls do |t|
      t.string :funding_type
      t.references :project, null: false, foreign_key: true
      t.integer :amount

      t.timestamps
    end
  end
end
