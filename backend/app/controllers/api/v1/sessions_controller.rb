module Api
  module V1
    class SessionsController < ApplicationController
      def create
        user = User.find_by(email: params[:email]&.strip&.downcase)

        if user&.authenticate(params[:password])
          token = JsonWebToken.encode(user_id: user.id)
          render json: { token: token, user: user_json(user) }, status: :ok
        else
          render json: { error: "Email ou senha inválidos" }, status: :unauthorized
        end
      end

      def show
        authenticate_user!
        return if performed?

        render json: { user: user_json(current_user) }
      end

      private

      def user_json(user)
        user.as_json(only: [:id, :name, :email, :role])
      end
    end
  end
end
