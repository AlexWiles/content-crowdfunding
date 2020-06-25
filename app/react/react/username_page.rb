module React
  class UsernamePage
    extend R::Lib

    def self.name
      "UsernamePage"
    end

    def self.props(next_url=nil)
      {
        nextUrl: next_url || urls.dashboard_url,
        slugValidationUrl: urls.settings_check_slug_url,
        updateUrl: urls.settings_update_user_url,
        domain: Rails.configuration.domain
      }
    end
  end
end