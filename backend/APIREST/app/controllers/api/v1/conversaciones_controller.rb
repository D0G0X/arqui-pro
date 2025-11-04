class Api::V1::ConversacionesController < ApplicationController
  before_action :set_conversacion, only: %i[update show destroy]

  # Solo usuarios autenticados pueden crear/actualizar/eliminar
  #before_action :authenticate_usuario!, only: %i[create update destroy]

  def index
    @conversaciones = Conversacion.all
    render json: @conversaciones
  end

  def create
    @conversacion = Conversacion.new(conversacion_params)
    if @conversacion.save
      # Notificar al WebSocket sobre la nueva conversación
      begin
        WebSocketNotifier.notify_conversation_created(@conversacion)
        Rails.logger.info "WebSocket notification sent for conversation #{@conversacion.id}"
      rescue => e
        Rails.logger.error "Failed to notify WebSocket: #{e.message}"
        Rails.logger.error e.backtrace.join("\n")
      end
      render json: @conversacion, status: :created
    else
      render json: @conversacion.errors, status: :unprocessable_entity
    end
  end

  def show
    render json: @conversacion
  end

  def update
    if @conversacion.update(conversacion_params)
      render json: @conversacion
    else
      render json: @conversacion.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @conversacion
      @conversacion.destroy
      head :no_content  # responde con 204 No Content si se eliminó correctamente
    else
      render json: { error: "conversacion no encontrado" }, status: :not_found
    end
  end

  private

  def conversacion_params
    params.require(:conversacion).permit(:fecha, :cliente_id, :arquitecto_id)
  end

  def set_conversacion
    @conversacion = Conversacion.find_by(id: params[:id])
  end
end
