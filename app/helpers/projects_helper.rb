module ProjectsHelper
  class ProjectsHelper
    def self.display_date(project)
      if project.published?
        project.published_at.strftime("%B %d, %Y")
      else
        project.updated_at.strftime("%B %d, %Y")
      end
    end
  end
end
