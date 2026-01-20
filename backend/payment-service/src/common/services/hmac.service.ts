import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

/**
 * Servicio HMAC - Firma y verificación de mensajes usando HMAC-SHA256
 * 
 * Todos los webhooks salientes deben ir firmados y los entrantes verificados
 */
@Injectable()
export class HmacService {
  /**
   * Firma un payload usando HMAC-SHA256
   * @param payload Payload a firmar (objeto o string)
   * @param secret Secret compartido para firmar
   * @returns Firma HMAC en formato hexadecimal
   */
  sign(payload: string | object, secret: string): string {
    const payloadString = typeof payload === 'string' 
      ? payload 
      : JSON.stringify(payload);
    
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payloadString);
    return hmac.digest('hex');
  }

  /**
   * Verifica la firma de un payload
   * @param payload Payload recibido
   * @param signature Firma recibida en el header
   * @param secret Secret compartido
   * @returns true si la firma es válida, false en caso contrario
   */
  verify(
    payload: string | object,
    signature: string,
    secret: string,
  ): boolean {
    try {
      const expectedSignature = this.sign(payload, secret);
      
      // Comparación segura para evitar timing attacks
      return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex'),
      );
    } catch (error) {
      console.error('[HmacService] Error verificando firma:', error);
      return false;
    }
  }

  /**
   * Genera un secret aleatorio seguro
   * @param length Longitud del secret (default: 64 caracteres)
   * @returns Secret generado en formato hexadecimal
   */
  generateSecret(length: number = 64): string {
    return crypto.randomBytes(length / 2).toString('hex');
  }
}
