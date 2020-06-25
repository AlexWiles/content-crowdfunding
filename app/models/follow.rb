class Follow < ApplicationRecord
  include AASM

  belongs_to :user
  belongs_to :project

  scope :should_notify, ->{ includes(:user).notify.where.not(users: {confirmed_at: nil}) }
  scope :not_deleted, ->{ where.not(aasm_state: :deleted)}

  scope :published_project, ->{ includes(:project).where(projects: { aasm_state: :published }) }

  aasm do
    state :notify, initial: true
    state :silent
    state :deleted

    event :silence do
      transitions from: [:notify, :silent], to: :silent
    end

    event :can_notify do
      transitions from: [:deleted, :silent, :notify], to: :notify
    end

    event :mark_deleted do
      transitions from: [:notify, :silent], to: :deleted
    end
  end
end
