class Api::V1::AvancesController < ApplicationController
  before_action :set_avance, only: %i[update show destroy]

  def index
    @avances = Avance.all
    render json: @avances
  end

  def create
    @avance = Avance.new(avance_params)
    if @avance.save
      render json: @avance, status: :created
    else
      render json: @avance.errors, status: :unprocessable_entity
    end
  end

  def show
    render json: @avance
  end

  def update
    if @avance.update(avance_params)
      render json: @avance
    else
      render json: @avance.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @avance
      @avance.destroy
      head :no_content  # responde con 204 No Content si se eliminó correctamente
    else
      render json: { error: "avance no encontrado" }, status: :not_found
    end
  end

  private

  def avance_params
    params.require(:avance).permit(:descripcion, :fecha, :proyecto_id)
  end

  def set_avance
    @avance = Avance.find_by(id: params[:id])
  end
end
