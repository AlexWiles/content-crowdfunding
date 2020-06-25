# typed: false
class PaywallsController < ApplicationController

  def update
    authenticate_user!
    set_paywall

    if @paywall.can_update_amount? && @paywall.update(amount: paywall_params[:amount])
      redirect_to edit_project_path(current_user, @paywall.project, tab: "info")
    else
      redirect_to edit_project_path(current_user, @paywall.project, tab: "info")
    end
  end

  private

  def set_paywall
    @paywall = Paywall.includes(:project).find_by(id: params[:id], projects: { user_id: current_user.id })
    not_found unless @paywall.present?
  end

  def paywall_params
    params.require(:paywall).permit(:amount)
  end

end
