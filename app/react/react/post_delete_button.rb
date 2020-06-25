module React
  class PostDeleteButton
    extend R::Lib

    def self.name
      "DeleteButton"
    end

    def self.props(post)
       {
          path: urls.user_project_post_path(post.project.user, post.project, post),
          text: "Delete this post",
          messages: ["Are you sure you want to delete this post?"]
        }
    end
  end
end