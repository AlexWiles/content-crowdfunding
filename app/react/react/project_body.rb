module React
  class ProjectBody
    extend R::Lib

    def self.name
      "ProjectBody"
    end

    def self.props(project)
      { body: project.body  }
    end
  end
end