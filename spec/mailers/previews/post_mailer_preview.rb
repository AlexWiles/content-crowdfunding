# Preview all emails at http://localhost:3000/rails/mailers/post_mailer
class PostMailerPreview < ActionMailer::Preview
  def post_notification
    PostMailer.post_notification(User.first, Post.last)
  end
end
