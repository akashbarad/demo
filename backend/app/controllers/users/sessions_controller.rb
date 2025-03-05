# app/controllers/users/sessions_controller.rb
class Users::SessionsController < Devise::SessionsController
  # Disable CSRF for API requests
  # skip_before_action :verify_authenticity_token, only: [:create, :destroy]

  # Skip Devise's signed-out user verification since we're using JWT
  skip_before_action :verify_signed_out_user, only: :destroy
  skip_before_action :authenticate_user_from_token, only: [:create,:new] # POST /users/sign_in
  # Ensure the controller responds to JSON
  respond_to :json

  def create
    user = User.find_for_database_authentication(email: params[:user][:email])
    
    # binding.pry
    
    if user && user.valid_password?(params[:user][:password])
      token = user.generate_jwt
      sign_in(user)
      render json: {
        token: token,
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      }, status: :ok
    else
      render json: { errors: ["Invalid email or password"] }, status: :unauthorized
    end
  end
  
  def destroy
    # Extract token from Authorization header
    token = request.headers['Authorization']&.split(' ')&.last

    if token
      # Optionally blacklist the token
      Rails.cache.write("blacklisted_token:#{token}", true, expires_in: 24.hours)
      render json: { message: "Successfully logged out" }, status: :ok
    else
      render json: { errors: ["No token provided"] }, status: :unauthorized
    end
  end

  private

  def auth_options
    { scope: resource_name, recall: "#{controller_path}#new" }
  end
end