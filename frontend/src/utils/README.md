# Utils

Funciones **utilitarias** y **helpers** reutilizables.

---

## 📋 Propósito

- Centralizar funciones comunes
- Evitar duplicación de código
- Facilitar mantenimiento
- Separar lógica de UI

---

## 📁 Estructura

```
utils/
├── formatters.ts         # Formateo de datos (fechas, moneda, texto)
├── validators.ts         # Validaciones de formularios
├── constants.ts          # Constantes de la app
├── helpers.ts            # Funciones auxiliares
└── storage.ts            # Wrapper de localStorage
```

---

## 🔧 Formateadores

### `formatters.ts`

```typescript
// Formatear fechas
export const formatDate = (date: string | Date, format: 'short' | 'long' = 'short'): string => {
  const d = new Date(date);
  
  if (format === 'short') {
    return d.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
  
  return d.toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// Formatear moneda
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);
};

// Formatear teléfono
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

// Truncar texto
export const truncate = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Capitalizar primera letra
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Formatear nombre completo
export const formatFullName = (nombre: string, apellido: string): string => {
  return `${capitalize(nombre)} ${capitalize(apellido)}`;
};
```

### Uso

```tsx
const ProyectoCard = ({ proyecto }) => (
  <div>
    <p>{formatDate(proyecto.fecha_inicio)}</p>
    <p>{formatCurrency(proyecto.presupuesto)}</p>
    <p>{truncate(proyecto.descripcion, 150)}</p>
  </div>
);
```

---

## 🔧 Validadores

### `validators.ts`

```typescript
// Validar email
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validar teléfono (10 dígitos)
export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10;
};

// Validar contraseña fuerte
export const isStrongPassword = (password: string): boolean => {
  // Min 8 caracteres, 1 mayúscula, 1 minúscula, 1 número
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

// Validar RFC
export const isValidRFC = (rfc: string): boolean => {
  const regex = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;
  return regex.test(rfc.toUpperCase());
};

// Validar presupuesto
export const isValidBudget = (budget: number): boolean => {
  return budget > 0 && budget <= 10000000;
};

// Validar rango de calificación
export const isValidRating = (rating: number): boolean => {
  return rating >= 1 && rating <= 5;
};

// Validar archivo de imagen
export const isValidImageFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  return validTypes.includes(file.type) && file.size <= maxSize;
};
```

### Uso

```tsx
const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!isValidEmail(email)) {
      setError('Email inválido');
      return;
    }
    // continuar...
  };
};
```

---

## 🔧 Constantes

### `constants.ts`

```typescript
// Estados de proyecto
export const ESTADOS_PROYECTO = {
  BORRADOR: 'borrador',
  PUBLICADO: 'publicado',
  EN_PROGRESO: 'en_progreso',
  COMPLETADO: 'completado',
  CANCELADO: 'cancelado',
} as const;

// Labels de estados
export const ESTADO_LABELS: Record<string, string> = {
  borrador: 'Borrador',
  publicado: 'Publicado',
  en_progreso: 'En Progreso',
  completado: 'Completado',
  cancelado: 'Cancelado',
};

// Especialidades de arquitecto
export const ESPECIALIDADES = [
  'Residencial',
  'Comercial',
  'Industrial',
  'Urbanismo',
  'Paisajismo',
  'Interiores',
  'Sustentable',
] as const;

// Tipos de usuario
export const TIPOS_USUARIO = {
  ARQUITECTO: 'arquitecto',
  CLIENTE: 'cliente',
  MODERADOR: 'moderador',
} as const;

// Paginación
export const ITEMS_PER_PAGE = 20;

// Límites de archivos
export const FILE_LIMITS = {
  MAX_SIZE_MB: 5,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
} as const;

// Rutas de navegación
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/registro',
  DASHBOARD: '/dashboard',
  PROYECTOS: '/proyectos',
  PROYECTOS_DETAIL: (id: string) => `/proyectos/${id}`,
  ARQUITECTOS: '/arquitectos',
  CONVERSACIONES: '/conversaciones',
  PERFIL: '/perfil',
} as const;

// Mensajes de error
export const ERROR_MESSAGES = {
  NETWORK: 'Error de conexión. Verifica tu internet.',
  UNAUTHORIZED: 'No autorizado. Inicia sesión nuevamente.',
  SERVER: 'Error del servidor. Intenta más tarde.',
  NOT_FOUND: 'Recurso no encontrado.',
} as const;
```

### Uso

```tsx
import { ESTADOS_PROYECTO, ESTADO_LABELS } from '@/utils/constants';

const ProyectoCard = ({ proyecto }) => (
  <div>
    <span>{ESTADO_LABELS[proyecto.estado]}</span>
    {proyecto.estado === ESTADOS_PROYECTO.EN_PROGRESO && (
      <ProgressBar />
    )}
  </div>
);
```

---

## 🔧 Helpers

### `helpers.ts`

```typescript
// Agrupar array por clave
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const group = String(item[key]);
    result[group] = result[group] || [];
    result[group].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

// Ordenar array por propiedad
export const sortBy = <T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];
    
    if (valueA < valueB) return order === 'asc' ? -1 : 1;
    if (valueA > valueB) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

// Debounce
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Sleep
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Generar ID único
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Calcular porcentaje
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};
```

---

## 🔧 Storage

### `storage.ts`

```typescript
// Wrapper de localStorage con tipo seguro
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error al guardar en localStorage', error);
    }
  },

  remove: (key: string): void => {
    localStorage.removeItem(key);
  },

  clear: (): void => {
    localStorage.clear();
  },
};

// Claves de almacenamiento
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;
```

### Uso

```tsx
import { storage, STORAGE_KEYS } from '@/utils/storage';

// Guardar
storage.set(STORAGE_KEYS.THEME, 'dark');

// Leer
const theme = storage.get(STORAGE_KEYS.THEME, 'light');

// Eliminar
storage.remove(STORAGE_KEYS.THEME);
```

---

## 💡 Mejores Prácticas

1. **Funciones puras**: Las utilidades deben ser funciones puras (sin efectos secundarios)
2. **Tipado fuerte**: Usa TypeScript para tipar parámetros y retornos
3. **Nombres descriptivos**: Usa nombres claros (`formatDate` no `fd`)
4. **Documentación**: Agrega comentarios JSDoc
5. **Testing**: Las utilidades son fáciles de testear

---

## 📚 Recursos

- [JavaScript Date](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Date)
- [Intl API](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Intl)
