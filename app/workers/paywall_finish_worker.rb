class PaywallFinishWorker
  include Sidekiq::Worker

  def perform(paywall_id)
    paywall = Paywall.find(paywall_id)
    PaywallService.finish!(paywall)
  end
end