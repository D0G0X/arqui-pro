import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { Usuario } from './entities/usuario.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { RevokedToken } from './entities/revoked-token.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('DB_HOST')?.trim(),
                port: parseInt(configService.get<string>('DB_PORT') || '6543', 10),
                username: configService.get<string>('DB_USER')?.trim(),
                password: configService.get<string>('DB_PASS')?.trim(),
                database: configService.get<string>('DB_NAME')?.trim(),
                entities: [Usuario, RefreshToken, RevokedToken],
                synchronize: true, // Set to false in production and use migrations
                ssl: configService.get<string>('DB_SSL') === 'true' ? {
                    rejectUnauthorized: false, // Supabase requires SSL
                } : false,
            }),
            inject: [ConfigService],
        }),
        ThrottlerModule.forRoot([
            {
                ttl: 60000, // 1 minute
                limit: 10, // 10 requests per minute (global)
            },
        ]),
        AuthModule,
    ],
})
export class AppModule { }
