class CreateStripeCharges < ActiveRecord::Migration[6.0]
  def change
    create_table :stripe_charges do |t|
      t.string :stripe_id
      t.belongs_to :stripe_source, null: false, foreign_key: true
      t.belongs_to :stripe_account, null: false, foreign_key: true
      t.belongs_to :pledge, null: false, foreign_key: true
      t.monetize :total
      t.monetize :paid
      t.monetize :stripe_fee
      t.monetize :platform_fee
      t.string :aasm_state

      t.timestamps
    end
  end
end
