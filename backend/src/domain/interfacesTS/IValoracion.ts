export default interface IValoracion{
    id_valoracion: string;
    id_cliente: string;
    id_proyecto: string;
    calificacion: number;
    comentario: string;
    fecha: Date;
}