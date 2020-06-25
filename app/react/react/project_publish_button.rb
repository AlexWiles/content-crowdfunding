module React
  class ProjectPublishButton
    extend R::Lib

    def self.name
      "PublishButton"
    end

    def self.props(project)
      can_publish, reason = ProjectService.can_publish_reason(project)
      {
        path:  urls.user_project_publish_path(project.user, project),
        messages: [
          "Publishing this project will make it visible for all users",
          ("The crowdfunding campaign will go live." if project.current_paywall && project.current_paywall.crowdfund? )
        ].select(&:present?),
        canPublish: can_publish,
        publishReason: reason
      }
    end
  end
end