Stripe.api_key = Rails.application.credentials.dig(:stripe, :key)
Stripe.client_id = Rails.application.credentials.dig(:stripe, :client_id)