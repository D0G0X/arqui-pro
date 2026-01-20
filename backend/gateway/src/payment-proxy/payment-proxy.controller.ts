import { Controller, All, Req, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Controller('payments')
export class PaymentProxyController {
  private readonly paymentServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.paymentServiceUrl = this.configService.get<string>(
      'PAYMENT_SERVICE_URL',
      'http://localhost:4002',
    );
  }

  @All('*')
  async proxyPayment(@Req() req: Request, @Res() res: Response) {
    const path = req.params[0] || '';
    const url = `${this.paymentServiceUrl}/payments/${path}`;

    console.log(`[Gateway] 🔄 Proxying ${req.method} ${req.url} -> ${url}`);

    // Filter out headers that can cause issues when proxying
    const headers = { ...req.headers };
    delete headers.host;
    delete headers['content-length'];

    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method: req.method,
          url,
          data: req.body,
          headers,
        }),
      );

      console.log(`[Gateway] ✅ Response from Payment Service: ${response.status}`);
      return res.status(response.status).json(response.data);
    } catch (error) {
      console.error(`[Gateway] ❌ Error proxying to Payment Service: ${error.message}`);
      if (error.response) {
        console.error(
          `[Gateway] ❌ Payment Service Response: ${JSON.stringify(error.response.data)}`,
        );
        return res.status(error.response.status).json(error.response.data);
      }
      return res
        .status(500)
        .json({
          message: 'Error de conexión con el servicio de pagos',
          error: error.message,
        });
    }
  }
}
