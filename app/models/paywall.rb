# typed: false
class Paywall < ApplicationRecord
  include AASM

  belongs_to :project
  has_many :pledges

  monetize :amount_cents
  monetize :minimum_cents, allow_nil: true

  FREE = "free"
  PAYWALL = "paywall"
  CROWDFUND = "crowdfund"
  SUBSCRIPTION = "subscription"


  scope :crowdfund, ->{ where(funding_type: CROWDFUND) }
  scope :buy, ->{ where(funding_type: PAYWALL) }
  scope :expired, ->{ includes(:project).published.where(projects: { aasm_state: :published }).where("expires_at < ?", Time.now) }

  validates :amount_cents, numericality: { only_integer: true, greater_than_or_equal_to: 1 }, if: :crowdfund?
  validates :minimum_cents, numericality: { only_integer: true, greater_than_or_equal_to: 1 }, if: :crowdfund?

  validates :duration,
    allow_nil: true,
    numericality: {
      only_integer: true,
      greater_than_or_equal_to: 1,
      less_than_or_equal_to: 60
    }


  aasm do
    state :unpublished, initial: true
    state :published
    state :successful
    state :failed
    state :archived

    event :publish do
      transitions from: [:unpublished], to: :published
    end

    event :succeed do
      transitions from: :published, to: :successful
    end

    event :fail do
      transitions from: :published, to: :failed
    end

    event :unpublish do
      transitions from: :published, to: :unpublished
    end

    event :archive do
      transitions from: [:unpublished, :published, :successful, :failed, :archived], to: :archived
    end
  end

  def paywall?
    funding_type == PAYWALL
  end

  def crowdfund?
    funding_type == CROWDFUND
  end

  def subscription?
    funding_type == SUBSCRIPTION
  end

  def free?
    funding_type == FREE
  end

  def requires_payment?
    crowdfund? || paywall?
  end

  def can_update_amount?
    if crowdfund? && project.published?
      return false
    else
      return true
    end
  end

  def for_user(user)
    pledges.find_by(user: user)
  end
end
