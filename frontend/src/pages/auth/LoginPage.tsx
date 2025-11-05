import { useState } from "react";
import FormularioLogin from "../../components/auth/formularioLogin";
import { loginUsuario } from "../../services/api/auth/authService";
import { useNavigate } from "react-router-dom";
import "../../styles/auth/LoginPage.css";
import imagenLogin from "../../assets/login.webp"

export default function LoginPage(){
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (email: string, password: string)=>{  
        setError(null);
        setLoading(true);

        try{
            const data = await loginUsuario({ email, password });
            if(data.usuario){
                navigate("/dashboard"); // Esto hay que cambiarlo a la ruta verdadera
            } else{
                setError("No se pudo iniciar sesión. Revisa tus credenciales.");
            }
        } catch(error){
            setError("Ocurrió un error inesperado al intentar iniciar sesión.");
            console.error(error);
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