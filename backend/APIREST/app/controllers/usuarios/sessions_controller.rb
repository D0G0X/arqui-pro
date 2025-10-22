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
            email: usuario.email,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            rol: usuario.rol,
            estado_cuenta: usuario.estado_cuenta
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
      # Para logout, simplemente devolvemos éxito ya que no usamos sesiones
      # El cliente debe eliminar el token JWT localmente
      # No necesitamos validar el token para logout
      render json: {
        status: { code: 200, message: 'Sesión cerrada correctamente.' }
      }, status: :ok
    end

end
  