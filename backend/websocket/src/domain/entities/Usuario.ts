export class Usuario {
  constructor(
    public readonly id_usuario: number,
    public nombre: string,
    public apellido: string,
    public email: string,
    public estado_cuenta: string,
    public rol: string,
    public fecha_registro: Date,
    public foto_perfil: string | null
  ) {}
}
