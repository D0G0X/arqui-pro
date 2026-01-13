import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Usuario } from '../entities/usuario.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { RevokedToken } from '../entities/revoked-token.entity';

@Module({
    imports: [
        ConfigModule,
        PassportModule,
        JwtModule.register({}), // We'll configure JWT dynamically in the service
        TypeOrmModule.forFeature([Usuario, RefreshToken, RevokedToken]),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule { }
