class DashboardController < ApplicationController
  before_action :strip_subdomain_and_redirect!
  before_action :authenticate_user!

  def index
    return redirect_to settings_username_url if !current_user.slug
    @projects = current_user.projects.order(created_at: :desc)
    @published_count = current_user.projects.published.count
    @draft_count = current_user.projects.unpublished.count
    @tab = request.query_parameters[:tab].presence || default_tab(@published_count, @draft_count)
  end

  def following
    @projects = current_user
      .follows
      .published_project
      .order(created_at: :desc)
      .map{ |f| f.project }
      .uniq
  end

  private

  def default_tab(pub_count, draft_count)
    return "published" if draft_count == 0
    return "draft" if pub_count == 0
    return "draft"
  end
end

