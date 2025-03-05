# app/controllers/users/omniauth_callbacks_controller.rb
class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  # Skip authentication for OAuth callbacks
  include Authenticate

  skip_before_action :authenticate_user_from_token, only: [:google_oauth2]
  def google_oauth2
    auth_info = request.env['omniauth.auth']
    
    user = User.find_or_create_by(email: auth_info.info.email) do |u|
      u.password = Devise.friendly_token[0, 20]
    end

    if user.persisted?
      token = user.generate_jwt
      
      # cookies.signed[:jwt] = {
      #   value: token,
      #   # httponly: Rails.env.production? ? true : false, # disable in development
      #   # httponly: false, # disable in development
      #   secure: Rails.env.production?,
      #   expires: 1.hour.from_now,
      #   # domain: 'http://localhost:3000'
      #   # same_site: :none,
      #   http_only: false, # Allows JS access
      #   same_site: :lax
      # }
      # cookies[:jwt] = {
      #   value: token,
      #   secure: Rails.env.production?,
      #   expires: 1.hour.from_now,
      #   http_only: false,
      #   same_site: :lax,
      #   path: '/',
      #   domain: 'localhost'
      # }
      # binding.pry
      user_data = {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at
      }

      user_json = CGI.escape(user_data.to_json)

      Rails.logger.debug "JWT Cookie Set: #{cookies[:jwt]}"
      # redirect_to "http://localhost:5173/dashboard?jwt=#{token}"
      redirect_to "http://localhost:5173/dashboard?jwt=#{token}&user=#{user_json}", allow_other_host: true

      # redirect_to "http://localhost:5173/dashboard"
    else
      render json: { error: 'User could not be created' }, status: :unprocessable_entity
    end
  end

  def failure
    redirect_to "http://localhost:3000/signin?error=authentication_failed"
  end
end