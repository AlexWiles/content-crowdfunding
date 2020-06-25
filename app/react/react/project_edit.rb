module React
  class ProjectEdit
    extend R::Lib

    def self.name
      "ProjectEdit"
    end

    def self.props(project)
      data = {
        project: R::Project.s(project),
        user: R::User.s(project.user),
        newPostUrl: urls.new_project_post_path(project, subdomain: project.user.slug),
        postList: {
          published: project.posts.published.order(published_at: project.post_order || Project::DEFAULT_POST_ORDER).map{ |p| R::Post.s(p) },
          drafts: project.posts.unpublished.order(updated_at: :asc).map{ |p| R::Post.s(p) }
        }
      }
      data[:publishButton] = React::ProjectPublishButton.props(project) if project.unpublished?
      data
    end
  end
end