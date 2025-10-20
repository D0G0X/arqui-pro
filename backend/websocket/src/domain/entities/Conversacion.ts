export class Conversacion {
  constructor(
    public readonly id_conversacion: number,
    public readonly id_cliente: number,
    public readonly id_arquitecto: number,
    public tipo: string,
    public comentario: string,
    public fecha: Date
  ) {}
}