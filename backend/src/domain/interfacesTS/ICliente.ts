import type { IUsuario } from "./IUsuario";

export interface ICliente{
    id_cliente: string;
    usuario: IUsuario;
    identificacion: string;
}