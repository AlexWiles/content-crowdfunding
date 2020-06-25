class TransferService
  Transfer = Struct.new(:stripe, :platform, :paid, keyword_init: true)

  DEFAULT_PLATFORM_FEE = 10

  def self.info(pledge)
    # platform = 10% of total

    platform_fee = (pledge.paywall.project.platform_fee_override || DEFAULT_PLATFORM_FEE) / 100.0

    platform = pledge.amount * platform_fee

    # stripe: 2.9% + $0.30 of total
    # additional 1% on international cards
    base_percent = 0.029
    international_percent = pledge.stripe_source.country == "US" ? 0 : 0.01
    stripe_percent = base_percent + international_percent
    stripe = (pledge.amount * stripe_percent) + Money.new(30)

    # TODO: calculate payout charges
    # $2 / total pledges
    # $0.25 / total pledges
    # 0.25% of (total - platform - curr stripe)

    paid = pledge.amount - stripe - platform

    Transfer.new(stripe: stripe, platform: platform, paid: paid)
  end

  def self.buy(paywall, stripe_source)
    # platform = 10% of total

    platform_fee = (paywall.project.platform_fee_override || DEFAULT_PLATFORM_FEE) / 100.0

    platform = paywall.amount * platform_fee

    # stripe: 2.9% + $0.30 of total
    # additional 1% on international cards
    base_percent = 0.029
    international_percent = stripe_source.country == "US" ? 0 : 0.01
    stripe_percent = base_percent + international_percent
    stripe = (paywall.amount * stripe_percent) + Money.new(30)

    # TODO: calculate payout charges
    # $2 / total pledges
    # $0.25 / total pledges
    # 0.25% of (total - platform - curr stripe)

    paid = paywall.amount - stripe - platform

    Transfer.new(stripe: stripe, platform: platform, paid: paid)
  end
end