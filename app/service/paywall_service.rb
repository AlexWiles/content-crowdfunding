class PaywallService
  extend ServiceHelpers

  def self.publish!(paywall)
    transaction do
      paywall.publish
      paywall.published_at = Time.now

      if paywall.crowdfund?
        paywall.expires_at = paywall.published_at + paywall.duration.days
      end

      paywall.save!
    end
  end


  class NotCrowdfundPaywall < StandardError; end;
  class NotPublished < StandardError; end;
  class NotExpired < StandardError; end;

  def self.finish!(paywall)
    paywall.with_lock do
      return if paywall.successful? || paywall.failed?

      raise NotCrowdfundPaywall unless paywall.crowdfund?
      raise NotExpired unless paywall.expires_at < Time.now

      pledges = paywall.pledges
      raised = pledges.map(&:amount).reduce(:+) || 0

      if raised >= paywall.amount
        paywall.succeed!

        pledges.each do |pledge|
          pledge.lock!
          StripeService.create_charge_from_pledge(pledge)
        end

      else
        paywall.fail!
      end
    end
  end
end