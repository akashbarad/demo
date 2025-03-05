# class User < ApplicationRecord
#   # Include default devise modules. Others available are:
#   # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
#   devise :database_authenticatable, :registerable,
#          :recoverable, :rememberable, :validatable

# end
class User < ApplicationRecord
  devise :database_authenticatable, :registerable, :omniauthable, omniauth_providers: [:google_oauth2]

  # def self.from_omniauth(auth)
  #   Rails.logger.info "🔹 Processing User from OAuth"
  #   Rails.logger.info "🔹 Received UID: #{auth.uid}"
  #   Rails.logger.info "🔹 Received Email: #{auth.info.email}"

  #   user = where(provider: auth.provider, uid: auth.uid).first_or_initialize do |u|
  #     u.email = auth.info.email
  #     u.password = Devise.friendly_token[0, 20]
  #     # u.name = auth.info.name
  #   end

  #   if user.persisted?
  #     Rails.logger.info "✅ User Already Exists: #{user.id}"
  #   else
  #     Rails.logger.info "🆕 Creating New User"
  #     user.save
  #   end

  #   user
  # end
  def generate_jwt
    JWT.encode({ id: id, exp: 60.days.from_now.to_i }, ENV['JWT_SECRET'])
  end
end
