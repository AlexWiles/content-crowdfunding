require 'sidekiq-scheduler'

class FinishExpiredPaywallsWorker
  include Sidekiq::Worker

  def perform
    Paywall.expired.each do |paywall|
      PaywallFinishWorker.perform_async(paywall.id)
    end
  end
end