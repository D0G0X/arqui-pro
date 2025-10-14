class Api::V1::NotificacionesController < ApplicationController
  before_action :set_notificacion, only: %i[update show destroy]

  def index
    @notificaciones = Notificacion.all
    render json: @notificaciones
  end

  def create
    @notificacion = Notificacion.new(notificacion_params)
    if @notificacion.save
      render json: @notificacion, status: :created
    else
      render json: @notificacion.errors, status: :unprocessable_entity
    end
  end

  def show
    render json: @notificacion
  end

  def update
    if @notificacion.update(notificacion_params)
      render json: @notificacion
    else
      render json: @notificacion.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @notificacion
      @notificacion.destroy
      head :no_content  # responde con 204 No Content si se eliminó correctamente
    else
      render json: { error: "notificación no encontrado" }, status: :not_found
    end
  end

  private

  def notificacion_params
    params.require(:notificacion).permit(:mensaje, :fecha, :leido, :usuario_id)
  end

  def set_notificacion
    @notificacion = Notificacion.find_by(id: params[:id])
  end
end
