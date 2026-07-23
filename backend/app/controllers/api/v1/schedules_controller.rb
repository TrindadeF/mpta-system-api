module Api
  module V1
    class SchedulesController < ApplicationController
      before_action :authenticate_user!
      before_action :require_admin!, only: [:create, :update, :destroy]
      before_action :set_schedule, only: [:show, :update, :destroy]

      def index
        schedules = Schedule.includes(:ministry, :members, :setlist_items).order(service_date: :desc)
        schedules = schedules.where(ministry_id: params[:ministry_id]) if params[:ministry_id].present?
        render json: schedules.map { |schedule| schedule_json(schedule) }
      end

      def show
        render json: schedule_json(@schedule)
      end

      def create
        schedule = Schedule.new(schedule_params.merge(created_by: current_user))
        if schedule.save
          render json: schedule_json(schedule), status: :created
        else
          render json: { errors: schedule.errors }, status: :unprocessable_entity
        end
      end

      def update
        if @schedule.update(schedule_params)
          render json: schedule_json(@schedule)
        else
          render json: { errors: @schedule.errors }, status: :unprocessable_entity
        end
      end

      def destroy
        @schedule.destroy
        head :no_content
      end

      private

      def set_schedule
        @schedule = Schedule.find(params[:id])
      end

      def schedule_params
        params.require(:schedule).permit(
          :ministry_id, :service_date, :title,
          member_ids: [],
          setlist_items_attributes: [:id, :title, :link, :position, :_destroy]
        )
      end

      def schedule_json(schedule)
        schedule.as_json(include: {
          ministry: { only: [:id, :name] },
          members: { only: [:id, :full_name, :phone] },
          setlist_items: { only: [:id, :title, :link, :position] }
        })
      end
    end
  end
end
