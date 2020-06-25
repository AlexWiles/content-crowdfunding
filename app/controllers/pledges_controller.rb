class PledgesController < ApplicationController
  def create
    authenticate_user!

    paywall = Paywall.find(params[:paywall_id])
    raise "invalid paywall" unless paywall.published? && (paywall.crowdfund? || paywall.paywall?)

    amount = params[:amount_cents]
    setup_intent = params[:setup_intent]
    source_id = params[:source_id]
    project = paywall.project

    transaction do
      if paywall.crowdfund?
        pledge = PledgeService.create!(current_user, paywall, amount, source_id, setup_intent)
      else
        pledge = PledgeService.create!(current_user, paywall, amount, source_id, setup_intent)
        stripe_charge = StripeService.create_charge_from_pledge(pledge)
        StripeService.create_api_charge(stripe_charge)
      end
    end

    render json: {ok: true, nextUrl: project_url(project, subdomain: project.user) }, status: :created
  end

  def destroy
    authenticate_user!
    pledge = Pledge.find_by(id: params[:id], user: current_user)
    if pledge.present?
      project = pledge.paywall.project
      pledge.destroy!
      render json: {ok: true, nextUrl: project_url(project, subdomain: project.user) }, status: :ok
    else
      not_found
    end
  end

  private

  def pledge_params
    params.require(:pledge).permit(:paywall_id, :amount_cents)
  end
end
