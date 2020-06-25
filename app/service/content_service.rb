class ContentService
  class Visibility
    CrowdfundPublished = :crowdfund_published
    CrowdfundPledged = :crowdfund_pledged
    CrowdfundNoPledge = :crowdfund_no_pledge
    CrowdfundFailed = :crowdfund_failed
    NeedToBuy = :need_to_buy
    Purchased = :purchased
  end

  def self.user_can_see(user, project)
    return [true, nil] if project.is_users(user)

    if project.crowdfund?
      if project.crowdfund.published?
        [false,  Visibility::CrowdfundPublished]
      elsif project.crowdfund.successful?
        pledge = ProjectService.pledge_for_user(user, project)
        if pledge.present? && pledge.meets_minimum?
          [true, Visibility::CrowdfundPledged]
        else
          [false,  Visibility::CrowdfundNoPledge]
        end
      elsif  project.crowdfund.failed?
        [false,  Visibility::CrowdfundFailed]
      end
    elsif project.buy?
      pledge = ProjectService.pledge_for_user(user, project)
      if pledge.present?
        [true, Visibility::Purchased]
      else
        [false,  Visibility::NeedToBuy]
      end
    else
      [true, nil]
    end
  end
end