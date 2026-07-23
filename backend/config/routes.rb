Rails.application.routes.draw do
  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      resource :session, only: [:create, :show]
      resources :members
      resources :registration_links, only: [:index, :create, :destroy]
      get "registrations/:token", to: "registrations#show", as: :registration
      post "registrations/:token", to: "registrations#create"
    end
  end
end
