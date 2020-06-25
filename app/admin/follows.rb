ActiveAdmin.register Follow do

  filter :aasm_state

  index do
    id_column
    column :user do |f|
      link_to (f.user.display_name || f.user.email), admin_user_path(f.user)
    end
    column :project do |f|
      link_to f.project.title, admin_project_path(f.project)
    end
    column :aasm_state
    actions
  end

  controller do
    def permitted_params
      params.permit!
    end
  end
end
