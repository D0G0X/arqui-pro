import type { IUsuario } from './IUsuario.js';

export default interface IArquitecto {
    id_arquitecto: number;
    usuario: IUsuario; // Relación con Usuario
    cedula: string;
    valoracion_prom_proyecto: number;
    descripcion: string;
    especialidades: string[];
    ubicacion: string;
    verificado: boolean;
    vistas_perfil: number;
}