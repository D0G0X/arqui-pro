import { useState } from "react";
import FormularioRegistroClientes from "../../components/auth/FormularioRegistroCliente";
import { useNavigate } from "react-router-dom";
import { registroUsuario } from "../../services/api/auth/authService";
import "../../styles/auth/RegistroCliente.css"
import type { RegistroUsuarioInput } from "../../types/usuario.types";
import type { Usuario } from "../../types/usuario.types";

export default function RegistroClientePage(){
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const handleRegistroSubmit = async (data: RegistroUsuarioInput) => {
        setIsLoading(true);
        setApiError(null);

        try {
            // Llamamos a la función de la API con los datos validados
            const nuevoUsuario: Usuario = await registroUsuario(data);

            console.log("Usuario registrado:", nuevoUsuario);
            setIsLoading(false);

            navigate('/login'); 
        } catch (error: any) {
            // Manejo de errores
            setIsLoading(false);
            
            // Intentamos obtener un mensaje de error específico de la respuesta de Axios
            let errorMessage = "Error en el registro. Por favor, intente más tarde.";
            if (error && error.response && error.response.data && error.response.data.message) {
                // Si el error viene del backend (ej: "Email ya existe")
                errorMessage = error.response.data.message;
            } else if (error && error.message) {
                errorMessage = error.message;
            }
            
            setApiError(errorMessage);
        }
    };

    return (
        <div className="registro-page-container">
            <div className="form-side">
                <FormularioRegistroClientes onSubmit={handleRegistroSubmit} />
            </div>
        </div>
    );
}