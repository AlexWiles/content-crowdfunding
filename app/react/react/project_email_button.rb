module React
  class ProjectEmailButton
    extend R::Lib

    def self.name
      "ProjectEmailButton"
    end

    def self.props(user, project)
      follow = project.follows.find_by(user: user)
      {
        notify: follow.notify?,
        url: urls.user_project_notification_path(project.user, project)
      }
    end
  end
end