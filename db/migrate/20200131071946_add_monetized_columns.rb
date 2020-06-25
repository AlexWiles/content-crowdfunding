# typed: true
class AddMonetizedColumns < ActiveRecord::Migration[6.0]
  def change
    remove_column :paywalls, :amount
    add_monetize :paywalls, :amount

    remove_column :pledges, :amount
    add_monetize :pledges, :amount
  end
end
