# 🗄️ Configuración de la Base de Datos Supabase

## Tablas Necesarias

Ejecuta los siguientes scripts SQL en el Editor SQL de Supabase para crear la estructura de la aplicación.

### 1. Crear Tabla de Perfiles de Usuarios

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  role TEXT CHECK (role IN ('user', 'admin')) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para búsquedas rápidas
CREATE INDEX idx_user_profiles_role ON user_profiles(role);

-- Habilitar RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Política RLS para usuarios
CREATE POLICY "Users can read their own profile" 
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admin can read all profiles"
  ON user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 2. Crear Tabla de Talleres

```sql
CREATE TABLE workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices
CREATE INDEX idx_workshops_date ON workshops(date);
CREATE INDEX idx_workshops_created_at ON workshops(created_at DESC);

-- Habilitar RLS
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Anyone can view workshops"
  ON workshops FOR SELECT
  USING (true);

CREATE POLICY "Only admin can create workshops"
  ON workshops FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admin can update workshops"
  ON workshops FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admin can delete workshops"
  ON workshops FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 3. Crear Tabla de Entrenamientos

```sql
CREATE TABLE trainings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices
CREATE INDEX idx_trainings_date ON trainings(date);
CREATE INDEX idx_trainings_created_at ON trainings(created_at DESC);

-- Habilitar RLS
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Anyone can view trainings"
  ON trainings FOR SELECT
  USING (true);

CREATE POLICY "Only admin can create trainings"
  ON trainings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admin can delete trainings"
  ON trainings FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 4. Crear Tabla de Registros

```sql
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
  training_id UUID REFERENCES trainings(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  attended_before TEXT,
  level TEXT CHECK (level IN ('inicial', 'medio', 'avanzado')),
  form_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_workshop_or_training CHECK (
    (workshop_id IS NOT NULL AND training_id IS NULL) OR
    (workshop_id IS NULL AND training_id IS NOT NULL)
  )
);

-- Crear índices
CREATE INDEX idx_registrations_user_id ON registrations(user_id);
CREATE INDEX idx_registrations_workshop_id ON registrations(workshop_id);
CREATE INDEX idx_registrations_training_id ON registrations(training_id);
CREATE INDEX idx_registrations_created_at ON registrations(created_at DESC);

-- Habilitar RLS
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can read their own registrations"
  ON registrations FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admin can read all registrations"
  ON registrations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can create their own registrations"
  ON registrations FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own registrations"
  ON registrations FOR UPDATE
  USING (user_id = auth.uid());
```

### 5. Crear Tabla de Preguntas del Formulario

```sql
CREATE TABLE form_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  type TEXT CHECK (type IN ('text', 'email', 'tel', 'select', 'radio')) DEFAULT 'text',
  required BOOLEAN DEFAULT TRUE,
  options TEXT[],
  "order" INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice
CREATE INDEX idx_form_questions_order ON form_questions("order");

-- Habilitar RLS
ALTER TABLE form_questions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Anyone can view form questions"
  ON form_questions FOR SELECT
  USING (true);

CREATE POLICY "Only admin can update form questions"
  ON form_questions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insertar preguntas por defecto
INSERT INTO form_questions (label, type, required, "order") VALUES
('Nombre completo', 'text', TRUE, 1),
('Número de teléfono', 'tel', TRUE, 2),
('Email', 'email', TRUE, 3),
('¿Has asistido ya antes a un entrenamiento/taller con nosotros?', 'radio', TRUE, 4),
('Nivel personal', 'select', TRUE, 5)
ON CONFLICT DO NOTHING;

-- Actualizar opciones
UPDATE form_questions 
SET options = ARRAY['Sí', 'No', 'Primera vez']
WHERE label = '¿Has asistido ya antes a un entrenamiento/taller con nosotros?';

UPDATE form_questions 
SET options = ARRAY['Inicial', 'Medio', 'Avanzado']
WHERE label = 'Nivel personal';
```

## Configuración de Autenticación

1. Ve a **Supabase > Authentication > Settings**
2. Habilita **Email/Password**
3. Configura:
   - Habilitar confirmación de email (opcional)
   - URL de redirección después del login
   - SMTP para emails

## Crear Usuario Admin Inicial

```sql
-- Este script debe ejecutarse DESPUÉS de crear un usuario en la auth
-- Reemplaza 'tu-uuid' con el ID real del usuario
INSERT INTO user_profiles (id, email, role) 
VALUES ('tu-uuid', 'admin@acroyoga.club', 'admin')
ON CONFLICT (id) DO UPDATE 
SET role = 'admin';
```

## Verificar Datos

```sql
-- Ver todos los usuarios
SELECT * FROM user_profiles;

-- Ver talleres próximos
SELECT * FROM workshops 
WHERE date > NOW()
ORDER BY date;

-- Ver registros de un taller
SELECT user_id, full_name, email, level, created_at 
FROM registrations 
WHERE workshop_id = 'workshop-uuid'
ORDER BY created_at;

-- Contar registros por evento
SELECT 
  workshop_id,
  COUNT(*) as total_registrations
FROM registrations 
WHERE workshop_id IS NOT NULL
GROUP BY workshop_id;
```

## Notas Importantes

- **RLS (Row Level Security)**: Está habilitado para todas las tablas. Los datos se filtran automáticamente según el usuario autenticado.
- **Backups**: Supabase realiza backups automáticos. Puedes configurar backups adicionales en Settings.
- **Storage**: Si necesitas almacenar fotos o documentos, usa Supabase Storage.
- **Monitoring**: Usa el SQL Editor para monitorear las bases de datos en tiempo real.
