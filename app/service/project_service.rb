# typed: false
class ProjectService
  extend ServiceHelpers

  class CannotPublish
    ConnectStripe = "Connect Stripe in account settings before publishing this project."
    NeedsATitle = "Please give the project a title before publishing."
  end

  def self.can_publish_reason(project)
    unless project.title.present?
      return [false, CannotPublish::NeedsATitle]
    end

    if project.current_paywall && project.current_paywall.requires_payment?
      if project.user.stripe_account.present?
        [true]
      else
        [false, CannotPublish::ConnectStripe]
      end
    else
      [true]
    end
  end

  def self.create(user, project_params)
    if project_params[:body] && project_params[:body].is_a?(String)
      project_params[:body] = JSON.parse(project_params[:body])
    end

    project = user.projects.new(project_params)

    begin
      transaction do
        project.save!
        FollowService.create!(user, project)
      end
      return [true, project]
    rescue => exception
      return [false, project]
    end
  end

  def self.update!(project, project_params)
    transaction do
      if project_params[:body] && project_params[:body].is_a?(String)
        project_params[:body] = JSON.parse(project_params[:body])
      end
      project.assign_attributes(project_params)
      project.save!
    end
  end

  def self.update(project, project_params)
    handle_exception { update!(project, project_params) }
  end

  def self.publish!(project)
    raise "Cannot publish" unless project.can_publish?
    transaction do
      project.published_at = Time.current
      project.publish
      project.save!

      if project.current_paywall
        PaywallService.publish!(project.current_paywall)
      end
    end
  end

  def self.publish(project)
    handle_exception { publish!(project) }
  end

  def self.add_crowdfunding(project)
    return false if project.paywalls.find { |p| p.crowdfund? }
    project.paywalls << Paywall.new(funding_type: Paywall::CROWDFUND)
    project.save
  end

  def self.archive(project)
    project.archive!
    project.current_paywall.archive!
  end

  def self.archive!(project)
    handle_exception { archive!(project)}
  end

  def self.slug_query(project_slug, user_slug)
    begin
      project = Project
        .includes(:user, :paywalls)
        .friendly
        .find(project_slug)

      return [nil, :not_found] unless project.present?

      project_user = User.friendly.find(user_slug)
      return [nil, :not_found] unless project_user && project_user.id == project.user.id

      if project.slug != project_slug || project_user.slug != user_slug
        return [project, :moved]
      end

      return [project, :ok]

    rescue ActiveRecord::RecordNotFound
      return [nil, :not_found]
    end
  end

  def self.pledge_for_user(user, project)
    if project.crowdfund?
      project.crowdfund.pledges.find_by(user: user)
    elsif project.buy?
      project.paywalls.buy.first.pledges.find_by(user: user)
    end
  end

  def self.can_create(user)
    user.username.present?
  end


  class CTA
    None = :none

    MockFund = :mock_crowdfund
    Fund = :crowdfund
    FundSuccess = :crowdfund_success
    FundFailed = :crowdfund_failed

    Subscribe = :subscribe
    Follow = :follow
    Paywall = :paywall
  end



  def self.get_cta(user, project)
    paywall = project.current_paywall

    if paywall.crowdfund?
      if paywall.published?
        return CTA::Fund
      elsif paywall.successful?
        return CTA::FundSuccess
      elsif paywall.failed?
        return CTA::FundFailed
      else
        return CTA::MockFund
      end
    elsif paywall.paywall?
      if user.present? && paywall.pledges.find_by(user: user).present?
        return CTA::None
      else
        return CTA::Paywall
      end
    elsif paywall.free? && !project.is_users(user)
      if user.present?
        return CTA::Follow
      else
        return CTA::Subscribe
      end
    end
    return CTA::None
  end

  def self.create_new_project!(user)
    project = Project.new(user: user)
    project.paywalls.build(funding_type: "free")
    project.save!

    FollowService.create!(user, project)
    FollowService.follow_creator_blog!(user)
    project
  end

  def self.create_initial_project!(user)
  end


  def self.post_list(project, user, tab=nil)
    post_order = project.post_order || Project::DEFAULT_POST_ORDER
    post_list = project.posts

    if project.is_users(user) && tab == "draft"
      post_list.unpublished.order(updated_at: :asc)
    else
      post_list.published.order(published_at: post_order)
    end
  end
end