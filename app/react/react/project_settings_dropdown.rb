module React
  class ProjectSettingsDropdown
    extend R::Lib

    def self.name
      "ProjectSettingsDropdown"
    end

    def self.props(project)
      links = [
        {icon: "eye", text: "View Project", href: urls.project_url(project, subdomain: project.user.slug) },
        {icon: "edit", text: "Edit Project", href: urls.user_project_edit_url(project.user, project, subdomain: project.user.slug) },
        {icon: "settings", text: "Project Settings", href: urls.user_project_settings_url(project.user, project, subdomain: project.user.slug) },
      ]

      if project.crowdfund?
        links << {
          icon: "dollarsign",
          text: "Project Funding",
          href: urls.user_project_funding_url(project.user, project, subdomain: project.user.slug)
        }
      end

      {links: links}
    end
  end
end