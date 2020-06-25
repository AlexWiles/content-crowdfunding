# typed: true
class AddPaywallReferenceToPledge < ActiveRecord::Migration[6.0]
  def change
    remove_column :pledges, :project_id
    add_reference :pledges, :paywall, null: false, foreign_key: true
  end
end
