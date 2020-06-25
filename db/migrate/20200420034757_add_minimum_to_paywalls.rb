class AddMinimumToPaywalls < ActiveRecord::Migration[6.0]
  def change
    add_monetize :paywalls, :minimum, amount: { null: true, default: nil }
  end
end
