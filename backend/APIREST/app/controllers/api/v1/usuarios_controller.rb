module Api
    module V1
        class UsuariosController < ApplicationController
            # before_action :authenticate_usuario!, only: [:show, :update, :destroy]
            before_action :set_usuario, only: %i[update show destroy]

            def index
                @usuarios = Usuario.all
                render json: @usuarios
            end

            def create
                @usuario = Usuario.new(usuario_params)
                if @usuario.save
                    render json: @usuario, status: :created
                else
                    render json: @usuario.errors, status: :unprocessable_entity
                end
            end

            def show
                render json: @usuario
            end

            def update
                if @usuario.update(usuario_params)
                    render json: @usuario
                else
                    render json: @usuario.errors, status: :unprocessable_entity
                end
            end

            def destroy
                if @usuario
                    @usuario.destroy
                    head :no_content  # responde con 204 No Content si se eliminó correctamente
                else
                    render json: { error: "Usuario no encontrado" }, status: :not_found
                end
            end

            private

            def usuario_params
                params.require(:usuario).permit(:nombre, :apellido, :email, :estado_cuenta, :password, :rol, :fecha_registro, :foto_perfil)
            end

            def set_usuario
                @usuario = Usuario.find_by(id: params[:id])
            end
        end
    end
end
