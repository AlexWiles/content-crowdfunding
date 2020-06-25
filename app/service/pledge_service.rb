class PledgeService
  extend ServiceHelpers

  def self.create!(user, paywall, amount_cents, source_id, setup_intent)
    stripe_source = if setup_intent.present?
      StripeService.upsert_customer!(user, setup_intent)
    else
      StripeSource.find_by(id: source_id, stripe_customer: user.stripe_customer)
    end

    follow = FollowService.create!(user, paywall.project)
    pledge = Pledge.find_or_initialize_by( user: user, paywall: paywall)
    pledge.amount_cents = amount_cents
    pledge.stripe_source = stripe_source
    pledge.state = "confirmed"
    pledge.save!
    pledge
  end
end
