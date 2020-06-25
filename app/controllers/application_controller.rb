# typed: false
class ApplicationController < ActionController::Base
  helper ActionText::Engine.helpers

  before_action :initialize_message

  protected

  def initialize_message
    @message = {}
  end

  def authenticate_user!
    if json_request
      if user_signed_in?
        super
      else
        render nothing: true, status: 402
      end
    else
      if user_signed_in?
        super
      else
        if request.get? && is_navigational_format? && !devise_controller? && !request.xhr?
          store_user_location!
        end
        redirect_to new_user_registration_path
      end
    end
  end

  def after_sign_in_path_for(resource_or_scope)
    if resource_or_scope == :user
      get_recent_visited_page_for_user || dashboard_url
    else
      super(resource_or_scope)
    end
  end

  def get_recent_visited_page_for_user
    url, created_at = session[:after_sign_in_url]
    parsed = URI.parse(url || "")
    expired = Time.now.to_i - (created_at || 0) > 10.minutes

    puts "*"*20
    puts url
    puts created_at
    puts parsed.host
    puts request.host
    puts expired
    puts "*"*20

    if url && created_at && parsed.host == request.host && !expired
      parsed.path
    end
  end

  def after_sign_out_path_for(resource_or_scope)
    root_path
  end

  def not_found
    raise ActionController::RoutingError.new('Not Found')
  end

  def store_user_location!
    # :user is the scope we are authenticating
    session[:after_sign_in_url] = [request.original_url, Time.now.to_i]
  end

  def strip_subdomain_and_redirect!
    if request.get? && request.subdomain.present? && request.subdomain != "www"
      redirect_to request.url.sub("#{request.subdomain}.", '')
    end
  end

  def ensure_json_request
    return if json_request
    render :nothing => true, :status => 406
  end

  def json_request
    request.format == :json
  end

  def transaction(&block)
    ActiveRecord::Base.transaction(requires_new: true) do
      block.call
    end
  end
end
