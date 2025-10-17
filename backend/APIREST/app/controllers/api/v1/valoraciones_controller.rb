class Api::V1::ValoracionesController < ApplicationController
  before_action :set_valoracion, only: %i[update show destroy]

  def index
    @valoraciones = Valoracion.all
    render json: @valoraciones
  end

  def create
    @valoracion = Valoracion.new(valoracion_params)
    if @valoracion.save
      render json: @valoracion, status: :created
    else
      render json: @valoracion.errors, status: :unprocessable_entity
    end
  end

  def show
    render json: @valoracion
  end

  def update
    if @valoracion.update(valoracion_params)
      render json: @valoracion
    else
      render json: @valoracion.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @valoracion
      @valoracion.destroy
      head :no_content  # responde con 204 No Content si se eliminó correctamente
    else
      render json: { error: "valoracion no encontrado" }, status: :not_found
    end
  end

  private

  def valoracion_params
    params.require(:valoracion).permit(:calificacion, :comentario, :fecha, :cliente_id, :proyecto_id)
  end

  def set_valoracion
    @valoracion = Valoracion.find_by(id: params[:id])
  end
end
