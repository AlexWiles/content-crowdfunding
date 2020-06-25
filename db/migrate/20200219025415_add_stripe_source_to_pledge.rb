class AddStripeSourceToPledge < ActiveRecord::Migration[6.0]
  def change
    add_reference :pledges, :stripe_source, null: false, foreign_key: true
  end
end
