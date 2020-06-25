class PaymentService
  def self.record_payment(user, paywall_id, stripe_source_id, payment_intent_id)
    paywall = Paywall.find(paywall_id)
    stripe_source = StripeSource.find_by(id: stripe_source_id, stripe_customer: user.stripe_customer)
    payment_intent = Stripe::PaymentIntent.retrieve(payment_intent_id)

    follow = FollowService.create!(user, paywall.project)
    pledge = Pledge.find_or_initialize_by(user: user, paywall: paywall)

    pledge.amount_cents = paywall.amount_cents
    pledge.stripe_source = stripe_source
    pledge.state = "confirmed"
    pledge.save!

    transfer = TransferService.info(pledge)

    StripeCharge.create!(
      stripe_id: payment_intent.id,
      aasm_state: :completed,
      stripe_source: pledge.stripe_source,
      stripe_account: pledge.paywall.project.user.stripe_account,
      pledge: pledge,
      total: pledge.amount,
      paid: transfer.paid,
      stripe_fee: transfer.stripe,
      platform_fee: transfer.platform,
    )
  end
end