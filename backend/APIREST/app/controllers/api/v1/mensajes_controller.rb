class Api::V1::MensajesController < ApplicationController
  before_action :set_mensaje, only: %i[update show destroy]

  # Solo usuarios autenticados pueden crear/actualizar/eliminar
  before_action :authenticate_usuario!, only: %i[create update destroy]
  before_action :require_mensaje_ownership!, only: %i[update destroy]

  def index
    @mensajes = Mensaje.all
    render json: @mensajes
  end

  def create
    @mensaje = Mensaje.new(mensaje_params)
    if @mensaje.save
      render json: @mensaje, status: :created
    else
      render json: @mensaje.errors, status: :unprocessable_entity
    end
  end

  def show
    render json: @mensaje
  end

  def update
    if @mensaje.update(mensaje_params)
      render json: @mensaje
    else
      render json: @mensaje.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @mensaje
      @mensaje.destroy
      head :no_content  # responde con 204 No Content si se eliminó correctamente
    else
      render json: { error: "notificación no encontrado" }, status: :not_found
    end
  end

  private

  def mensaje_params
    params.require(:mensaje).permit(:contenido, :fecha_envio, :leido, :remitente_id, :conversacion_id)
  end

  def set_mensaje
    @mensaje = Mensaje.find_by(id: params[:id])
  end

  def require_mensaje_ownership!
    return not_found_response!("mensaje") unless @mensaje
    unless @mensaje.remitente_id == current_usuario.id
      render json: { error: "No autorizado" }, status: :forbidden and return
    end
  end
end
