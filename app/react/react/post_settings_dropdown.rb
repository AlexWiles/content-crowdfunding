module React
  class PostSettingsDropdown
    extend R::Lib

    def self.name
      "PostSettingsDropdown"
    end

    def self.props(post)
      {
        postLinks: [
            {icon: "chevronleft", text: "Project", href: urls.project_url(post.project, subdomain: post.project.user.slug)},
            {icon: "eye", text: "View Post", href: urls.project_post_url(post.project, post, subdomain: post.project.user.slug) },
            {icon: "edit", text: "Edit Post", href: urls.edit_user_project_post_path(post.project.user, post.project, post) },
            {icon: "settings", text: "Post Settings", href: urls.user_project_post_settings_path(post.project.user, post.project, post) },
        ],
        projectLink: urls.user_project_path(post.project.user, post.project, subdomain: post.project.user.slug)
      }
    end
  end
end