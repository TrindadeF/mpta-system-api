module Api
  module V1
    class RegistrationLinksController < ApplicationController
      before_action :authenticate_user!
      before_action :require_admin!, only: [:create, :destroy]

      def index
        links = RegistrationLink.includes(:member, :created_by).order(created_at: :desc)
        render json: links.as_json(include: { member: { only: [:id, :full_name] } })
      end

      def create
        link = RegistrationLink.new(created_by: current_user)

        if link.save
          render json: link_json(link), status: :created
        else
          render json: { errors: link.errors }, status: :unprocessable_entity
        end
      end

      def destroy
        link = RegistrationLink.find(params[:id])
        link.update!(status: :revoked)
        head :no_content
      end

      private

      def link_json(link)
        link.as_json.merge(registration_url: registration_url_for(link.token))
      end

      def registration_url_for(token)
        base = ENV.fetch("FRONTEND_ORIGIN", "http://localhost:5173")
        "#{base}/cadastro/#{token}"
      end
    end
  end
end
