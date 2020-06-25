class PostMailer < ApplicationMailer

  def post_notification(user, post)
    @user = user
    @post = post
    @project = post.project

    from_address = Mail::Address.new("#{@project.user.slug}@uncomma.com")
    from_address.display_name = @project.user.display_name || @project.user.slug

    mail(to: @user.email, subject: @post.title, from: from_address.format)
  end
end
