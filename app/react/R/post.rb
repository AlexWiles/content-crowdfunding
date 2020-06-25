module R
  class Post
    extend R::Lib

    def self.s(post)
      {
        id: post.id,
        title: post.title,
        description: post.description,
        body: post.body,
        published: post.published?,
        displayDate: display_date(post),
        firstImageUrl: post.first_image_url,
        color: post.color,
        urls: {
          view: urls.project_post_path(post.project, post, subdomain: post.project.user.slug),
          edit: urls.edit_user_project_post_url(post.project.user, post.project, post),
        }
      }
    end
  end
end