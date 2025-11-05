import { useState, type FormEvent } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import "../../styles/auth/formularioLogin.css";

interface Props {
    onSubmit: (email: string, password: string) => void;
}

export default function FormularioLogin({onSubmit}: Props){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Comentado para quitar el boton de recordar
    // const [remember, setRemember] = useState(false);

    // Para mostrar y ocultar la contraseña
    const [ showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(email, password);
    }
    
    const togglePasswordVisibility = ()=>{
        setShowPassword(!showPassword)
    }

    return (
        <div className="login-card"> {/* Contenedor principal para la tarjeta */}
            <div className="logo-section">
                <span className="logo-color-box"></span>
                <span className="logo-text">ArquiPro</span>
            </div>
            
            <h1 className="welcome-title">Welcome Back</h1>
            <p className="subtitle">Log in to your account to continue</p>

            <form onSubmit={handleSubmit} className="login-form">
                
                {/* Campo de Correo Electrónico */}
                <div className="input-group">
                    <label htmlFor="email" className="input-label">Email Address</label>
                    <div className="input-with-icon">
                        {/* Icono de Usuario (User) - se agrega al lado derecho */}
                        <User className="input-start-icon" size={20} color="#adb5bd"/>
                        <input 
                            className="form-input"
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>
                
                {/* Campo de Contraseña */}
                <div className="input-group">
                    <div className="password-header">
                        <label htmlFor="password" className="input-label">Password</label>
                        <a href="/forgot-password" className="forgot-password-link">Forgot Password?</a>
                    </div>
                    <div className="input-with-icon">
                        <Lock className="input-start-icon" size={20} color="#adb5bd"></Lock>
                        <input 
                            className="form-input"
                            // Alterna el tipo entre 'password' y 'text'
                            type={showPassword ? "text" : "password"} 
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e)=> setPassword(e.target.value)}
                            required
                        />
                        {/* Icono de Ojo (Eye/EyeOff) para alternar visibilidad */}
                        {showPassword ? (
                            <EyeOff 
                                className="password-toggle-icon" 
                                size={20} 
                                color="#adb5bd" 
                                onClick={togglePasswordVisibility}
                            />
                        ) : (
                            <Eye 
                                className="password-toggle-icon" 
                                size={20} 
                                color="#adb5bd" 
                                onClick={togglePasswordVisibility}
                            />
                        )}
                        
                        {/* Opcional: Icono de candado (Lock) si deseas que aparezca también */}
                        {/* <Lock className="input-start-icon" size={20} color="#adb5bd"/> */} 
                    </div>
                </div>

                {/* Botón de Login */}
                <button type="submit" className="login-button">Log In</button>
            </form>
            
            {/* Sección de Sign Up */}
            <p className="signup-text">
                Don't have an account? <a href="/signup" className="signup-link">Sign Up</a>
            </p>
        </div>
    );
}