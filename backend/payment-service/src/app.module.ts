import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { PaymentModule } from './payment/payment.module';
import { PartnerModule } from './partner/partner.module';
import { WebhookModule } from './webhook/webhook.module';
import { Partner } from './entities/partner.entity';
import { Payment } from './entities/payment.entity';
import { WebhookEvent } from './entities/webhook-event.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        // Opción 1: Base de datos propia (recomendado para producción)
        // Usa PAYMENT_DB_* si está configurado, sino usa DB_* (compartida)
        const dbHost = configService.get<string>('PAYMENT_DB_HOST')?.trim() 
          || configService.get<string>('DB_HOST')?.trim();
        const dbPort = configService.get<string>('PAYMENT_DB_PORT')?.trim()
          || configService.get<string>('DB_PORT') || '5432';
        const dbUser = configService.get<string>('PAYMENT_DB_USER')?.trim()
          || configService.get<string>('DB_USER')?.trim();
        const dbPass = configService.get<string>('PAYMENT_DB_PASS')?.trim()
          || configService.get<string>('DB_PASS')?.trim();
        const dbName = configService.get<string>('PAYMENT_DB_NAME')?.trim()
          || configService.get<string>('DB_NAME')?.trim();

        // Validar variables requeridas
        const missingVars: string[] = [];
        if (!dbHost) missingVars.push('DB_HOST o PAYMENT_DB_HOST');
        if (!dbUser) missingVars.push('DB_USER o PAYMENT_DB_USER');
        if (!dbPass) missingVars.push('DB_PASS o PAYMENT_DB_PASS');
        if (!dbName) missingVars.push('DB_NAME o PAYMENT_DB_NAME');

        if (missingVars.length > 0) {
          console.error('[ERROR] Faltan variables de entorno requeridas para la base de datos:');
          missingVars.forEach(v => console.error(`  - ${v}`));
        }

        // Detectar si está usando BD propia o compartida
        const isOwnDatabase = !!configService.get<string>('PAYMENT_DB_NAME');
        if (isOwnDatabase) {
          console.log('[Payment Service] ✅ Usando base de datos propia (PAYMENT_DB_*)');
        } else {
          console.log('[Payment Service] ⚠️  Usando base de datos compartida (DB_*)');
        }

        return {
          type: 'postgres',
          host: dbHost,
          port: parseInt(dbPort, 10),
          username: dbUser,
          password: dbPass,
          database: dbName,
          entities: [Partner, Payment, WebhookEvent],
          synchronize: true, // Set to false in production and use migrations
          ssl: configService.get<string>('PAYMENT_DB_SSL') === 'true' 
            || configService.get<string>('DB_SSL') === 'true' ? {
            rejectUnauthorized: false,
          } : false,
        };
      },
      inject: [ConfigService],
    }),
    HttpModule,
    PaymentModule,
    PartnerModule,
    WebhookModule,
  ],
})
export class AppModule { }
