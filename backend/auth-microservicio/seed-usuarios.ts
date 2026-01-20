import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './src/entities/usuario.entity';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'auth_db',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  synchronize: false,
  logging: false,
  entities: ['src/entities/*.ts'],
  migrations: ['src/migrations/*.ts'],
});

async function runSeed() {
  try {
    await AppDataSource.initialize();
    const usuarioRepository = AppDataSource.getRepository(Usuario);

    // Hash password "123456" con bcrypt (10 rounds)
    const hashedPassword = await bcrypt.hash('123456', 10);

    const usuarios = [
      // ===== 5 CLIENTES =====
      {
        nombre: 'Juan',
        apellido: 'García',
        email: 'juan@gmail.com',
        encrypted_password: hashedPassword,
        rol: 'cliente',
        estado_cuenta: 'activo',
        foto_perfil: null,
      },
      {
        nombre: 'María',
        apellido: 'López',
        email: 'maria@gmail.com',
        encrypted_password: hashedPassword,
        rol: 'cliente',
        estado_cuenta: 'activo',
        foto_perfil: null,
      },
      {
        nombre: 'Carlos',
        apellido: 'Rodríguez',
        email: 'carlos@gmail.com',
        encrypted_password: hashedPassword,
        rol: 'cliente',
        estado_cuenta: 'activo',
        foto_perfil: null,
      },
      {
        nombre: 'Ana',
        apellido: 'Martínez',
        email: 'ana@gmail.com',
        encrypted_password: hashedPassword,
        rol: 'cliente',
        estado_cuenta: 'activo',
        foto_perfil: null,
      },
      {
        nombre: 'Pedro',
        apellido: 'Fernández',
        email: 'pedro@gmail.com',
        encrypted_password: hashedPassword,
        rol: 'cliente',
        estado_cuenta: 'activo',
        foto_perfil: null,
      },

      // ===== 10 ARQUITECTOS =====
      {
        nombre: 'Luis',
        apellido: 'Sánchez',
        email: 'luis@gmail.com',
        encrypted_password: hashedPassword,
        rol: 'arquitecto',
        estado_cuenta: 'activo',
        foto_perfil: null,
      },
      {
        nombre: 'Sofía',
        apellido: 'Díaz',
        email: 'sofia@gmail.com',
        encrypted_password: hashedPassword,
        rol: 'arquitecto',
        estado_cuenta: 'activo',
        foto_perfil: null,
      },
      {
        nombre: 'Diego',
        apellido: 'Morales',
        email: 'diego@gmail.com',
        encrypted_password: hashedPassword,
        rol: 'arquitecto',
        estado_cuenta: 'activo',
        foto_perfil: null,
      },
      {
        nombre: 'Valentina',
        apellido: 'Torres',
        email: 'valentina@gmail.com',
        encrypted_password: hashedPassword,
        rol: 'arquitecto',
        estado_cuenta: 'activo',
        foto_perfil: null,
      },
      {
        nombre: 'Fernando',
        apellido: 'Ruiz',
        email: 'fernando@gmail.com',
        encrypted_password: hashedPassword,
        rol: 'arquitecto',
        estado_cuenta: 'activo',
        foto_perfil: null,
      },
      {
        nombre: 'Isabel',
        apellido: 'Vargas',
        email: 'isabel@gmail.com',
        encrypted_password: hashedPassword,
        rol: 'arquitecto',
        estado_cuenta: 'activo',
        foto_perfil: null,
      },
      {
        nombre: 'Andrés',
        apellido: 'Castro',
        email: 'andres@gmail.com',
        encrypted_password: hashedPassword,
        rol: 'arquitecto',
        estado_cuenta: 'activo',
        foto_perfil: null,
      },
      {
        nombre: 'Gabriela',
        apellido: 'Reyes',
        email: 'gabriela@gmail.com',
        encrypted_password: hashedPassword,
        rol: 'arquitecto',
        estado_cuenta: 'activo',
        foto_perfil: null,
      },
      {
        nombre: 'Raúl',
        apellido: 'Guerrero',
        email: 'raul@gmail.com',
        encrypted_password: hashedPassword,
        rol: 'arquitecto',
        estado_cuenta: 'activo',
        foto_perfil: null,
      },
      {
        nombre: 'Catalina',
        apellido: 'Mendoza',
        email: 'catalina@gmail.com',
        encrypted_password: hashedPassword,
        rol: 'arquitecto',
        estado_cuenta: 'activo',
        foto_perfil: null,
      },

      // ===== 5 MODERADORES =====
      {
        nombre: 'Roberto',
        apellido: 'Silva',
        email: 'roberto@gmail.com',
        encrypted_password: hashedPassword,
        rol: 'moderador',
        estado_cuenta: 'activo',
        foto_perfil: null,
      },
      {
        nombre: 'Patricia',
        apellido: 'Guzmán',
        email: 'patricia@gmail.com',
        encrypted_password: hashedPassword,
        rol: 'moderador',
        estado_cuenta: 'activo',
        foto_perfil: null,
      },
      {
        nombre: 'Javier',
        apellido: 'Flores',
        email: 'javier@gmail.com',
        encrypted_password: hashedPassword,
        rol: 'moderador',
        estado_cuenta: 'activo',
        foto_perfil: null,
      },
      {
        nombre: 'Marta',
        apellido: 'Jiménez',
        email: 'marta@gmail.com',
        encrypted_password: hashedPassword,
        rol: 'moderador',
        estado_cuenta: 'activo',
        foto_perfil: null,
      },
      {
        nombre: 'Francisco',
        apellido: 'Herrera',
        email: 'francisco@gmail.com',
        encrypted_password: hashedPassword,
        rol: 'moderador',
        estado_cuenta: 'activo',
        foto_perfil: null,
      },
    ];

    console.log('\n========== CREANDO USUARIOS EN AUTH-MICROSERVICIO ==========\n');

    for (const usuarioData of usuarios) {
      const existingUser = await usuarioRepository.findOne({
        where: { email: usuarioData.email },
      });

      if (!existingUser) {
        const usuario = usuarioRepository.create(usuarioData);
        await usuarioRepository.save(usuario);
        console.log(`✓ Usuario creado: ${usuarioData.email} (${usuarioData.rol})`);
      } else {
        console.log(`⚠ Usuario ya existe: ${usuarioData.email}`);
      }
    }

    console.log('\n========== SEED COMPLETADA EXITOSAMENTE ==========\n');

    process.exit(0);
  } catch (error) {
    console.error('Error al ejecutar seed:', error);
    process.exit(1);
  }
}

runSeed();
