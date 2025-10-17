class Api::V1::ProyectosController < ApplicationController
  before_action :set_proyecto, only: %i[update show destroy]

  def index
    @proyecto = Proyecto.all
    render json: @proyecto
  end

  def create
    @proyecto = Proyecto.new(proyecto_params)
    if @proyecto.save
      render json: @proyecto, status: :created
    else
      render json: @proyecto.errors, status: :unprocessable_entity
    end
  end

  def show
    render json: @proyecto
  end

  def update
    if @proyecto.update(proyecto_params)
      render json: @proyecto
    else
      render json: @proyecto.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @proyecto
      @proyecto.destroy
      head :no_content  # responde con 204 No Content si se eliminó correctamente
    else
      render json: { error: "proyecto no encontrado" }, status: :not_found
    end
  end

  private

  def proyecto_params
    params.require(:proyecto).permit(:titulo_proyecto, :valoracion_promedio, :descripcion, :tipo_proyecto, :fecha_publicacion, :arquitecto_id,
    :conversacion_id, :cliente_id, :solicitud_proyecto_id)
  end

  def set_proyecto
    @proyecto = Proyecto.find_by(id: params[:id])
  end  
end
