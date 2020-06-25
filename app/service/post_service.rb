class PostService
  extend ServiceHelpers

  def self.publish!(post)
    transaction do
      ProjectService.publish!(post.project) if post.project.unpublished?

      post.project.follows.should_notify.find_each do |follow|
        PostNotification.create!(post: post, follow: follow)
      end

      post.notifications_created_at = Time.current
      post.published_at = Time.current
      post.publish
      post.save!
    end
  end

  def self.publish(post)
    handle_exception{ publish!(post) }
  end

  def self.destroy!(post)
    post.archive!
  end

  def self.slug_query(project, post_slug)
    begin
      post = project.posts.friendly.find(post_slug)
      return [nil, :not_found] unless post.present?
      return [post, :moved] if post.slug != post_slug
      return [post, :ok]
    rescue ActiveRecord::RecordNotFound
      return [nil, :not_found]
    end
  end


  def self.handle_error(post, &block)
    block.call
  rescue Exception => e
    if Rails.env.production?
      Rollbar.error(e, post_id: post.id)
    else
      puts e
    end
  end
end
