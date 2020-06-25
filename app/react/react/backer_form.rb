module React
  class BackerForm
    extend R::Lib

    def self.name
      "BackerForm"
    end

    def self.props(user, project)
      {
        stripeKey: Rails.application.credentials.dig(:stripe ,:pub_key),
        setupIntentClientSecret: Stripe::SetupIntent.create.client_secret,
        stripeLogoPath: ActionController::Base.helpers.asset_path('powered_by_stripe.svg'),
        paywallId: project.current_paywall.id,
        paywall: R::Paywall.s(project.current_paywall),
        pledgesPath: urls.pledges_path,
        stripeSources: R::StripeSources.s(user),
        pledge: R::Pledge.s(project.current_paywall.for_user(user)),
        project: R::Project.s(project)
      }
    end
  end
end