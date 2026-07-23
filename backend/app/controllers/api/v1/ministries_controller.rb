module Api
  module V1
    class MinistriesController < ApplicationController
      before_action :authenticate_user!
      before_action :require_admin!, only: [:create, :update, :destroy]
      before_action :set_ministry, only: [:show, :update, :destroy]

      def index
        render json: Ministry.order(:name).map { |ministry| ministry_json(ministry) }
      end

      def show
        render json: ministry_json(@ministry)
      end

      def create
        ministry = Ministry.new(ministry_params)
        if ministry.save
          render json: ministry_json(ministry), status: :created
        else
          render json: { errors: ministry.errors }, status: :unprocessable_entity
        end
      end

      def update
        if @ministry.update(ministry_params)
          render json: ministry_json(@ministry)
        else
          render json: { errors: @ministry.errors }, status: :unprocessable_entity
        end
      end

      def destroy
        @ministry.destroy
        head :no_content
      end

      private

      def set_ministry
        @ministry = Ministry.find(params[:id])
      end

      def ministry_params
        params.require(:ministry).permit(:name, member_ids: [])
      end

      def ministry_json(ministry)
        ministry.as_json(include: { members: { only: [:id, :full_name] } })
      end
    end
  end
end
