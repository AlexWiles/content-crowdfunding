# typed: false
ActiveAdmin.register User do

  member_action :impersonate, method: :post do
    return unless current_admin_user.present?
    sign_in(:user, resource)
    redirect_to dashboard_url
  end

  action_item :impersonate, only: :show do
    link_to(
      'Impersonate',
      impersonate_admin_user_path(resource),
      method: :post
    )
  end

  index do
    id_column
    column :email
    column :username
    column :display_name
    column :created_at
    column :confirmed_at
    actions
  end

  filter :email
  filter :username

  form do |f|
    f.inputs do
      f.input :email
      f.input :username
      f.input :display_name
      f.input :avatar, as: :file, input_html: { direct_upload: true }
    end
    f.actions
  end

  controller do
    def permitted_params
      params.permit!
    end
  end
end
