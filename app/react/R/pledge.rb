module R
  class Pledge
    extend R::Lib

    def self.s(pledge)
      {
        id: pledge&.id,
        sourceId: pledge&.stripe_source_id,
        paywallId: pledge&.paywall_id,
        amountCents: pledge&.amount_cents,
      }
    end
  end
end