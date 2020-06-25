class StripeService
  extend ServiceHelpers

  def self.oauth_link(state)
    url_helpers = Rails.application.routes.url_helpers
    redirect_uri = url_helpers.settings_url(subdomain: "")
    Stripe::OAuth.authorize_url(
      {state: state, redirect_uri: redirect_uri},
      {express: true, capabilities: ['transfers', 'card_payments']})
  end

  def self.get_token(code)
    Stripe::OAuth.token({code: code, grant_type: "authorization_code"})
  end

  def self.create_stripe_account!(user, stripe_id)
    stripe_account = StripeAccount.find_or_initialize_by(user: user)
    stripe_account.stripe_id = stripe_id
    stripe_account.save!
    stripe_account
  end

  def self.create_stripe_account_from_code!(user, code)
    token = get_token(code)
    create_stripe_account!(user, token.stripe_user_id)
  end

  # returns a StripeSource
  def self.upsert_customer!(user, setup_intent)
    if !user.stripe_customer
      api_customer = Stripe::Customer.create({ email: user.email })
      new_customer = StripeCustomer.new(user: user, stripe_id: api_customer.id)
      new_customer.save!
    end

    user.reload.stripe_customer.with_lock do
      api_source = Stripe::PaymentMethod.attach(setup_intent[:payment_method], {customer: user.stripe_customer.stripe_id})
      api_payment_methods = Stripe::PaymentMethod.list({ type: 'card', customer: user.stripe_customer.stripe_id })

      sources = api_payment_methods.map do |source|
        s = user.stripe_customer.stripe_sources.find_or_initialize_by(stripe_id: source.id)

        s.assign_attributes(
          object: source.object,
          brand: source.card.brand,
          country: source.card.country,
          exp_month: source.card.exp_month,
          exp_year: source.card.exp_year,
          last4: source.card.last4
        )
        s.save!
        s
      end

      sources.find{ |s| s.stripe_id == api_source.id }
    end
  end

  def self.create_charge_from_pledge(pledge)
    transfer = TransferService.info(pledge)

    StripeCharge.create!(
      stripe_source: pledge.stripe_source,
      stripe_account: pledge.paywall.project.user.stripe_account,
      pledge: pledge,
      total: pledge.amount,
      paid: transfer.paid,
      stripe_fee: transfer.stripe,
      platform_fee: transfer.platform
    )

  end

  def self.buy_payment_intent(paywall, stripe_source)
    transfer = TransferService.buy(paywall, stripe_source)

    Stripe::PaymentIntent.create({
      amount: paywall.amount_cents,
      currency: 'usd',
      customer: stripe_source.stripe_customer.stripe_id,
      payment_method: stripe_source.stripe_id,
      off_session: false,
      confirm: false,
      on_behalf_of: paywall.project.user.stripe_account.stripe_id,
      metadata: {
        paywall_id: paywall.id
      },
      transfer_data: {
        destination: paywall.project.user.stripe_account.stripe_id,
        amount: transfer.paid.cents
    }})
  end

  def self.create_api_charge(stripe_charge)
    stripe_charge.with_lock do
      stripe_charge.attempt!

      api_charge = Stripe::PaymentIntent.create({
        amount: stripe_charge.total_cents,
        currency: 'usd',
        customer: stripe_charge.stripe_source.stripe_customer.stripe_id,
        payment_method: stripe_charge.stripe_source.stripe_id,
        off_session: true,
        confirm: true,
        on_behalf_of: stripe_charge.stripe_account.stripe_id,
        metadata: {
          stripe_charge_id: stripe_charge.id
        },
        transfer_data: {
          destination: stripe_charge.stripe_account.stripe_id,
          amount: stripe_charge.paid_cents
        }})

      stripe_charge.update!(stripe_id: api_charge.id)
      stripe_charge.complete!
      stripe_charge
    end
  end
end