# typed: false
class ProjectsController < ApplicationController
  def show
    store_user_location!
    set_project!(true)
    redirect_expanded_url_for_show!

    not_found unless @project.published? || @project.user == current_user

    if !@project.published? && @project.user == current_user
      @message[:warning] = "Unpublished project. Only you can see this page."
    end
    @view = "details"

    @post_count = @project.is_users(current_user) ? @project.posts.not_archived.count : @project.posts.published.count

  end

  def posts
    store_user_location!
    set_project!(true)
    redirect_expanded_url_for_show!

    not_found unless @project.published? || @project.user == current_user

    if !@project.published? && @project.user == current_user
      @message[:warning] = "Unpublished project. Only you can see this page."
    end

    @draft_list = ProjectService.post_list(@project, current_user, "draft")
    @published_list = ProjectService.post_list(@project, current_user, nil)

    @post_count = @project.is_users(current_user) ? @project.posts.not_archived.count : @project.posts.published.count

    @view = "posts"
    render "show"
  end

  def settings
    strip_subdomain_and_redirect!
    authenticate_user!
    set_project!
    validate_user_project!
  end

  def money
    strip_subdomain_and_redirect!
    authenticate_user!
    set_project!
    validate_user_project!
  end

  def funding
    authenticate_user!
    set_project!
    validate_user_project!
    not_found unless @project.crowdfund?
  end

  def new
    authenticate_user!
    return redirect_to settings_username_path(then: new_user_project_path) unless current_user.slug.present?
    @project = ProjectService.create_new_project!(current_user)
    return redirect_to edit_user_project_url(current_user, @project.id, subdomain: current_user.slug)
  end

  def edit
    authenticate_user!
    set_project!
    validate_user_project!

    if !@project.published? && @project.user == current_user
      @message[:warning] = "Unpublished project. Visit project settings to publish."
    end
  end

  def update
    authenticate_user!
    set_project!
    validate_user_project!

    respond_to do |format|
      format.html do
        if ProjectService.update(@project, project_params)
          return redirect_to user_project_path(current_user, @project.id, subdomain: current_user.slug)
        end
      end
      format.json do
        ProjectService.update!(@project, project_params)
        render json: {ok: true}, status: :created
      end
    end
  end

  def create
    authenticate_user!
    success, @project = ProjectService.create(current_user, project_params)

    if success
      redirect_to project_url(@project, subdomain: current_user.slug)
    else
      render :new
    end
  end

  def destroy
    respond_to do |format|
      format.json do
        authenticate_user!
        set_project!
        validate_user_project!

        if ProjectService.archive(@project)
          render json: {ok: true}, status: :created
        else
          render json: {err: "Could not delete project."}, status: :unprocessable_entity
        end
      end
    end
  end

  def add_crowdfunding
    authenticate_user!
    set_project!
    validate_user_project!

    if ProjectService.add_crowdfunding(@project)
      redirect_to edit_user_project_path(current_user, @project, tab: "settings")
    else
      render :edit
    end
  end

  def publish
    respond_to do |format|
      format.json do
        authenticate_user!
        set_project!
        validate_user_project!

        if ProjectService.publish(@project)
          render json: {ok: true}, status: :created
        else
          render json: {err: "Could not publish project."}, status: :unprocessable_entity
        end
      end
    end
  end

  def back
    authenticate_user!
    set_project!
    not_found unless @project.current_paywall.crowdfund? && @project.current_paywall.published?
  end

  def buy
    authenticate_user!
    set_project!
    return not_found unless @project.current_paywall.paywall?
    return not_found if @project.current_paywall.pledges.find_by(user: current_user).present?
  end

  def follow
    ensure_json_request
    authenticate_user!
    set_project!

    not_found unless @project.current_paywall.free?

    FollowService.create!(current_user, @project)
    render json: {ok: true}
  end

  def unfollow
    ensure_json_request
    authenticate_user!
    set_project!

    FollowService.destroy!(current_user, @project)
    render json: {ok: true}
  end

  def notification
    ensure_json_request
    authenticate_user!
    set_project!

    notify = params[:notify]

    if notify
      follow = FollowService.create!(current_user, @project)
      render json: { notify: follow.notify? }
    else
      follow = FollowService.silence!(current_user, @project)
      render json: { notify: follow.notify? }
    end
  end

  def unconfirmed_follow
    set_project!

    email = params[:user][:email]
    user = User.find_by(email: email)

    if user.present?
      # will be redirected back, can click follow
      return redirect_to new_user_session_url
    else
      # create user and follow
      user = User.create!(email: email)
      user.follows.create!(project: @project)

      # sign in user
      sign_in(:user, user)

      # redirect back
      flash[:notice] = "Awesome, you are subscribed. Please confirm your email address."
      return redirect_to get_recent_visited_page_for_user || dashboard_url
    end

    redirect_back(fallback_location: root_url)
  end

  def image
    set_project!
    attachment = @project.images.find(params[:image_id])

    if attachment
      redirect_to AttachmentService.cdn_url(attachment)
    else
      not_found
    end
  end

  def image_upload
    respond_to do |format|
      format.json do
        authenticate_user!
        set_project!
        validate_user_project!

        image = params[:image]
        if image
          headers, data = image.split(',')
          decoded_data  = Base64.decode64(data)
          io = StringIO.new(decoded_data)
          content_type = content_type(headers)
          @project.images.attach(io: io, content_type: content_type, filename: "image")
          new_image_id = @project.images.order(id: :desc).limit(1).pluck(:id).last
          render json: {ok: true, id: new_image_id}
        else
          render json: {err: "no image"}, status: :unprocessable_entity
        end
      end
    end
  end

  private

  def set_project!(redirect_if_moved=false)
    project_slug = params[:id] || params[:project_id]
    user_slug = request.subdomain.presence || params[:user_id]
    @project, action = ProjectService.slug_query(project_slug, user_slug)

    return not_found if action == :not_found
    if action == :moved && redirect_if_moved
      return redirect_to project_url(@project, subdomain: @project.user.slug), status: :moved_permanently
    end
  end

  def validate_user_project!
    return not_found unless @project.is_users(current_user)
  end

  def project_params
    params.require(:project).permit(
      :title,
      :about,
      :description,
      :post_order,
      body: {},
      paywalls_attributes: [:id, :amount, :minimum, :funding_type, :duration],
      posts_attributes: [:id, :content])
      .merge(params.to_unsafe_hash.slice(:body))
  end

  def redirect_expanded_url_for_show!
    if request.path == user_project_path(@project.user, @project)
      redirect_to project_url(@project, subdomain: @project.user.slug)
    end
  end

  def show_tab(pub_count, draft_count)
    return "draft" if pub_count == 0
    return "published" if draft_count == 0
    return nil
  end

  def content_type(headers)
    headers =~ /^data:(.*?)$/
    Regexp.last_match(1).split(';base64').first
  end
end
