import {
    IsString,
    IsNotEmpty,
    IsEmail,
    MinLength,
    IsEnum,
    IsOptional,
} from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    apellido: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    password: string;

    @IsEnum(['cliente', 'arquitecto', 'moderador'], {
        message: 'El rol debe ser cliente, arquitecto o moderador',
    })
    rol: string;

    @IsOptional()
    @IsString()
    foto_perfil?: string;
}
