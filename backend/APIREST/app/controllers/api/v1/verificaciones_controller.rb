class Api::V1::VerificacionesController < ApplicationController
  before_action :set_verificacion, only: %i[update show destroy aprobar rechazar]

  # Solo usuarios moderador pueden actualizar/eliminar
  before_action :require_moderador!, only: %i[update destroy aprobar rechazar]

  def index
    @verificaciones = Verificacion.includes(arquitecto: :usuario, moderador: :usuario).all
    
    # Filtrar por estado si se proporciona
    if params[:estado].present? && params[:estado] != 'todos'
      @verificaciones = @verificaciones.where(estado: params[:estado])
    end
    
    # Paginación
    page = params[:page]&.to_i || 1
    per_page = params[:per_page]&.to_i || 10
    
    total = @verificaciones.count
    @verificaciones = @verificaciones.offset((page - 1) * per_page).limit(per_page)
    
    render json: {
      verificaciones: @verificaciones.as_json(include: {
        arquitecto: { include: :usuario },
        moderador: { include: :usuario }
      }),
      total: total,
      page: page,
      per_page: per_page
    }
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

  # Aprobar verificación
  def aprobar
    if @verificacion.update(
      estado: 'aprobado',
      moderador_id: params[:moderador_id],
      comentarios: params[:comentarios],
      fecha_verificacion: DateTime.now
    )
      render json: { 
        status: 'success', 
        message: 'Verificación aprobada correctamente',
        verificacion: @verificacion 
      }, status: :ok
    else
      render json: { 
        status: 'error', 
        errors: @verificacion.errors.full_messages 
      }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { 
      status: 'error', 
      message: 'Verificación no encontrada' 
    }, status: :not_found
  end

  # Rechazar verificación
  def rechazar
    if @verificacion.update(
      estado: 'rechazado',
      moderador_id: params[:moderador_id],
      comentarios: params[:comentarios],
      fecha_verificacion: DateTime.now
    )
      render json: { 
        status: 'success', 
        message: 'Verificación rechazada',
        verificacion: @verificacion 
      }, status: :ok
    else
      render json: { 
        status: 'error', 
        errors: @verificacion.errors.full_messages 
      }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { 
      status: 'error', 
      message: 'Verificación no encontrada' 
    }, status: :not_found
  end

  private

  def verificacion_params
    params.permit(:estado, :fecha_verificacion, :arquitecto_id, :moderador_id, :comentarios)
  end

  def set_verificacion
    @verificacion = Verificacion.find_by(id: params[:id])
  end
end
