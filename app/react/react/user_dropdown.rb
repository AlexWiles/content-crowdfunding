module React
  class UserDropdown
    extend R::Lib

    def self.name
      "UserDropdown"
    end

    def self.props(user)
      {
        email: user.email,
        user: R::User.s(user),
        links: [
          {text: "My Projects", href: urls.dashboard_path, icon: "home"},
          {text: "Following", href: urls.following_path, icon: "users"},
          {text: "Settings", href: urls.settings_path, icon: "settings"},
          {text: "Logout", href: urls.destroy_user_session_path, method: "delete", icon: "logout"},
        ]
      }
    end
  end
end