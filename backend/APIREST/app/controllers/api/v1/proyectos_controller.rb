class Api::V1::ProyectosController < ApplicationController
  before_action :set_proyecto, only: %i[update show destroy]

  # Solo arquitectos autenticados pueden crear/actualizar/eliminar
  before_action :authenticate_usuario!, only: %i[create update destroy]
  # Solo arquitectos pueden crear/actualizar/eliminar
  before_action :require_arquitecto!, only: %i[create update destroy]
  # Solo arquitecto dueño pueden actualizar/eliminar
  before_action :require_proyecto_ownership!, only: %i[update destroy]

  def index
    @proyectos = Proyecto.all
    render json: @proyectos
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

  def require_proyecto_ownership!
    return not_found_response!("proyecto") unless @proyecto
    unless @proyecto.arquitecto.usuario.id == current_usuario.id
      render json: { error: "No autorizado" }, status: :forbidden and return
    end
  end

end
