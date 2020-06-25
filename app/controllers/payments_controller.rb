class PaymentsController < ApplicationController

  def create_payment_method
    authenticate_user!

    paywall = Paywall.find(params[:paywallId])
    setup_intent = params[:setupIntent]
    stripe_source = StripeService.upsert_customer!(current_user, setup_intent)

    if paywall.crowdfund?
      render json: {sourceId: stripe_source.id}, status: :created
    else
      payment_intent = StripeService.buy_payment_intent(paywall, stripe_source)

      render json: {
        clientSecret: payment_intent.client_secret,
        sourceId: stripe_source.id,
        paymentMethod: stripe_source.stripe_id
      },
      status: :created
    end
  end

  def payment_intent
    authenticate_user!

    paywall = Paywall.find(params[:paywallId])
    stripe_source = current_user.stripe_customer.stripe_sources.find(params[:sourceId])
    payment_intent = StripeService.buy_payment_intent(paywall, stripe_source)

    render json: {
      clientSecret: payment_intent.client_secret,
      sourceId: stripe_source.id,
      paymentMethod: stripe_source.stripe_id},
    status: :created
  end

  def record_payment
    authenticate_user!

    ActiveRecord::Base.transaction do
      PaymentService.record_payment(current_user, params[:paywallId], params[:sourceId], params[:paymentIntentId])
    end

    paywall = Paywall.find(params[:paywallId])
    next_url =  project_url(paywall.project, subdomain: paywall.project.user)
    render json: {ok: true, nextUrl: next_url }, status: :created
  end
end
