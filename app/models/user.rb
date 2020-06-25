# typed: false
class User < ApplicationRecord
  extend FriendlyId

  friendly_id :username, use: :slugged

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable

  has_many :projects
  has_many :pledges
  has_many :follows
  has_one :stripe_account
  has_one :stripe_customer

  has_rich_text :about
  has_one_attached :avatar

  VALID_AVATAR_TYPES = ["image/jpeg", "image/jpg", "image/png"]
  validates :avatar, {
    attached: true,
    allow_blank: true,
    size: { less_than: 10.megabytes },
    content_type: VALID_AVATAR_TYPES
  }

  validates :username, {
    uniqueness: true,
    case_sensitive: false,
    allow_nil: true,
    length: { minimum: 2 },
    format: { with: /\A[a-zA-Z0-9]+\z/i, message: "Subdomain can only container letters and numbers"}
  }

  before_validation do |user|
    user.username = user.username.downcase if user.username.present?
  end

  before_save do |user|
    if user.color.nil?
      user.color = "#" + 3.times.map{ rand(255).to_s(16).rjust(2, '0')}.join()
    end
  end

  def password_required?
    confirmed? ? super : false
  end

  def avatar_url
    if avatar.attached?
      AttachmentService.cdn_url(avatar.variant(resize_to_limit: [200, 200]))
    end
  end
end
