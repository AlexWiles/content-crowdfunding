class PostNotification < ApplicationRecord
  include AASM

  belongs_to :post
  belongs_to :follow

  aasm do
    state :unsent, initial: true
    state :sending
    state :sent

    event :mark_sending do
      transitions from: [:unsent], to: :sending
    end

    event :mark_sent do
      transitions from: [:sending], to: :sent
    end
  end
end
