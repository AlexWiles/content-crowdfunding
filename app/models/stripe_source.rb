class StripeSource < ApplicationRecord
  belongs_to :stripe_customer
  has_many :pledges
end
