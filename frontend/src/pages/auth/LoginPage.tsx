import { useState } from "react";
import FormularioLogin from "../../components/auth/FormularioLogin";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../styles/auth/LoginPage.css";
import imagenLogin from "../../assets/login.webp"

export default function LoginPage(){
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (email: string, password: string)=>{  
        setError(null);
        setLoading(true);

        try{
            await login(email, password);
            
            // Login exitoso, redirigir a la página principal
            // El AuthContext ya guardó el usuario y token
            navigate("/");
            
        } catch(error: any){
            console.error('Error en login:', error);
            
            // Mensajes de error más específicos
            if (error.response?.status === 401) {
                setError("Email o contraseña incorrectos");
            } else if (error.response?.status === 404) {
                setError("Usuario no encontrado");
            } else if (error.response?.data?.error) {
                setError(error.response.data.error);
            } else {
                setError("Ocurrió un error inesperado al intentar iniciar sesión");
            }
        } finally{
            setLoading(false);
        }
    };

    return (
        <div className="login-page-container">
            {/* Lado izquierdo para la imagen */}
            <div className="image-side">
                {/* Puedes colocar una etiqueta <img> o un componente aquí */}
                <img className="login-illustration" src={imagenLogin} alt="imagen de login" />
                {loading && <div className="loading-message">Cargando...</div>}
                {error && <div className="error-message">{error}</div>}
            </div>

            {/* Lado derecho para el formulario de Login (la "tarjeta" blanca) */}
            <div className="form-side">
                {/* El componente FormularioLogin ya incluye toda la estructura interna (logo, títulos, form) */}
                <FormularioLogin onSubmit={handleLogin} />
            </div>
        </div>     
    );
}