class StripeChargeWorker
  include Sidekiq::Worker

  def perform(stripe_charge_id)
    charge = StripeCharge.find(stripe_charge_id)
    StripeService.create_api_charge(charge)

  end
end