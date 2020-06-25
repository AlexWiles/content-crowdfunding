module R
  class User
    extend R::Lib

    def self.s(user)
      {
        color: user.color,
        userName: user.username,
        displayName: user.display_name,
        stripeConnected: user.stripe_account.present?,
        profileURL: user.slug.present? ? urls.root_url(subdomain: user.slug) : nil,
        avatar: user.avatar.attached? ? AttachmentService.cdn_url(user.avatar.variant(resize_to_limit: [200, 200])) : nil,
      }
    end
  end
end