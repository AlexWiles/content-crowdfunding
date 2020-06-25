module React
  class PostForm
    extend R::Lib

    def self.name
      "PostForm"
    end

    def self.props(post)
      data = {
        title: post.title,
        subtitle: post.description,
        body: post.body,
        resourceURL: urls.user_project_post_path(post.project.user, post.project.id, post.id),
        published: post.published?,
      }

      unless post.published?
        data[:publishButton] = React::PostPublishButton.props(post)
      end

      data
    end
  end
end