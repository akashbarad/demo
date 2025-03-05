Rails.application.routes.draw do
  devise_for :users, controllers: {
    registrations: 'users/registrations',
    omniauth_callbacks: 'users/omniauth_callbacks',
    sessions: 'users/sessions', # Add this line
  }  
  get "up" => "rails/health#show", as: :rails_health_check

 
end
