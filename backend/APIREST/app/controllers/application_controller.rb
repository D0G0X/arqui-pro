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
      
      if token
        begin
          payload = JWT.decode(token, Rails.application.credentials.devise_jwt_secret_key, true, { algorithm: 'HS256' }).first
          @current_usuario = Usuario.find(payload['sub'])
          
          # Verificar que el JTI no haya sido revocado
          if payload['jti'] != @current_usuario.jti
            render json: { error: 'Token revocado' }, status: :unauthorized
            return
          end
        rescue JWT::DecodeError, JWT::ExpiredSignature, ActiveRecord::RecordNotFound
          render json: { error: 'Token inválido o expirado' }, status: :unauthorized
          return
        end
      else
        render json: { error: 'Token de autorización requerido' }, status: :unauthorized
        return
      end
    end

    def current_usuario
      @current_usuario
    end
end
