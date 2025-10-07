import { IImagen } from "./IImagen";

export interface IAvance{
    id_avance: string;
    descripcion: string;
    id_proyecto: string;
    fecha: Date;
    imagen: IImagen;
}