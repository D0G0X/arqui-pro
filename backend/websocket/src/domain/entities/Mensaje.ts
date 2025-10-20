export class Mensaje {
  constructor(
    public readonly id_mensaje: number,
    public readonly id_conversacion: number,
    public readonly id_remitente: number,
    public readonly contenido: string,
    public readonly fecha_envio: Date,
    public leido: boolean
  ) {}
}
