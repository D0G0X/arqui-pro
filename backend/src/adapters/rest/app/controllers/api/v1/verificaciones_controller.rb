class Api::V1::VerificacionesController < ApplicationController
  before_action :set_verificacion, only: %i[update show destroy]

  def index
    @verificaciones = Verificacion.all
    render json: @verificaciones
  end

  def create
    @verificacion = Verificacion.new(verificacion_params)
    if @verificacion.save
      render json: @verificacion, status: :created
    else
      render json: @verificacion.errors, status: :unprocessable_entity
    end
  end

  def show
    render json: @verificacion
  end

  def update
    if @verificacion.update(verificacion_params)
      render json: @verificacion
    else
      render json: @verificacion.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @verificacion
      @verificacion.destroy
      head :no_content  # responde con 204 No Content si se eliminó correctamente
    else
      render json: { error: "verificación no encontrada" }, status: :not_found
    end
  end

  private

  def verificacion_params
    params.require(:verificacion).permit(:estado, :fecha_verificacion, :arquitecto_id, :moderador_id)
  end

  def set_verificacion
    @verificacion = Verificacion.find_by(id: params[:id])
  end
end
