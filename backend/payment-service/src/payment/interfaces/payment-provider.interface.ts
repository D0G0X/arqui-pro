/**
 * Interfaz PaymentProvider - Define el contrato para procesar pagos
 * 
 * Patrón Adapter: Permite cambiar entre diferentes proveedores de pago
 * (Mock, Stripe, PayPal, etc.) sin modificar el código del servicio
 */
export interface PaymentProvider {
  /**
   * Procesa un pago
   * @param amount Monto a pagar
   * @param currency Moneda (USD, EUR, etc.)
   * @param metadata Metadatos adicionales (userId, projectId, etc.)
   * @returns Información del pago procesado
   */
  processPayment(
    amount: number,
    currency: string,
    metadata: Record<string, any>,
  ): Promise<PaymentResult>;

  /**
   * Verifica el estado de un pago
   * @param paymentId ID del pago en el proveedor
   * @returns Estado actual del pago
   */
  verifyPayment(paymentId: string): Promise<PaymentStatus>;

  /**
   * Procesa un reembolso
   * @param paymentId ID del pago a reembolsar
   * @param amount Monto a reembolsar (opcional, si no se especifica reembolsa todo)
   * @returns Información del reembolso
   */
  refundPayment(paymentId: string, amount?: number): Promise<RefundResult>;
}

/**
 * Resultado de un pago procesado
 */
export interface PaymentResult {
  success: boolean;
  paymentId: string;
  providerPaymentId: string;
  status: 'pending' | 'completed' | 'failed';
  message?: string;
  metadata?: Record<string, any>;
}

/**
 * Estado de un pago
 */
export interface PaymentStatus {
  paymentId: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  amount: number;
  currency: string;
  metadata?: Record<string, any>;
}

/**
 * Resultado de un reembolso
 */
export interface RefundResult {
  success: boolean;
  refundId: string;
  amount: number;
  message?: string;
}
