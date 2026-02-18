# 🤸‍♀️ Acroyoga Club PWA

Una aplicación moderna, limpia y ágil para gestionar talleres y entrenamientos de Acroyoga.

## Características

✅ **Autenticación segura** con email/contraseña mediante Supabase  
✅ **Sesión persistente** - sin necesidad de re-login constantemente  
✅ **Modo invitado** - acceso limitado sin autenticación  
✅ **Gestión de talleres** - título, descripción y fechas  
✅ **Entrenamientos** - sesiones sin descripción, solo fecha  
✅ **Formulario de registro dinámico** - personalizable desde admin  
✅ **Panel de administración** - crear y gestionar talleres  
✅ **PWA** - funciona offline y se puede instalar como app  
✅ **Responsive** - optimizado para móvil  

## Stack Tecnológico

- **Frontend**: React, TypeScript, Vite
- **Backend/Database**: Supabase
- **Hosting**: Netlify
- **Styles**: CSS Modular

## Instalación

### 1. Configurar Supabase

1. Crea una cuenta en [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Obtén tu `SUPABASE_URL` y `SUPABASE_ANON_KEY`
4. Copia `.env.example` a `.env.local` y completa las variables

### 2. Crear tablas en Supabase

Ejecuta las siguientes queries en el Editor SQL de Supabase:

```sql
-- Tabla de usuarios (Supabase auth maneja esto, pero aquí el perfil)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de talleres
CREATE TABLE workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de entrenamientos
CREATE TABLE trainings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de registros
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  workshop_id UUID,
  training_id UUID,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  attended_before TEXT,
  level TEXT,
  form_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de preguntas del formulario
CREATE TABLE form_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  type TEXT DEFAULT 'text',
  required BOOLEAN DEFAULT FALSE,
  options TEXT[],
  order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insertar preguntas por defecto
INSERT INTO form_questions (label, type, required, options, order) VALUES
('Nombre completo', 'text', TRUE, NULL, 1),
('Número de teléfono', 'tel', TRUE, NULL, 2),
('Email', 'email', TRUE, NULL, 3),
('¿Has asistido ya antes a un entrenamiento/taller con nosotros?', 'radio', TRUE, ARRAY['Sí', 'No', 'Primera vez'], 4),
('Nivel personal', 'select', TRUE, ARRAY['Inicial', 'Medio', 'Avanzado'], 5);
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Navigation.tsx
│   ├── WorkshopCard.tsx
│   └── RegistrationForm.tsx
├── pages/              # Páginas principales
│   ├── LoginPage.tsx
│   ├── WorkshopsPage.tsx
│   └── AdminPanel.tsx
├── lib/                # Utilidades
│   └── supabaseClient.ts
├── context/            # React Context
│   └── AuthContext.ts
├── App.tsx             # Componente raíz
└── index.css           # Estilos globales
```

## Deployment en Netlify

### 1. Crear repositorio en GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/tu-usuario/acroyoga-club.git
git push -u origin main
```

### 2. Conectar a Netlify

1. Ve a [netlify.com](https://netlify.com)
2. Importa tu repositorio de GitHub
3. Configura las variables de entorno en Netlify:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy automático desde cualquier push a `main`

## Roles de Usuario

- **Invitado**: Puede ver talleres y entrenamientos, pero no puede registrarse ni ver otros usuarios
- **Usuario**: Puede registrarse a talleres, ver su perfil y otros usuarios registrados
- **Admin**: Acceso completo al panel de administración

## Variables de Entorno

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## PWA

La aplicación está configurada para funcionar como PWA. Los usuarios pueden:
- Instalar la app en su móvil
- Usar la app offline
- Recibir notificaciones

## Desarrollo Futuro

- [ ] Implementar notificaciones push
- [ ] Agregar recordatorios por email
- [ ] Sistema de comentarios en talleres
- [ ] Galería de fotos de eventos
- [ ] Integración con Google Calendar
- [ ] Sistema de calificaciones

## Licencia

MIT
