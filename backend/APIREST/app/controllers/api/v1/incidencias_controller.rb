class Api::V1::IncidenciasController < ApplicationController
  before_action :set_incidencia, only: %i[update show destroy]

  # Solo usuarios autenticados pueden crear/actualizar/eliminar
  before_action :authenticate_usuario!, only: %i[create update destroy]
  # Solo usuarios propietarios y moderadores pueden actualizar/eliminar
  before_action :require_incidencia_ownership!, only: %i[update destroy]

  def index
    @incidencias = Incidencia.all
    render json: @incidencias
  end

  def create
    @incidencia = Incidencia.new(incidencia_params)
    if @incidencia.save
      render json: @incidencia, status: :created
    else
      render json: @incidencia.errors, status: :unprocessable_entity
    end
  end

  def show
    render json: @incidencia
  end

  def update
    if @incidencia.update(incidencia_params)
      render json: @incidencia
    else
      render json: @incidencia.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @incidencia
      @incidencia.destroy
      head :no_content  # responde con 204 No Content si se eliminó correctamente
    else
      render json: { error: "incidencia no encontrado" }, status: :not_found
    end
  end

  private

  def incidencia_params
    params.require(:incidencia).permit(:descripcion, :estado, :fecha, :usuario_emisor_id, :usuario_infractor_id, :moderador_id)
  end

  def set_incidencia
    @incidencia = Incidencia.find_by(id: params[:id])
  end

  def require_incidencia_ownership!
    return not_found_response!("incidencia") unless @incidencia
    unless @incidencia.usuario_emisor_id == current_usuario.id || @incidencia.moderador_id == current_usuario.id
      render json: { error: "No autorizado" }, status: :forbidden and return
    end
  end
end
