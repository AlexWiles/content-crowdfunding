# typed: true
class AddColsToPaywalls < ActiveRecord::Migration[6.0]
  def change
    add_column :paywalls, :aasm_state, :string
    add_column :paywalls, :published_at, :datetime
    add_column :paywalls, :expires_at, :datetime
  end
end
