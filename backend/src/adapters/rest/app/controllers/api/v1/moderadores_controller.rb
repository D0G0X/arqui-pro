class Api::V1::ModeradoresController < ApplicationController
  before_action :set_moderador, only: %i[update show destroy]

  def index
    @moderadores = Moderador.all
    render json: @moderadores
  end

  def create
    @moderador = Moderador.new(moderador_params)
    if @moderador.save
      render json: @moderador, status: :created
    else
      render json: @moderador.errors, status: :unprocessable_entity
    end
  end

  def show
    render json: @moderador
  end

  def update
    if @moderador.update(moderador_params)
      render json: @moderador
    else
      render json: @moderador.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @moderador
      @moderador.destroy
      head :no_content  # responde con 204 No Content si se eliminó correctamente
    else
      render json: { error: "moderador no encontrado" }, status: :not_found
    end
  end

  private

  def moderador_params
    params.require(:moderador).permit(:usuario_id, usuario_attributes: [ :id, :nombre, :apellido, :email, :estado, :password, :rol, :fecha_registro, :foto_perfil ])
  end

  def set_moderador
    @moderador = Moderador.find_by(id: params[:id])
  end
end
