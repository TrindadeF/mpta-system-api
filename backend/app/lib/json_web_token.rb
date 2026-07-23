class JsonWebToken
  ALGORITHM = "HS256"
  EXPIRATION = 24.hours

  class DecodeError < StandardError; end

  def self.encode(payload)
    payload = payload.dup
    payload[:exp] = EXPIRATION.from_now.to_i
    JWT.encode(payload, secret, ALGORITHM)
  end

  def self.decode(token)
    decoded = JWT.decode(token, secret, true, algorithm: ALGORITHM).first
    ActiveSupport::HashWithIndifferentAccess.new(decoded)
  rescue JWT::DecodeError => e
    raise DecodeError, e.message
  end

  def self.secret
    Rails.application.secret_key_base
  end
end
