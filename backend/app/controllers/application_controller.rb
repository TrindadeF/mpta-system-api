class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found

  def authenticate_user!
    render_unauthorized and return unless current_user
  end

  def current_user
    @current_user ||= user_from_token
  end

  def require_admin!
    render json: { error: "Acesso restrito a administradores" }, status: :forbidden unless current_user&.admin?
  end

  private

  def user_from_token
    token = request.headers["Authorization"]&.split(" ")&.last
    return nil if token.blank?

    decoded = JsonWebToken.decode(token)
    User.find_by(id: decoded[:user_id])
  rescue JsonWebToken::DecodeError
    nil
  end

  def render_unauthorized
    render json: { error: "Não autorizado" }, status: :unauthorized
  end

  def render_not_found
    render json: { error: "Não encontrado" }, status: :not_found
  end
end
