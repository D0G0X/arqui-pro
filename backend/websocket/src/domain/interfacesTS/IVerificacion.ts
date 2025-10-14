export default interface IVerificacion {
    id_verificacion: string;
    id_arquitecto: string;  // FK a Arquitecto
    id_moderador: string;   // FK a Moderador
    estado: "pendiente" | "verificado" | "rechazado";
    fecha_verificacion: Date;
}
