module PaywallsHelper
  def goal_formatted(paywall)
    paywall.amount.format(no_cents: true)
  end

  def total_pledged_formatted(paywall)
    amount = paywall.pledges.confirmed.map(&:amount).reduce(:+) || Money.new(0)
    amount.format(no_cents: true)
  end

  def percent_funded(paywall)
    total_pledged = paywall.pledges.confirmed.map(&:amount).reduce(:+) || Money.new(0)
    percent = (total_pledged.cents / paywall.amount_cents.to_f) * 100
    number_to_percentage(percent, precision: 0)

  end

  def number_of_backers(paywall)
    count = paywall.pledges.confirmed.count
    pluralize(count, "backer")
  end
end
