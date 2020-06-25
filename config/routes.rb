# typed: false

Rails.application.routes.draw do
  Rails.application.routes.default_url_options[:protocol] = Rails.env.production? ? :https : :http

  match '/404', to: 'errors#not_found', via: :all
  match '/500', to: 'errors#server_error', via: :all

  constraints :subdomain => /^$|([a-zA-Z1-9]+)/ do
    resources :paywalls
    devise_for :admin_users, ActiveAdmin::Devise.config
    ActiveAdmin.routes(self)

    devise_for :users, controllers: {
      sessions: 'user/sessions',
      registrations: 'user/registrations',
      confirmations: 'user/confirmations'
    }

    require 'sidekiq/web'
    require 'sidekiq-scheduler/web'

    authenticate :admin_user do
      mount Sidekiq::Web => '/admin/sidekiq'
    end

    root 'index#index'
    get 'old', to: 'index#old'
    get 'about', to: 'index#about'
    get 'pricing', to: 'index#pricing'

    get 'dashboard', to: 'dashboard#index'
    get 'following', to: 'dashboard#following'

    get   'settings', to: 'settings#index'
    patch 'settings', to: 'settings#update'
    get   'settings/payments', to: 'settings#payments'
    get   'settings/emails', to: 'settings#emails'
    patch 'settings/update_user', to: 'settings#update_user'

    get   'settings/username', to: 'settings#username'
    get   'settings/check_slug', to: 'settings#check_slug'
    get   'settings/stripe/oauth', to: 'settings#stripe_oauth'
    get   'settings/stripe/dashboard', to: 'settings#stripe_dashboard'
    patch 'settings/onboard_user', to: 'settings#onboard_user'


    post 'payments/method', to: 'payments#create_payment_method', format: :json
    post 'payments/record', to: 'payments#record_payment', format: :json
    post 'payments/intent', to: 'payments#payment_intent', format: :json


    resources :paywalls, only: [:create, :update]
    resources :pledges, only: [:create, :destroy], :defaults => { :format => :json }

    resources :users, only: [] do
      resources :projects do
        resources :posts do
          get  :settings
          post :publish

          post :image_upload
          post :update_post
          post :update_public
          get "image/:image_id", to: "posts#image", as: :image
        end

        post :image_upload
        get "image/:image_id", to: "projects#image", as: :image

        get :edit
        get :back
        get :buy
        get :settings
        get :money
        get :funding
        post :publish
        post :add_crowdfunding
        post :unconfirmed_follow

        post :follow
        post :unfollow
        post :notification
      end
    end


    resources :projects, path: "", only: [:show] do
      get :posts
      get :drafts
      resources :posts, path: "", only: [:show, :new]
    end
  end
end