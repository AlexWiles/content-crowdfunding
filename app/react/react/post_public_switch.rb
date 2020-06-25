module React
  class PostPublicSwitch
    extend R::Lib

    def self.name
      "PostPublicSwitch"
    end

    def self.props(post)
    {
      url: urls.user_project_post_update_public_path(post.project.user, post.project, post),
      isPublic: post.public
    }
    end
  end
end