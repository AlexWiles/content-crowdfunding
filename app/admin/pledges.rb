ActiveAdmin.register Pledge do
  filter :email

  member_action :confirm, method: :put do
    resource.confirm!
    redirect_to resource_path, notice: "confirmed!"
  end

  action_item :confirm, only: :show do
    if resource.pending?
      link_to(
        'Confirm',
        confirm_admin_pledge_path(resource),
        data: {confirm: "Confirm this pledge?"},
        method: :put
      )
    end
  end

  controller do
    def permitted_params
      params.permit!
    end
  end
end
