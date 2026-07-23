module Api
  module V1
    class MembersController < ApplicationController
      before_action :authenticate_user!
      before_action :set_member, only: [:show, :update, :destroy]

      def index
        render json: Member.order(:full_name)
      end

      def show
        render json: @member
      end

      def create
        member = Member.new(member_params)
        if member.save
          render json: member, status: :created
        else
          render json: { errors: member.errors }, status: :unprocessable_entity
        end
      end

      def update
        if @member.update(member_params)
          render json: @member
        else
          render json: { errors: @member.errors }, status: :unprocessable_entity
        end
      end

      def destroy
        @member.destroy
        head :no_content
      end

      private

      def set_member
        @member = Member.find(params[:id])
      end

      def member_params
        params.require(:member).permit(
          :full_name, :birth_date, :email, :phone, :cpf, :address,
          :ministerial_role, :membership_status, :joined_at, :notes
        )
      end
    end
  end
end
