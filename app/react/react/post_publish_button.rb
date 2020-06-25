module React
  class PostPublishButton
    extend R::Lib

    def self.name
      "PublishButton"
    end

    def self.props(post)
      project = post.project

      data =  {
        path: urls.user_project_post_publish_path(project.user, post.project, post),
        messages: [
          "Are you sure you want to publish this post?",
          "All users following this project will be notified."
        ],
        canPublish: true
      }


      if project.unpublished?
        data[:messages].push("Publishing this post will also publish its project.")

        can_publish, reason = ProjectService.can_publish_reason(project)
        data[:canPublish] = can_publish
        data[:publishReason] = reason
      end

      if project.crowdfund? && project.crowdfund.unpublished?
        data[:messages].push("The project's crowdfunding campaign will go live." )
      end

      data
    end
  end
end