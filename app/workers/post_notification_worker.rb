class PostNotificationWorker
  include Sidekiq::Worker

  def perform
    PostNotification.includes(follow: :user).unsent.find_each do |notification|
      begin
        notification.mark_sending!
        PostMailer.post_notification(notification.follow.user, notification.post).deliver_now
        notification.sent_at = DateTime.current
        notification.mark_sent!
      rescue Exception => e
        if Rails.env.production?
          Rollbar.error(e, follow_id: notification.follow_id)
        else
          raise e
        end
      end
    end
  end
end