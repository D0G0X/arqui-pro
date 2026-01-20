import { hash } from 'bcrypt';
import { DataSource } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';

export async function seedUsuarios(dataSource: DataSource) {
  const usuarioRepository = dataSource.getRepository(Usuario);

  // Hash password "123456" con bcrypt
  const hashedPassword = await hash('123456', 10);

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

  console.log('Creando usuarios en auth-microservicio...');

  for (const usuarioData of usuarios) {
    const existingUser = await usuarioRepository.findOne({
      where: { email: usuarioData.email },
    });

    if (!existingUser) {
      await usuarioRepository.save(usuarioRepository.create(usuarioData));
      console.log(`✓ Usuario creado: ${usuarioData.email}`);
    } else {
      console.log(`⚠ Usuario ya existe: ${usuarioData.email}`);
    }
  }

  console.log('Usuarios creados correctamente.');
}
