class CreateStripeAccounts < ActiveRecord::Migration[6.0]
  def change
    create_table :stripe_accounts do |t|
      t.string :stripe_id
      t.belongs_to :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
