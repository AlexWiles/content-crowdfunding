class IndexController < ApplicationController
  def index
    set_user!

    if @user.present?
      return render 'profile'
    end

    render 'old'
  end

  def old
  end

  def writers
  end

  def about
  end

  def profile
  end

  private

  def set_user!
    if request.subdomain.present?
      @user = User.find_by(slug: request.subdomain)
    end
  end
end
