import React, { useState, useEffect, useRef, type FormEvent } from "react";
import { 
    Eye, EyeOff, Lock, User, Mail, Smartphone, CornerDownRight, 
    MapPin, FileText
} from "lucide-react";
import type { RegistroUsuarioInput } from "../../types/usuario.types";
import "../../styles/auth/registro/FormularioRegistroArquitecto.css"

// Definimos los tipos de datos locales para el formulario
interface ArquitectoFormData{
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    cedula: string; 
    descripcion: string;
    especialidades: string[];
    ubicacion: string;
}

// Mantenemos FieldErrors SÓLO para la clase CSS del input
interface FieldErrors{
    email?: string; // Lo usaremos solo para cambiar la clase CSS del input
    cedula?: string; // Lo usaremos solo para cambiar la clase CSS del input
}

interface Props {
    onSubmit: (data: RegistroUsuarioInput) => void;
    // La referencia manejará el mensaje de error general desde el padre (API)
    onApiError: React.MutableRefObject<((error: string) => void) | null>;
    onRegisterAsCliente: () => void;
}

export default function FormularioRegistroArquitecto({ onSubmit, onApiError, onRegisterAsCliente }: Props){
    const [formData, setFormData] = useState<ArquitectoFormData>({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        cedula: "", 
        descripcion: "",
        especialidades: [],
        ubicacion: "",       
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showEspecialidadesDropdown, setShowEspecialidadesDropdown] = useState(false);
    const especialidadesRef = useRef<HTMLDivElement>(null);
    
    // Cerrar dropdown al hacer clic afuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (especialidadesRef.current && !especialidadesRef.current.contains(event.target as Node)) {
                setShowEspecialidadesDropdown(false)
            }
        }

        if (showEspecialidadesDropdown) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showEspecialidadesDropdown])
    
    // Este estado se usará para errores locales Y los errores de la API
    const [generalError, setGeneralError] = useState<string | null>(null); 
    // Estado para errores visuales de campo (email/cedula ya existen)
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});


    const handleApiError = (apiError: string) => {
        // Mantenemos la lógica para aplicar la clase 'input-error-state' visualmente
        const newFieldErrors: FieldErrors = {};
        const lowerError = apiError.toLowerCase();

        // 1. Mapear errores de API a errores de campo visuales (solo para el CSS)
        if (lowerError.includes("correo") || lowerError.includes("email")) {
            newFieldErrors.email = 'api-error'; // Marcador visual
        }
        if (lowerError.includes("cédula") || lowerError.includes("cedula")) {
            newFieldErrors.cedula = 'api-error'; // Marcador visual
        }

        // 2. Mostrar el mensaje de error de la API en el error general
        setFieldErrors(newFieldErrors);
        setGeneralError(apiError);
    };

    // Asignamos la función handleApiError a la referencia del padre
    if (onApiError.current === null) {
        // Aseguramos que la ref se asigne solo una vez.
        onApiError.current = handleApiError as unknown as ((error: string) => void);
    }
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        
        // Limpiar errores generales y de campo al escribir
        if (generalError) setGeneralError(null);

        // Limpiar marcador visual de errores de campo específicos
        if (fieldErrors[id as keyof FieldErrors]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[id as keyof FieldErrors];
                return newErrors;
            });
        }

        // Cerrar dropdown cuando escribes en otros campos
        if (showEspecialidadesDropdown) setShowEspecialidadesDropdown(false);
    };

    const SPECIALIDADES = [
        'Diseño Urbano',
        'Arquitectura Sostenible',
        'Comercial',
        'Paisajismo y Urbanismo',
        'Residencial',
        'Restauración Patrimonial',
        'Conservación',
        'Arquitectura Bioclimática'
    ] as const
    
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
        
        // Limpiar errores generales y de campo al escribir
        if (generalError) setGeneralError(null);
        if (fieldErrors.cedula) {
            setFieldErrors(prev => ({ ...prev, cedula: undefined }));
        }
    };
    
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setGeneralError(null);
        setFieldErrors({});

    const { nombre, apellido, email, password, passwordConfirmation, cedula, descripcion, ubicacion } = formData;
    const especialidadesArr = formData.especialidades || []

        // --- Validaciones locales ---
        if (password.length < 6) {
            setGeneralError("La contraseña debe tener al menos 6 dígitos.");
            return;
        }

        if (password !== passwordConfirmation) {
            setGeneralError("Las contraseñas no coinciden.");
            return;
        }
        
        if (cedula.length !== 10) {
            setGeneralError("La cédula debe contener exactamente 10 dígitos.");
            return;
        }

        if(descripcion.trim().length === 0 || descripcion.length > 400){
            setGeneralError("La descripción es obligatoria y no debe superar los 400 caracteres.");
            return; // Añadido el return para detener el envío si falla la validación
        }
        
        // Asumiendo que especialidades y ubicacion son obligatorios para un arquitecto
        if(especialidadesArr.length === 0){
             setGeneralError("Debes especificar al menos una especialidad (máximo 4).");
            return;
        }
        if(ubicacion.trim().length === 0){
             setGeneralError("La ubicación es obligatoria.");
            return;
        }


        // --- Preparar datos para la API ---
        const dataToSend: RegistroUsuarioInput = {
            nombre,
            apellido,
            email,
            password,
            password_confirmation: passwordConfirmation,
            rol: 'arquitecto',
            arquitecto_attributes: {
                cedula,
                descripcion,
                // Convertir array de especialidades a string separado por ", "
                especialidades: especialidadesArr.join(', '),
                ubicacion,
            }
        };
        onSubmit(dataToSend);    
    };

    return (
        <div className="fra-register-card">
            
            {/* Logo Section */}
            <div className="fra-logo-section">
                <div className="fra-logo-color-box"></div>
                <span className="fra-logo-text">ArquiPro</span>
            </div>

            {/* Títulos */}
            <h1 className="fra-welcome-title">Regístrate como Arquitecto</h1>
            <p className="fra-subtitle">Únete a nuestra plataforma para mostrar tu trabajo y conectar con nuevos clientes.</p>

            {/* Error General (validaciones locales y errores de API) */}
            {generalError && <div className="fra-validation-error">{generalError}</div>}

            <form className="fra-register-form" onSubmit={handleSubmit}>
                
                {/* 1ra Fila: Nombre, Apellido, Email */}
                <div className="fra-input-row">
                    <div className="fra-input-group">
                        <label htmlFor="nombre" className="fra-input-label">Nombre</label>
                        <div className="fra-input-with-icon">
                            <User className="fra-input-start-icon" size={20} color="#adb5bd"/>
                            <input
                                className="fra-form-input"
                                type="text"
                                id="nombre"
                                placeholder="Ingresa tu nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="fra-input-group">
                        <label htmlFor="apellido" className="fra-input-label">Apellido</label>
                        <div className="fra-input-with-icon">
                            <User className="fra-input-start-icon" size={20} color="#adb5bd"/>
                            <input
                                className="fra-form-input"
                                type="text"
                                id="apellido"
                                placeholder="Ingresa tu apellido"
                                value={formData.apellido}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="fra-input-group">
                        <label htmlFor="email" className="fra-input-label">Email</label>
                        <div className="fra-input-with-icon">
                            <Mail className="fra-input-start-icon" size={20} color="#adb5bd"/>
                            <input 
                                className={`fra-form-input ${fieldErrors.email ? 'fra-input-error-state' : ''}`}
                                type="email"
                                id="email"
                                placeholder="Ingresa tu correo electrónico"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* 2da Fila: Contraseña, Confirmación, Cédula */}
                <div className="fra-input-row">
                    <div className="fra-input-group">
                        <label htmlFor="password" className="fra-input-label">Contraseña</label>
                        <div className="fra-input-with-icon">
                            <Lock className="fra-input-start-icon" size={20} color="#adb5bd"/>
                            <input
                                className="fra-form-input"
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="Crea una contraseña"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6} 
                            />
                            <button
                                type="button"
                                className="fra-password-toggle-icon"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    
                    <div className="fra-input-group">
                        <label htmlFor="passwordConfirmation" className="fra-input-label">Confirmación de Contraseña</label>
                        <div className="fra-input-with-icon">
                            <CornerDownRight className="fra-input-start-icon" size={20} color="#adb5bd"/>
                            <input
                                className="fra-form-input"
                                type={showConfirmPassword ? "text" : "password"}
                                id="passwordConfirmation"
                                placeholder="Confirma tu contraseña"
                                value={formData.passwordConfirmation}
                                onChange={handleChange}
                                required
                                minLength={6}
                            />
                        <button
                                type="button"
                                className="fra-password-toggle-icon"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label={showConfirmPassword ? "Ocultar confirmación de contraseña" : "Mostrar confirmación de contraseña"}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    
                    <div className="fra-input-group">
                        <label htmlFor="cedula" className="fra-input-label">Cédula</label>
                        <div className="fra-input-with-icon">
                            <Smartphone className="fra-input-start-icon" size={20} color="#adb5bd"/>
                            <input
                                className={`fra-form-input ${fieldErrors.cedula ? 'fra-input-error-state' : ''}`}
                                type="tel"
                                id="cedula"
                                placeholder="Ingresa tu número de cédula"
                                value={formData.cedula}
                                onChange={handleCedulaChange}
                                required
                                maxLength={10} 
                            />
                        </div>
                    </div>
                </div>

                {/* 3ra Fila: Especialidades y Ubicación */}
                <div className="fra-input-row fra-input-row-half">
                    <div className="fra-input-group fra-especialidades-wrapper" ref={especialidadesRef}>
                        <label className="fra-input-label">Especialidades (máx. 4)</label>
                        
                        {/* Botón para abrir dropdown */}
                        <button
                            type="button"
                            className="fra-especialidades-button"
                            onClick={() => setShowEspecialidadesDropdown(!showEspecialidadesDropdown)}
                        >
                            <span className="fra-especialidades-button-text">
                                {formData.especialidades.length === 0 
                                    ? 'Elija las especialidades' 
                                    : `${formData.especialidades.length} seleccionada${formData.especialidades.length > 1 ? 's' : ''}`}
                            </span>
                            <span className={`fra-dropdown-arrow ${showEspecialidadesDropdown ? 'open' : ''}`}>
                                ▼
                            </span>
                        </button>

                        {/* Dropdown flotante */}
                        {showEspecialidadesDropdown && (
                            <div className="fra-especialidades-dropdown">
                                {SPECIALIDADES.map((s) => (
                                    <label key={s} className={`fra-especialidad-item ${formData.especialidades.includes(s) ? 'selected' : ''}`}>
                                        <input
                                            type="checkbox"
                                            checked={formData.especialidades.includes(s)}
                                            disabled={!formData.especialidades.includes(s) && formData.especialidades.length >= 4}
                                            onChange={() => {
                                                if (formData.especialidades.includes(s)) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        especialidades: prev.especialidades.filter(e => e !== s)
                                                    }))
                                                } else if (formData.especialidades.length < 4) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        especialidades: [...prev.especialidades, s]
                                                    }))
                                                }
                                            }}
                                        />
                                        <span className="fra-especialidad-name">{s}</span>
                                    </label>
                                ))}
                            </div>
                        )}

                        <small className="fra-char-count">Seleccionadas: {formData.especialidades.length} / 4</small>
                    </div>
                    <div className="fra-input-group">
                        <label htmlFor="ubicacion" className="fra-input-label">Ubicación</label>
                        <div className="fra-input-with-icon">
                            <MapPin className="fra-input-start-icon" size={20} color="#adb5bd"/>
                            <input
                                className="fra-form-input"
                                type="text"
                                id="ubicacion"
                                placeholder="Ej. Guayaquil, Ecuador"
                                value={formData.ubicacion}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* 4ta Fila: Descripción (TextArea) */}
                <div className="fra-input-group fra-textarea-group">
                    <label htmlFor="descripcion" className="fra-input-label">Descripción Profesional (Máx. 400 caracteres)</label>
                    <div className="fra-input-with-icon fra-textarea-container">
                        <FileText className="fra-input-start-icon fra-textarea-icon" size={20} color="#adb5bd"/>
                        <textarea
                            className="fra-form-textarea"
                            id="descripcion"
                            placeholder="Cuéntanos sobre ti, tu experiencia y los proyectos que buscas..."
                            value={formData.descripcion}
                            onChange={handleChange}
                            maxLength={400}
                            required
                        />
                    </div>
                    <small className="fra-char-count">{formData.descripcion.length} / 400</small>
                </div>


                {/* Botón de Registro */}
                <button
                    type="submit"
                    className="fra-register-button"
                >
                    Crear Cuenta
                </button>
            </form>

            {/* Sección de "Already have an account?" */}
            <div className="fra-login-text">
                ¿Ya tienes una cuenta? <a href="/login" className="fra-login-link">Iniciar sesión</a>
            </div>
            
            {/* Botón de "Register as Client" */}
            <div className="fra-client-register-container">
                <button className="fra-client-register-button" onClick={onRegisterAsCliente}>
                    Registrarse como Cliente <CornerDownRight size={20} style={{marginLeft: '8px'}}/>
                </button>
            </div>
        </div>
    );
}