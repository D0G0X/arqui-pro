export default interface INotificacion {
    id_notificacion: number;
    id_usuario: number;
    mensaje: string;
    fecha: string; 
    leido: boolean;
}