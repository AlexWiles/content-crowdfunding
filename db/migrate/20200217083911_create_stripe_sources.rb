class CreateStripeSources < ActiveRecord::Migration[6.0]
  def change
    create_table :stripe_sources do |t|
      t.string :stripe_id
      t.belongs_to :stripe_customer, null: false, foreign_key: true

      t.timestamps
    end
  end
end
