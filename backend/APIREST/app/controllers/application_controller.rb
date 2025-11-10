class ApplicationController < ActionController::API
  include Devise::Controllers::Helpers
  respond_to :json

  before_action :configure_permitted_parameters, if: :devise_controller?

  def current
    render json: current_usuario
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_in, keys: [:email, :password])
    devise_parameter_sanitizer.permit(:sign_up, keys: [:email, :password, :nombre, :apellido, :rol])
  end

  private

  def authenticate_usuario!
    token = request.headers['Authorization']&.split(' ')&.last
    
    Rails.logger.info "🔐 [AUTH] Request to: #{request.path}"
    Rails.logger.info "    Token present: #{token.present?}"
    
    if token
      begin
        payload = JWT.decode(token, JWT_SECRET_KEY, true, { algorithm: JWT_ALGORITHM }).first
        @current_usuario = Usuario.find(payload['sub'])
        
        Rails.logger.info "    ✅ Usuario autenticado: #{@current_usuario.email} (#{@current_usuario.rol})"
        
        # Verificar que el JTI no haya sido revocado
        if payload['jti'] != @current_usuario.jti
          Rails.logger.error "    ❌ Token revocado para usuario #{@current_usuario.email}"
          render json: { error: 'Token revocado' }, status: :unauthorized
          return
        end
      rescue JWT::DecodeError, JWT::ExpiredSignature, ActiveRecord::RecordNotFound => e
        Rails.logger.error "    ❌ Error de autenticación: #{e.class} - #{e.message}"
        render json: { error: 'Token inválido o expirado' }, status: :unauthorized
        return
      end
    else
      Rails.logger.error "    ❌ No se proporcionó token de autorización"
      render json: { error: 'Token de autorización requerido' }, status: :unauthorized
      return
    end
  end

  def current_usuario
    @current_usuario
  end

  def current_arquitecto
    return @current_arquitecto if @current_arquitecto
    
    if current_usuario&.rol == 'arquitecto'
      @current_arquitecto = Arquitecto.find_by(usuario_id: current_usuario.id)
      Rails.logger.info "📋 [CURRENT_ARQUITECTO] Usuario ID: #{current_usuario.id}, Arquitecto encontrado: #{@current_arquitecto.present?}"
      Rails.logger.info "    Arquitecto ID: #{@current_arquitecto&.id}" if @current_arquitecto
    end
    
    @current_arquitecto
  end

  # Helpers de autorización por rol/propiedad
  def require_rol!(rol)
    unless current_usuario&.rol == rol
      render json: { error: "Rol no autorizado" }, status: :forbidden and return
    end
  end

  # Helpers para cada rol específico
  def require_cliente!
    require_rol!("cliente")
  end

  def require_moderador!
    require_rol!("moderador")
  end

  def require_arquitecto!
    require_rol!("arquitecto")
    
    # Asegurar que el arquitecto existe
    unless current_arquitecto
      Rails.logger.error "    ❌ Usuario es arquitecto pero no tiene registro de Arquitecto"
      render json: { error: "Arquitecto no encontrado" }, status: :not_found and return
    end
    
    Rails.logger.info "    ✅ Arquitecto ID: #{current_arquitecto.id}"
  end

  def require_ownership!(record)
    owner_id =
      if record.is_a?(Usuario)
        record.id
      elsif record.respond_to?(:usuario_id)
        record.usuario_id
      else
        nil
      end

    unless owner_id.present? && current_usuario&.id == owner_id
      render json: { error: "Prohibido" }, status: :forbidden and return
    end
  end

  def not_found_response!(nombre)
    render json: { error: "#{nombre} no encontrado" }, status: :not_found and return
  end
end
