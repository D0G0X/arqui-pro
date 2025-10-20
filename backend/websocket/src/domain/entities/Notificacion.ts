export class Notificacion {
  constructor(
    public readonly id_notificacion: number,
    public readonly id_usuario: number,
    public mensaje: string,
    public fecha: Date,
    public leido: boolean
  ) {}
}
