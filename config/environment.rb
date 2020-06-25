# typed: strict
# Load the Rails application.
require_relative 'application'

# Initialize the Rails application.
Rails.application.initialize!

if Rails.env.production?
  ActionMailer::Base.smtp_settings = {
    :address        => 'smtp.sendgrid.net',
    :port           => '587',
    :authentication => :plain,
    :user_name      => Rails.application.credentials.dig(:sendgrid, :user),
    :password       => Rails.application.credentials.dig(:sendgrid, :password),
    :domain         => 'uncomma.com',
    :enable_starttls_auto => true
  }
end