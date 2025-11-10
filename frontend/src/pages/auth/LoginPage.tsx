import { useState, useEffect } from "react";
import FormularioLogin from "../../components/auth/FormularioLogin";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../styles/auth/login/LoginPage.css";
import imagenLogin from "../../assets/login.webp"

export default function LoginPage(){
    const navigate = useNavigate();
    const { login, user, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Redirección automática si ya está autenticado
    useEffect(() => {
        if (isAuthenticated && user) {
            console.log('👤 Usuario ya autenticado, redirigiendo...', user.rol);
            
            if (user.rol === 'moderador') {
                navigate("/moderador/dashboard", { replace: true });
            } else if (user.rol === "cliente") {
                navigate("/cliente/home", { replace: true });
            } else if (user.rol === "arquitecto") {
                navigate("/arquitecto/profile", { replace: true });
            } else {
                navigate("/", { replace: true });
            }
        }
    }, [isAuthenticated, user, navigate]);

    const handleLogin = async (email: string, password: string)=>{  
        setError(null);
        setLoading(true);

        try{
            await login(email, password);
            
            // Login exitoso, redirigir según el rol del usuario
            // Obtener el usuario del localStorage ya que el estado puede no haberse actualizado
            const userData = localStorage.getItem('user_data');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                console.log(parsedUser.rol)
                if (parsedUser.rol === 'moderador') {
                    navigate("/moderador/dashboard");
                }
                else if(parsedUser.rol === "cliente"){
                    navigate("/cliente/home")
                }
                else if(parsedUser.rol === "arquitecto"){
                    navigate("/arquitecto/profile")
                }
                else {
                    navigate("/");
                }
            } else {
                navigate("/");
            }
            
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
                {loading && <div className="login-loading-message">Cargando...</div>}
                {error && <div className="login-error-message">{error}</div>}
            </div>

            {/* Lado derecho para el formulario de Login (la "tarjeta" blanca) */}
            <div className="form-side">
                {/* El componente FormularioLogin ya incluye toda la estructura interna (logo, títulos, form) */}
                <FormularioLogin onSubmit={handleLogin} />
            </div>
        </div>     
    );
}