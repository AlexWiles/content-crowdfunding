class StripeCustomer < ApplicationRecord
  belongs_to :user
  has_many :stripe_sources
end
