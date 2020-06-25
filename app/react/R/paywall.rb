module R
  class Paywall
    extend R::Lib

    def self.s(paywall)
      {
        id: paywall.id,
        amount: paywall.amount.amount.round,
        amountCents: paywall.amount_cents,
        minimum: paywall.minimum ? paywall.minimum.amount.round : nil,
        minimumCents: paywall.minimum_cents,
        fundingType: paywall.funding_type,
        duration: paywall.duration,
        state: paywall.aasm_state,
        requiresPayment: paywall.requires_payment?
      }
    end
  end
end