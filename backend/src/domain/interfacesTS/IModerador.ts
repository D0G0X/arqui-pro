import type { IUsuario } from './IUsuario';

export default interface IModerador {
    id_moderador: number;
    usuario: IUsuario; // Relación con Usuario
}