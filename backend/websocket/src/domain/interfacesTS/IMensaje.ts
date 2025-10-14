export default interface IMensaje {
    id_mensaje: number;
    id_conversacion: number;
    id_remitente: number;
    contenido: string;
    fecha_envio: string; 
    leido: boolean;
    imagenes?: string[]; 
}
