# typed: false
class Project < ApplicationRecord
  include AASM
  include ActionText::Attachable

  DEFAULT_POST_ORDER = "desc"

  extend FriendlyId
  friendly_id :title, use: :history

  has_many :posts
  has_many :paywalls
  has_many :follows

  belongs_to :user

  accepts_nested_attributes_for :paywalls
  accepts_nested_attributes_for :posts

  has_rich_text :about

  has_many_attached :images

  aasm do
    state :unpublished, initial: true
    state :published
    state :archived

    event :publish do
      transitions from: [:unpublished], to: :published
    end

    event :unpublish do
      transitions from: :published, to: :unpublished
    end

    event :archive do
      transitions from: [:unpublished, :published], to: :archived
    end
  end

  before_save do |project|
    if project.color.nil?
      project.color = "#" + 3.times.map{ rand(255).to_s(16).rjust(2, '0')}.join()
    end
  end

  def should_generate_new_friendly_id?
    title_changed? || new_record?
  end

  def is_users(user)
    user_id.present? && user.present? && user_id == user.id
  end

  def followed_by(user)
    follows.find_by(user: user).presence
  end

  def posts_for_user(user)
    if user.present? && is_users(user)
      posts
    else
      posts.published
    end
  end

  def current_paywall
    @current_paywall ||= paywalls.first
  end

  def crowdfund
    paywalls.crowdfund.first
  end

  def crowdfund?
    crowdfund.present?
  end

  def buy?
    paywalls.buy.first.present?
  end

  def free?
    current_paywall.free?
  end

  def can_publish?
    can, issue = ProjectService.can_publish_reason(self)
    can
  end

  def first_image
    @first_image ||= begin
      return unless body
      image_entity = body["entityMap"]
        .sort_by{ |k, v| k.to_i }
        .find{ |k, v| v["type"] == "IMAGE" }
        &.last

      puts image_entity

      if image_entity
        images.find_by(id: image_entity["data"]["uncommaId"])
      end
    end
  end

  def first_image_url
    if first_image
      AttachmentService.cdn_url(first_image)
    end
  end
end