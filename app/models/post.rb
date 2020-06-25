# typed: false
class Post < ApplicationRecord
  include AASM

  extend FriendlyId
  friendly_id :title, use: :history

  belongs_to :project
  has_rich_text :content
  has_many_attached :images

  scope :published, ->{ includes(:project).where(projects: {aasm_state: :published}, state: :published) }
  scope :notifications_not_created, ->{ where(notifications_created_at: nil) }
  scope :not_archived, ->{ where.not(state: :archived) }

  aasm column: "state" do
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
      transitions from: [:published, :unpublished], to: :archived
    end
  end

  before_save do |post|
    if post.color.nil?
      post.color = "#" + 3.times.map{ rand(255).to_s(16).rjust(2, '0')}.join()
    end
  end

  def should_generate_new_friendly_id?
    title_changed? || new_record?
  end

  def first_image
    @first_image ||= begin
      image_entity = (body|| {}).fetch("entityMap", {})
        .sort_by{ |k, v| k.to_i }
        .find{ |k, v| v["type"] == "IMAGE" }
        &.last

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

  def follows
    project.follows
  end
end
