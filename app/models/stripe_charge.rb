class StripeCharge < ApplicationRecord
  include AASM

  belongs_to :stripe_source
  belongs_to :stripe_account
  belongs_to :pledge

  scope :uncharged, ->{ where(stripe_id: nil) }

  monetize :total_cents
  monetize :paid_cents
  monetize :stripe_fee_cents
  monetize :platform_fee_cents


  aasm do
    state :unattempted, initial: true
    state :attempting
    state :completed

    event :attempt do
      transitions from: [:unattempted, :attempting], to: :attempting
    end

    event :complete do
      transitions from: :attempting, to: :completed
    end
  end

end
