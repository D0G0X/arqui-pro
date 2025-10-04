export default interface IIncidencia {
    id_incidencia: string;
    id_usuario_emisor: string; // FK a Usuario que reporta
    id_usuario_receptor: string; // FK a Usuario que recibe
    id_moderador: string; // FK a Moderador que gestiona
    descripcion: string;
    imagen: string; // URL o path de la imagen
    estado: "pendiente" |  "resuelto" | "en revision";
    fecha: Date;
}