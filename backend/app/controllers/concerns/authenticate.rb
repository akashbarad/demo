# app/controllers/concerns/authenticate.rb
module Authenticate
  extend ActiveSupport::Concern

  # included do
  #   # Only apply authentication to specific actions or controllers by default
  #   before_action :authenticate_user_from_token, except: [:new, :create] # Adjust as needed
  # end

  # private

  # def authenticate_user_from_token
  #   token = request.headers['Authorization']&.split(' ')&.last
  #   return render json: { error: 'No token provided' }, status: :unauthorized unless token

  #   begin
  #     decoded = JWT.decode(token, ENV['JWT_SECRET'], true, algorithm: 'HS256')
  #     @current_user = User.find(decoded[0]['user_id'])
  #   rescue JWT::DecodeError, ActiveRecord::RecordNotFound
  #     render json: { error: 'Invalid token' }, status: :unauthorized
  #   end
  # end

  # def current_user
  #   @current_user
  # end
end