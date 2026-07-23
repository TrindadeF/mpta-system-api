module Api
  module V1
    # Public, tokenized endpoint: no authentication. Anyone holding a valid
    # registration link token can view it and submit their own member data.
    class RegistrationsController < ApplicationController
      before_action :set_link

      def show
        if @link.nil?
          render json: { error: "Link inválido" }, status: :not_found
        elsif !@link.usable?
          render json: { error: "Este link já foi utilizado ou expirou" }, status: :gone
        else
          render json: { status: "valid", expires_at: @link.expires_at }
        end
      end

      def create
        return render json: { error: "Link inválido" }, status: :not_found if @link.nil?
        return render json: { error: "Este link já foi utilizado ou expirou" }, status: :gone unless @link.usable?

        member = Member.new(member_params)

        ActiveRecord::Base.transaction do
          member.save!
          @link.mark_used!(member)
        end

        render json: member, status: :created
      rescue ActiveRecord::RecordInvalid
        render json: { errors: member.errors }, status: :unprocessable_entity
      end

      private

      def set_link
        @link = RegistrationLink.find_by(token: params[:token])
      end

      def member_params
        params.require(:member).permit(
          :full_name, :birth_date, :email, :phone, :cpf, :address,
          :ministerial_role
        )
      end
    end
  end
end
