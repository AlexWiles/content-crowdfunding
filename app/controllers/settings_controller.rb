class SettingsController < ApplicationController
  def index
    strip_subdomain_and_redirect!
    authenticate_user!
    setup_stripe_state!
    @user = current_user
  end

  def payments
    strip_subdomain_and_redirect!
    authenticate_user!
    setup_stripe_state!
    @user = current_user
  end

  def emails
    strip_subdomain_and_redirect!
    authenticate_user!
    @user = current_user
    @projects = current_user.follows.not_deleted.published_project.order(created_at: :desc)
  end

  def stripe_oauth
    authenticate_user!
    validate_stripe_oauth!
    stripe_code = request.query_parameters[:code]
    StripeService.create_stripe_account_from_code!(current_user, stripe_code)
    redirect_to settings_url(subdomain: "")
  end

  def stripe_dashboard
    authenticate_user!
    redirect_to settings_url(subdomain: "") unless current_user.stripe_account

    stripe_id = current_user.stripe_account.stripe_id
    info = Stripe::Account.create_login_link(StripeAccount.last.stripe_id)
    redirect_to info.url
  end

  def update
    authenticate_user!

    @user = current_user

    display_name = params.dig(:user, :display_name)

    if display_name
      if @user.update(display_name: display_name)
        redirect_to settings_url(subdomain: "")
      else
        render :index
      end
    end

    avatar = params.dig(:user, :avatar)
    if avatar
      if @user.update(avatar: avatar)
        redirect_to settings_url(subdomain: "")
      else
        render :index
      end
    end

    username = params.dig(:user, :username)
    if username
      if @user.update(username: username)
        redirect_to settings_url(subdomain: "")
      else
        render :index
      end
    end

    about = params.dig(:user, :about)
    if about
      if @user.update(about: about)
        redirect_to settings_url(subdomain: "")
      else
        render :index
      end
    end
  end

  def update_user
    ensure_json_request
    authenticate_user!

    @user = current_user

    username = params.dig(:user, :username)
    @user.username = username if username.present? && @user.username.nil?

    display_name = params.dig(:user, :display_name)
    @user.display_name = display_name if display_name.present?

    # avatar is a data url
    avatar = params.dig(:user, :avatar)
    if avatar
      headers, data = avatar.split(',')
      decoded_data  = Base64.decode64(data)
      io = StringIO.new(decoded_data)
      content_type = content_type(headers)
      @user.avatar.attach(io: io, content_type: content_type, filename: "profile_image")
    end

    @user.save!

    render json: {ok: true}
  end

  def check_slug
    ensure_json_request
    authenticate_user!
    slug = request.query_parameters[:slug]&.downcase

    if !slug.present? || User.friendly.find_by(slug: slug).present?
      render json: {available: false}
    else
      render json: {available: true}
    end
  end

  def username
    authenticate_user!
    redirect_to settings_url if current_user.slug.present?
    @then = request.query_parameters[:then]
  end


  private

  def content_type(headers)
    headers =~ /^data:(.*?)$/
    Regexp.last_match(1).split(';base64').first
  end

  def setup_stripe_state!
    stripe_oauth_state = SecureRandom.hex(10)
    session[:stripe_oauth_state] = stripe_oauth_state
    @stripe_oauth_link = StripeService.oauth_link(stripe_oauth_state)
  end

  def validate_stripe_oauth!
    url_state = request.query_parameters[:state]
    session_state = session[:stripe_oauth_state]
    raise "invalid state" unless url_state == session_state
  end
end
