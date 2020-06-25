source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.7.0'

gem 'rails', '~> 6.0.2', '>= 6.0.2.1'
gem 'dotenv-rails'
gem 'pg', '>= 0.18', '< 2.0'
gem 'puma', '~> 4.1'
gem 'sass-rails', '>= 6'
gem 'webpacker', '~> 4.0'
gem 'turbolinks', '~> 5'
gem 'jbuilder', '~> 2.7'
gem 'bootsnap', '>= 1.4.2', require: false
gem 'aasm', '~> 5.0', '>= 5.0.6'
gem 'activeadmin', '~> 2.6'
gem "slim-rails"
gem "bootstrap"
gem 'jquery-rails'
gem 'devise'
gem 'friendly_id', '~> 5.2.4'
gem 'aws-sdk-rails'
gem "aws-sdk-s3", require: false
gem "sidekiq"
gem "image_processing"
gem 'money-rails'
gem 'stripe'
gem 'active_storage_validations'
gem 'rollbar'
gem 'draftjs_exporter', github: 'AlexWiles/draftjs_exporter'

gem 'sidekiq-scheduler'
# https://github.com/moove-it/sidekiq-scheduler/issues/298
gem 'e2mmap'
gem 'thwait'

# https://github.com/rack/rack/pull/1428
gem 'rack', github: 'rack/rack', :ref => 'f690bb71425aa31d7b9b3113829af773950d8ab5'

group :development, :test do
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  gem 'pry'
  gem 'rspec-rails'
end

group :development do
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '>= 3.0.5', '< 3.2'
  gem 'spring'
  gem 'solargraph'
  gem 'spring-watcher-listen', '~> 2.0.0'
end

group :test do
  gem 'capybara', '>= 2.15'
  gem "factory_bot_rails"
  # gem 'selenium-webdriver'
  # gem 'webdrivers'
end

gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
