require 'sidekiq-scheduler'

class StripeChargeUnchargedWorker
  include Sidekiq::Worker

  def perform
    StripeCharge.uncharged.unattempted.each do |sc|
      StripeChargeWorker.perform_async(sc.id)
    end
  end
end