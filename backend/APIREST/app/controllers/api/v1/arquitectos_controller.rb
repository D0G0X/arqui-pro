class Api::V1::ArquitectosController < ApplicationController
  before_action :set_arquitecto, only: %i[update show destroy]

  def index
    @arquitectos = Arquitecto.all
    render json: @arquitectos
  end

  def create
    @arquitecto = Arquitecto.new(arquitecto_params)
    if @arquitecto.save
      render json: @arquitecto, status: :created
    else
      render json: @arquitecto.errors, status: :unprocessable_entity
    end
  end

  def show
    render json: @arquitecto
  end

  def update
    if @arquitecto.update(arquitecto_params)
      render json: @arquitecto
    else
      render json: @arquitecto.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @arquitecto
      @arquitecto.destroy
      head :no_content  # responde con 204 No Content si se eliminó correctamente
    else
      render json: { error: "arquitecto no encontrado" }, status: :not_found
    end
  end

  private

  def arquitecto_params
    params.require(:arquitecto).permit(:usuario_id, :cedula, :valoracion_prom_proyecto, :descripcion, :especialidades, :ubicacion, :verificado,
                                      :vistas_perfil, usuario_attributes: [ :id, :nombre, :apellido, :email, :estado, :password, :rol, :fecha_registro, :foto_perfil ])
  end

  def set_arquitecto
    @arquitecto = Arquitecto.find_by(id: params[:id])
  end
end
