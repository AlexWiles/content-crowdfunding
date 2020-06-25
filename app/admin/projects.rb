# typed: false
ActiveAdmin.register Project do
  filter :email
  filter :username

  index do
    selectable_column
    id_column
    column :user do |p|
      link_to p.user.email, admin_user_path(p.user)
    end
    column :title do |p|
      link_to p.title, admin_project_path(p)
    end
    column :created_at
    actions
  end

  show do
    attributes_table do
      row :id
      row :user
      row :title
      row :link do |p|
        link = project_url(p, subdomain: p.user.slug)
        link_to link, link
      end
      row :description
      row :aasm_state
      row :follows do |p|
        p.follows.count
      end
      row :published do |p|
        p.posts.published.count
      end
      row :drafts do |p|
        p.posts.unpublished.count
      end
      row :created_at
      row :updated_at
      row :content do |p|
        if p.body.present?
          render 'content', {project: p}
        end
      end
      row :current_paywall
      row :paywall_type do |p|
        p.current_paywall.funding_type
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