module R
  class Project
    extend R::Lib

    def self.s(project)
      {
        id: project.id,
        title: project.title,
        description: project.description,
        body: project.body,
        published: project.published?,
        displayDate: display_date(project),
        firstImageUrl: project.first_image_url,
        color: project.color,
        postOrder: project.post_order || ::Project::DEFAULT_POST_ORDER,
        paywall: R::Paywall.s(project.current_paywall),
        urls: {
          view: urls.project_path(project, subdomain: project.user.slug),
          update: urls.user_project_path(project.user, project),
          publish: urls.user_project_publish_path(project.user, project),
          imageUpload: urls.user_project_image_upload_path(project.user, project.id),
          resource: urls.user_project_path(project.user, project),
        },
      }
    end
  end
end