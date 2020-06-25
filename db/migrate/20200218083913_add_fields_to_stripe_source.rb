class AddFieldsToStripeSource < ActiveRecord::Migration[6.0]
  def change
    add_column :stripe_sources, :object, :string
    add_column :stripe_sources, :brand, :string
    add_column :stripe_sources, :country, :string
    add_column :stripe_sources, :exp_month, :integer
    add_column :stripe_sources, :exp_year, :integer
    add_column :stripe_sources, :last4, :string
  end
end
