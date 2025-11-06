import React, { useState, type FormEvent } from "react";
import { Eye, EyeOff, Lock, User, Mail, Smartphone, CornerDownRight } from "lucide-react";
import type { RegistroUsuarioInput } from "../../types/usuario.types";
import "../../styles/auth/registro/FormularioRegistroCliente.css"; 

// Definimos los tipos de datos locales para el formulario
interface ClienteFormData {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    cedula: string;
}

interface Props {
    onSubmit: (data: RegistroUsuarioInput) => void;
    onRegisterAsArquitecto: () => void;
}

export default function FormularioRegistroClientes({ onSubmit, onRegisterAsArquitecto}: Props) {
    const [formData, setFormData] = useState<ClienteFormData>({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        cedula: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        // Limpiar el error al escribir
        if (error) setError(null);
    };

    const handleCedulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        // 1. Limitar a solo números
        value = value.replace(/[^0-9]/g, ''); 
        // 2. Limitar a 10 dígitos
        if (value.length > 10) value = value.substring(0, 10);

        setFormData(prev => ({
            ...prev,
            cedula: value
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        const { nombre, apellido, email, password, passwordConfirmation, cedula } = formData;

        // --- Validaciones ---
        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 dígitos.");
            return;
        }

        if (password !== passwordConfirmation) {
            setError("Las contraseñas no coinciden.");
            return;
        }
        
        if (cedula.length !== 10) {
            setError("La cédula debe contener exactamente 10 dígitos.");
            return;
        }

        // --- Preparar datos para la API ---
        const dataToSend: RegistroUsuarioInput = {
            nombre,
            apellido,
            email,
            password,
            password_confirmation: passwordConfirmation,
            rol: 'cliente',
            cliente_attributes: {
                cedula,
            }
        };

        onSubmit(dataToSend);
    };

    return (
        <div className="register-card">
            {/* Logo Section */}
            <div className="logo-section">
                <div className="logo-color-box"></div>
                <span className="logo-text">ArquiPro</span>
            </div>

            {/* Títulos */}
            <h1 className="welcome-title">Create Your Client Account</h1>
            <p className="subtitle">Sign up to start browsing portfolios and connecting with top professionals.</p>

            {error && <div className="validation-error">{error}</div>}

            <form className="register-form" onSubmit={handleSubmit}>
                
                {/* Nombre y Apellido (Fila) */}
                <div className="input-row">
                    <div className="input-group">
                        <label htmlFor="nombre" className="input-label">Nombre</label>
                        <div className="input-with-icon">
                            <User className="input-start-icon" size={20} color="#adb5bd"/>
                            <input
                                className="form-input"
                                type="text"
                                id="nombre"
                                placeholder="Enter your first name"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <label htmlFor="apellido" className="input-label">Apellido</label>
                        <div className="input-with-icon">
                            <User className="input-start-icon" size={20} color="#adb5bd"/>
                            <input
                                className="form-input"
                                type="text"
                                id="apellido"
                                placeholder="Enter your last name"
                                value={formData.apellido}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Email */}
                <div className="input-group">
                    <label htmlFor="email" className="input-label">Email</label>
                    <div className="input-with-icon">
                        <Mail className="input-start-icon" size={20} color="#adb5bd"/>
                        <input 
                            className="form-input"
                            type="email"
                            id="email"
                            placeholder="Enter your email address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Contraseña */}
                <div className="input-group">
                    <label htmlFor="password" className="input-label">Contraseña</label>
                    <div className="input-with-icon">
                        <Lock className="input-start-icon" size={20} color="#adb5bd"/>
                        <input
                            className="form-input"
                            type={showPassword ? "text" : "password"}
                            id="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6} // Validación HTML mínima
                        />
                        <button
                            type="button"
                            className="password-toggle-icon"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>
                
                {/* Confirmar Contraseña */}
                <div className="input-group">
                    <label htmlFor="passwordConfirmation" className="input-label">Confirmar Contraseña</label>
                    <div className="input-with-icon">
                        <CornerDownRight className="input-start-icon" size={20} color="#adb5bd"/>
                        <input
                            className="form-input"
                            type={showConfirmPassword ? "text" : "password"}
                            id="passwordConfirmation"
                            placeholder="Confirm your password"
                            value={formData.passwordConfirmation}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                         <button
                            type="button"
                            className="password-toggle-icon"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label={showConfirmPassword ? "Ocultar confirmación de contraseña" : "Mostrar confirmación de contraseña"}
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                {/* Cédula */}
                <div className="input-group">
                    <label htmlFor="cedula" className="input-label">Cédula</label>
                    <div className="input-with-icon">
                        <Smartphone className="input-start-icon" size={20} color="#adb5bd"/>
                        <input
                            className="form-input"
                            type="tel"
                            id="cedula"
                            placeholder="Enter your ID number"
                            value={formData.cedula}
                            onChange={handleCedulaChange}
                            required
                            maxLength={10} // Límite visual, la validación final es en JS
                        />
                    </div>
                </div>

                {/* Botón de Registro */}
                <button
                    type="submit"
                    className="register-button"
                >
                    Create Account
                </button>
            </form>

            {/* Sección de "Already have an account?" */}
            <div className="signup-text">
                Already have an account? <a href="/login" className="signup-link">Log in</a>
            </div>
            
            {/* Botón de "Register as Architect" */}
            <div className="architect-register-container">
                <button className="architect-register-button"
                    onClick={onRegisterAsArquitecto}
                >
                    Register as Architect <CornerDownRight size={20} style={{marginLeft: '8px'}}/>
                </button>
            </div>
        </div>
    );
}
