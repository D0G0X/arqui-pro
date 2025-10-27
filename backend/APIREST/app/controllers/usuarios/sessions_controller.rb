class Usuarios::SessionsController < ApplicationController
  # POST /api/v1/usuarios/sign_in
  def create
    email = params[:usuario][:email]
    password = params[:usuario][:password]
    
    usuario = Usuario.find_for_database_authentication(email: email)
    
    if usuario && usuario.valid_password?(password)
      # Generar token JWT manualmente sin usar sesiones
      payload = {
        sub: usuario.id,
        iat: Time.current.to_i,
        exp: 24.hours.from_now.to_i,
        jti: usuario.jti
      }
      
      token = JWT.encode(payload, Rails.application.credentials.devise_jwt_secret_key, 'HS256')
      
      response.headers['Authorization'] = "Bearer #{token}"
      
      render json: {
        status: { code: 200, message: 'Inicio de sesión exitoso.' },
        data: {
          id: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          estado_cuenta: usuario.estado_cuenta,
          rol: usuario.rol,
          fecha_registro: usuario.fecha_registro,
          foto_perfil: usuario.foto_perfil
        },
        token: token
      }, status: :ok
    else
      render json: {
        status: { code: 401, message: 'Credenciales inválidas.' }
      }, status: :unauthorized
    end
  end

  # DELETE /api/v1/usuarios/sign_out
  def destroy
    auth_header = request.headers['Authorization']
    token = auth_header&.start_with?('Bearer ') ? auth_header.split(' ', 2).last : nil

    unless token.present?
      render json: { status: { code: 401, message: 'Token de autorización requerido.' } }, status: :unauthorized and return
    end

    puts "Token recibido para sign_out: #{token}"
    puts " "
  
    begin
      payload = JWT.decode(token, Rails.application.credentials.devise_jwt_secret_key, true, { algorithm: 'HS256' }).first
      usuario = Usuario.find(payload['sub'])

      if payload['jti'] == usuario.jti
        usuario.update!(jti: SecureRandom.uuid)
        render json: { status: { code: 200, message: 'Sesión cerrada correctamente.' } }, status: :ok
      else
        render json: { status: { code: 401, message: 'Token ya revocado.' } }, status: :unauthorized
      end
    rescue JWT::ExpiredSignature
      render json: { status: { code: 401, message: 'Token expirado.' } }, status: :unauthorized
    rescue JWT::DecodeError
      render json: { status: { code: 401, message: 'Token inválido.' } }, status: :unauthorized
    rescue ActiveRecord::RecordNotFound
      render json: { status: { code: 401, message: 'Usuario no encontrado.' } }, status: :unauthorized
    rescue => e
      Rails.logger.error("[SignOut] #{e.class}: #{e.message}")
      render json: { status: { code: 500, message: 'Error al cerrar sesión.' } }, status: :internal_server_error
    end
  end
end
