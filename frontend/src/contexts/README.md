# Contexts

**Context API** de React para gestión de estado global.

---

## 📋 Propósito

- Compartir estado entre componentes
- Evitar prop drilling (pasar props por muchos niveles)
- Centralizar lógica de negocio
- Gestionar estado de autenticación, tema, notificaciones, etc.

---

## 📁 Estructura

```
contexts/
├── AuthContext.tsx          # Autenticación y usuario
├── ThemeContext.tsx         # Tema (light/dark)
├── NotificationContext.tsx  # Sistema de notificaciones
└── ProyectoContext.tsx      # Estado compartido de proyecto (opcional)
```

---

## 🔧 AuthContext

Context para gestionar autenticación y usuario actual.

### `AuthContext.tsx`

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/api/authService';
import type { Usuario } from '@/types/usuario.types';

interface AuthContextType {
  usuario: Usuario | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario al montar
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      authService.getCurrentUser()
        .then(setUsuario)
        .catch(() => localStorage.removeItem('authToken'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const user = await authService.login(email, password);
    setUsuario(user);
  };

  const logout = async () => {
    await authService.logout();
    setUsuario(null);
  };

  const register = async (data: any) => {
    const user = await authService.register(data);
    setUsuario(user);
  };

  const value = {
    usuario,
    loading,
    isAuthenticated: !!usuario,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
```

### Configurar en App

```tsx
// main.tsx o App.tsx
import { AuthProvider } from '@/contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
```

### Uso en Componentes

```tsx
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const { usuario, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Link to="/login">Iniciar Sesión</Link>;
  }

  return (
    <div>
      <span>Hola, {usuario?.nombre}</span>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
};
```

---

## 🔧 ThemeContext

Context para gestionar tema claro/oscuro.

### `ThemeContext.tsx`

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme;
    return saved || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
};
```

### Uso

```tsx
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      {theme === 'light' ? '🌙 Oscuro' : '☀️ Claro'}
    </button>
  );
};
```

---

## 🔧 NotificationContext

Context para mostrar notificaciones/toasts.

### `NotificationContext.tsx`

```typescript
import React, { createContext, useContext, useState } from 'react';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (message: string, type: Notification['type']) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (message: string, type: Notification['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, message, type }]);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, removeNotification }}>
      {children}
      <NotificationList notifications={notifications} onRemove={removeNotification} />
    </NotificationContext.Provider>
  );
};

// Componente de lista de notificaciones
const NotificationList: React.FC<{
  notifications: Notification[];
  onRemove: (id: string) => void;
}> = ({ notifications, onRemove }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`
            p-4 rounded shadow-lg flex justify-between items-center
            ${notif.type === 'success' ? 'bg-green-500' : ''}
            ${notif.type === 'error' ? 'bg-red-500' : ''}
            ${notif.type === 'info' ? 'bg-blue-500' : ''}
            ${notif.type === 'warning' ? 'bg-yellow-500' : ''}
            text-white
          `}
        >
          <span>{notif.message}</span>
          <button onClick={() => onRemove(notif.id)} className="ml-4 font-bold">
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification debe usarse dentro de NotificationProvider');
  }
  return context;
};
```

### Uso

```tsx
import { useNotification } from '@/contexts/NotificationContext';

const ProyectoForm = () => {
  const { showNotification } = useNotification();

  const handleSubmit = async () => {
    try {
      await proyectosService.create(data);
      showNotification('Proyecto creado exitosamente', 'success');
    } catch (error) {
      showNotification('Error al crear proyecto', 'error');
    }
  };
};
```

---

## 🔧 Combinar Múltiples Contexts

### `providers.tsx`

```tsx
import React from 'react';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import { NotificationProvider } from './NotificationContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
```

### Uso en App

```tsx
import { AppProviders } from '@/contexts/providers';

function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}
```

---

## 💡 Mejores Prácticas

### 1. **Un Context por responsabilidad**
No mezcles autenticación con tema en un solo context.

### 2. **Custom hook para cada context**
Siempre exporta un hook `useContext` personalizado.

```tsx
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('...');
  return context;
};
```

### 3. **Evitar re-renders innecesarios**
Si el context tiene múltiples valores, considera dividirlo.

```tsx
// ❌ MAL - Todo se re-renderiza si cambia theme
const value = { usuario, theme, setTheme, login };

// ✅ BIEN - Contexts separados
<AuthContext.Provider value={{ usuario, login }}>
  <ThemeContext.Provider value={{ theme, setTheme }}>
```

### 4. **No abuses de Context**
Para estado local de componente, usa `useState`.
Para estado global simple, usa Context.
Para estado complejo, considera Zustand o Redux.

---

## 📚 Recursos

- [React Context](https://react.dev/reference/react/useContext)
- [Context Best Practices](https://kentcdodds.com/blog/how-to-use-react-context-effectively)
- [Zustand](https://github.com/pmndrs/zustand) (alternativa a Context)
