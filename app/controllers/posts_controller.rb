# typed: false
class PostsController < ApplicationController
  def update
    authenticate_user!
    set_post!
    validate_user_post!

    if @post.update(post_params)
      redirect_back(fallback_location: project_path(current_user, @project, @post))
    end
  end

  def new
    authenticate_user!
    set_project!
    validate_user_project!
    @post = Post.create!(project: @project)
    redirect_to edit_user_project_post_path(current_user, @project, @post.id, subdomain: current_user.slug)
  end

  def show
    store_user_location!

    action, url = set_post!(true)
    if action == :not_found
      return not_found
    elsif action == :redirect
      return redirect_to url, status: :moved_permanently
    end

    redirect_expanded_url_for_show!
    unless @post.published?
      authenticate_user!
      validate_user_post!
      @message[:warning] = "Unpublished post. Only you can see this page."
    end
  end

  def settings
    authenticate_user!
    set_post!
    validate_user_post!
  end

  def edit
    authenticate_user!
    set_post!
    validate_user_post!

    if !@post.published?
      @message[:warning] = "Unpublished post. Only you can see this page."
    end

    @tab = request.query_parameters[:tab] || "info"
  end

  def create
    authenticate_user!
    set_project!
    not_found unless @project.is_users(current_user)
    @post = @project.posts.new(post_params)

    if @post.save
      redirect_to edit_user_project_post_path(current_user, @project, @post, subdomain: "")
    end
  end

  def publish
    respond_to do |format|
      format.json do
        authenticate_user!
        set_post!
        validate_user_post!

        if PostService.publish(@post)
          render json: {ok: true}, status: :created
        else
          render json: {err: "Could not publish post."}, status: :unprocessable_entity
        end
      end
    end
  end

  def destroy
    respond_to do |format|
      format.json do
        authenticate_user!
        set_post!
        validate_user_post!

        PostService.destroy!(@post)
        render json: {ok: true}, status: :created
      end
    end
  end

  def image
    set_post!
    attachment = @post.images.find(params[:image_id])
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
        set_post!
        validate_user_post!

        image = params[:image]
        if image
          headers, data = image.split(',')
          decoded_data  = Base64.decode64(data)
          io = StringIO.new(decoded_data)
          content_type = content_type(headers)
          @post.images.attach(io: io, content_type: content_type, filename: "image")
          new_image_id = @post.images.order(id: :desc).limit(1).pluck(:id).last
          render json: {ok: true, id: new_image_id}
        else
          render json: {err: "no image"}, status: :unprocessable_entity
        end
      end
    end
  end

  def update_post
    respond_to do |format|
      format.json do
        authenticate_user!
        set_post!
        validate_user_post!

        body = params[:body]
        title = params[:title]
        description = params[:subtitle]

        @post.update!(body: body, title: title, description: description)
        render json: {ok: true}
      end
    end
  end

  def update_public
    respond_to do |format|
      format.json do
        authenticate_user!
        set_post!
        validate_user_post!

        @post.update!(public: params[:public])
        render json: {ok: true}
      end
    end
  end

  private

  def content_type(headers)
    headers =~ /^data:(.*?)$/
    Regexp.last_match(1).split(';base64').first
  end

  def set_project!(redirect_if_moved=false)
    post_slug = params[:id] || params[:post_id]
    project_slug = params[:project_id]
    user_slug = request.subdomain.presence || params[:user_id]

    @project, action = ProjectService.slug_query( project_slug, user_slug)
    return not_found if action == :not_found

    if action == :moved && redirect_if_moved
      return redirect_to project_post_url(@project, post_slug, subdomain: @project.user.slug), status: :moved_permanently
    end
  end

  def set_post!(redirect_if_moved=false)
    # duplicates set_project! not DRY but idc
    post_slug = params[:id] || params[:post_id]
    project_slug = params[:project_id]
    user_slug = request.subdomain.presence || params[:user_id]

    @project, action = ProjectService.slug_query( project_slug, user_slug)
    return [:not_found] if action == :not_found

    if action == :moved && redirect_if_moved
      return [:redirect, project_post_url(@project, post_slug, subdomain: @project.user.slug)]
    end

    post_slug = params[:id] || params[:post_id]
    @post, action = PostService.slug_query(@project, post_slug)

    return [:not_found] if action == :not_found

    if action == :moved && redirect_if_moved
      return [:redirect, project_post_url(@project, @post, subdomain: @project.user.slug)]
    end
  end

  def validate_user_post!
    not_found unless @post.project.is_users(current_user)
  end

  def validate_user_project!
    not_found unless @project.is_users(current_user)
  end

  def post_params
    params.require(:post).permit(:title, :description, :content, :body)
  end

  def redirect_expanded_url_for_show!
    if request.path == user_project_post_path(@project.user, @project, @post)
      redirect_to project_post_url(@project, @post, subdomain: @project.user.slug)
    end
  end
end
