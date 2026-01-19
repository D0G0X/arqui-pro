import { API_CONFIG, setAuthToken, getAuthToken, removeAuthToken } from "../../../config/api.config"
import axiosInstance from "../axiosInstance"
import type { Usuario, RegistroUsuarioInput, AuthResponse, LoginInput } from "../../../types/usuario.types"

// Registro de usuarios
export async function registroUsuario(usuarioData: RegistroUsuarioInput): Promise<Usuario> {
    try {
        const response = await axiosInstance.post(`${API_CONFIG.GATEWAY_URL}/auth/register`, usuarioData);
        return response.data; // El microservicio retorna el usuario directamente
    } catch (error) {
        throw error; // si sale mal lanza este error
    }
}

// Login de usuarios
export async function loginUsuario(loginData: LoginInput): Promise<AuthResponse> {
    try {
        const response = await axiosInstance.post(`${API_CONFIG.GATEWAY_URL}/auth/login`, loginData);

        // El microservicio devuelve: { access_token: "...", refresh_token: "...", usuario: {...} }
        const authResponse: AuthResponse = {
            usuario: response.data.usuario,
            token: response.data.access_token
        };

        setAuthToken(authResponse.token); // guarda el token en el local storage
        return authResponse; // si todo sale bien retorna el token y datos del usuario
    } catch (error) {
        throw error; // si sale mal lanza este error
    }
}

// Cerrar sesión de usuario
export async function logoutUsuario() {
    try {
        const token = getAuthToken();
        const response = await axiosInstance.post(`${API_CONFIG.GATEWAY_URL}/auth/logout`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });
        removeAuthToken();
        return response; //Si todo sale bien retorna un mensaje de exito
    } catch (error) {
        // Si hay error (ej. token ya expiró), igual removemos el token local
        removeAuthToken();
        throw error;
    }
}