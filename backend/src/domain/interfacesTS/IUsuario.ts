export interface IUsuario{
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    estado_cuenta: string;
    password: string;
    rol: string;
    fecha_registro: Date;
    foto_perfil?: string;
    createdAt?: Date;
    updatedAt?: Date;
}