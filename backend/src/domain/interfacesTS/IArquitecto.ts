import type { IUsuario } from './IUsuario';

export default interface IArquitecto {
    id_arquitecto: number;
    usuario: IUsuario; // Relación con Usuario
    identificacion: string;
    valoracion_prom_proyecto: number;
    descripcion: string;
    especialidades: string[];
    ubicacion: string;
    verificado: boolean;
    vistas_perfil: number;
}