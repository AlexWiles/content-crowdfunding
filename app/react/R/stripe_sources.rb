module R
  class StripeSources
    extend R::Lib

    def self.s(user)
      sources = user.stripe_customer&.stripe_sources || []
      sources.map do |s|
        {
          id: s.id,
          last4: s.last4,
          brand: s.brand,
          expMonth: s.exp_month,
          expYear: s.exp_year,
        }
      end
    end
  end
end