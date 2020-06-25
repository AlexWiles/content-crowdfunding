module React
  class ProjectDeleteButton
    extend R::Lib

    def self.name
      "DeleteButton"
    end

    def self.props(project)
       {
          path: urls.user_project_path(project.user, project),
          text: "Archive this project",
          messages: ["Are you sure you want to archive this project?"]
        }
    end
  end
end