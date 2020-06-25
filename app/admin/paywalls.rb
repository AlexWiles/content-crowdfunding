ActiveAdmin.register Paywall do
  filter :funding_type

  controller do
    def permitted_params
      params.permit!
    end
  end
end
