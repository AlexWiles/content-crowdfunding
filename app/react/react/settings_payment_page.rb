module React
  class SettingsPaymentPage
    extend R::Lib

    def self.name
      "SettingsPaymentPage"
    end

    def self.props(user, stripe_oauth_link)
      {
        user: R::User.s(user),
        updateUrl: urls.settings_update_user_url,
        stripeOauthUrl: stripe_oauth_link,
        stripeDashboardUrl: urls.settings_stripe_dashboard_url(subdomain: "")
      }
    end
  end
end