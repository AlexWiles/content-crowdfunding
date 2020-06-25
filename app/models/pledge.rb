# typed: false
class Pledge < ApplicationRecord
  include AASM

  belongs_to :paywall
  belongs_to :user
  belongs_to :stripe_source

  monetize :amount_cents

  scope :pending, ->{ where(state: "pending") }
  scope :confirmed, ->{ where(state: "confirmed") }

  aasm :column => 'state' do
    state :pending, initial: true
    state :confirmed

    event :confirm do
      transitions from: :pending, to: :confirmed
    end
  end

  def meets_minimum?
    return true unless paywall.crowdfund?

    paywall.minimum <= amount
  end
end
