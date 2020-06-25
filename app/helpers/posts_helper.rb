module PostsHelper
  class Display
    def self.date(post)
      if post.published?
        post.published_at.strftime("%B %d, %Y")
      else
        post.updated_at.strftime("%B %d, %Y")
      end
    end
  end
end
