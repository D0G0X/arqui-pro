export interface IProyecto{
    id_proyecto: string;
    id_arquitecto: string;
    id_conversacion?: string;
    id_cliente?: string;
    id_solicitud?: string;
    titulo_proyecto: string;
    valoracion_promedio: number;
    descripcion: string;
    tipo_proyecto: "portafolio" | "contratado";
    fecha_publicacion: Date;
}