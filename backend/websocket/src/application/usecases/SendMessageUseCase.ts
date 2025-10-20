import { Mensaje } from "../domain/Mensaje";
import { IMessageRepository } from "../../ports/out/IMessageRepository";

export class SendMessageUseCase {
  private messageRepository: IMessageRepository;

  constructor(messageRepository: IMessageRepository) {
    this.messageRepository = messageRepository;
  }

  async execute(mensaje: Mensaje): Promise<Mensaje> {
    // Validaciones
    if (!mensaje.contenido || mensaje.contenido.trim() === "") {
      throw new Error("El contenido del mensaje no puede estar vacío");
    }
    if (!mensaje.id_conversacion) {
      throw new Error("El mensaje debe pertenecer a una conversación");
    }
    if (!mensaje.id_remitente) {
      throw new Error("El mensaje debe tener un remitente");
    }

    // Guardar mensaje usando el repositorio
    const mensajeGuardado = await this.messageRepository.saveMensaje(mensaje);

    // Retornar mensaje guardado
    return mensajeGuardado;
  }
}
