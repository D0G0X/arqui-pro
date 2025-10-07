export interface ISolicitudProyecto{
    id_solicitud: string;   
    id_arquitecto: string;
    id_cliente: string;
    estado: "pendiente" | "aceptado" | "rechazado";
    fecha: Date;
}