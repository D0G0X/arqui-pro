class Api::V1::SolicitudesProyectoController < ApplicationController
  before_action :set_solicitud, only: %i[update show destroy]

  def index
    @solicitud = SolicitudProyecto.all
    render json: @solicitud
  end

  def create
    @solicitud = SolicitudProyecto.new(solicitud_params)
    if @solicitud.save
      render json: @solicitud, status: :created
    else
      render json: @solicitud.errors, status: :unprocessable_entity
    end
  end

  def show
    render json: @solicitud
  end

  def update
    if @solicitud.update(solicitud_params)
      render json: @solicitud
    else
      render json: @solicitud.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @solicitud
      @solicitud.destroy
      head :no_content  # responde con 204 No Content si se eliminó correctamente
    else
      render json: { error: "solicitud_proyecto no encontrado" }, status: :not_found
    end
  end

  private

  def solicitud_params
    params.require(:solicitud_proyecto).permit(:estado, :fecha, :arquitecto_id, :cliente_id)
  end

  def set_solicitud
    @solicitud = SolicitudProyecto.find_by(id: params[:id])
  end  
end
