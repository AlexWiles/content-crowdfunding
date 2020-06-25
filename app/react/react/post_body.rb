module React
  class PostBody
    extend R::Lib

    def self.name
      "PostBody"
    end

    def self.props(post)
      { body: post.body  }
    end
  end
end