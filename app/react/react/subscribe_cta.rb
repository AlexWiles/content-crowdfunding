module React
  class SubscribeCta
    extend R::Lib

    def self.name
      "SubscribeCTA"
    end

    def self.props(project, token)
      {
        authorName: project.user.display_name,
        projectId: project.id,
        projectTitle: project.title,
        url: urls.user_project_unconfirmed_follow_path(project.user, project),
        token: token
      }
    end
  end
end