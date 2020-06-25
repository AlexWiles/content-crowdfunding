# typed: false
ActiveAdmin.register Post do

  filter :state

  index do
    selectable_column
    id_column
    column :title do |p|
      link_to p.title, admin_post_path(p)
    end
    column :project do |p|
      link_to p.title, admin_project_path(p.project)
    end
    column :created_at
    actions
  end

  show do
    attributes_table do
      row :id
      row :project
      row :title
      row :link do |p|
        link = project_post_url(p.project, p, subdomain: p.project.user.slug)
        link_to link, link
      end
      row :description
      row :state
      row :created_at
      row :updated_at
      row :content do |p|
        if p.body.present?
          raw DraftJsService.email(p.body)
        end
      end
    end

    active_admin_comments
  end

  controller do
    helper ActionText::Engine.helpers
    def permitted_params
      params.permit!
    end
  end
end