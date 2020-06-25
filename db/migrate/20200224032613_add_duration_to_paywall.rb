class AddDurationToPaywall < ActiveRecord::Migration[6.0]
  def change
    add_column :paywalls, :duration, :integer
  end
end
