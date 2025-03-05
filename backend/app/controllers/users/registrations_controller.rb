# app/controllers/users/registrations_controller.rb
class Users::RegistrationsController < Devise::RegistrationsController
  # Disable CSRF for API requests (since this is an API endpoint)
  # skip_before_action :verify_authenticity_token, only: [:create] 
  # Ensure the controller responds to JSON
  skip_before_action :authenticate_user_from_token, only: [:create] # POST /users/sign_in

  respond_to :json

  def create
    # Build the user resource from params
    build_resource(sign_up_params)

    # Attempt to save the user
    if resource.save
      # If the user is created successfully, return a JWT token and user details
      token = resource.generate_jwt
      render json: {
        token: token,
        user: {
          id: resource.id,
          email: resource.email,
          created_at: resource.created_at,
          updated_at: resource.updated_at
        }
      }, status: :created
    else
      # If there are validation errors (e.g., duplicate email), return them in JSON
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotUnique => e
    # Catch specific database uniqueness errors
    render json: { errors: ["Email has already been taken"] }, status: :unprocessable_entity
  end

  private

  # Permit user parameters
  def sign_up_params
    params.require(:user).permit(:email, :password, :password_confirmation)
  end
end