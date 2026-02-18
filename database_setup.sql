-- ==========================================
-- CONFIGURACIÓN COMPLETA DE BASE DE DATOS
-- Ejecuta este script en Supabase SQL Editor
-- ==========================================

-- 1. TABLA DE PERFILES DE USUARIOS
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  role TEXT CHECK (role IN ('socio', 'admin', 'guest')) DEFAULT 'socio',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Habilitar RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para usuarios
DROP POLICY IF EXISTS "Users can read their own profile" ON user_profiles;
CREATE POLICY "Users can read their own profile" 
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admin can read all profiles" ON user_profiles;
CREATE POLICY "Admin can read all profiles"
  ON user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 2. TABLA DE TALLERES
CREATE TABLE IF NOT EXISTS workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  max_participants INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_workshops_date ON workshops(date);

-- RLS para workshops
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can read workshops" ON workshops;
CREATE POLICY "Everyone can read workshops"
  ON workshops FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admin can manage workshops" ON workshops;
CREATE POLICY "Admin can manage workshops"
  ON workshops FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 3. TABLA DE ENTRENAMIENTOS
CREATE TABLE IF NOT EXISTS trainings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_trainings_date ON trainings(date);

-- RLS para trainings
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can read trainings" ON trainings;
CREATE POLICY "Everyone can read trainings"
  ON trainings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admin can manage trainings" ON trainings;
CREATE POLICY "Admin can manage trainings"
  ON trainings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 4. TABLA DE INSCRIPCIONES
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
  registration_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, workshop_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_registrations_user ON registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_workshop ON registrations(workshop_id);

-- RLS para registrations
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own registrations" ON registrations;
CREATE POLICY "Users can read own registrations"
  ON registrations FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admin can read all registrations" ON registrations;
CREATE POLICY "Admin can read all registrations"
  ON registrations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users can create own registrations" ON registrations;
CREATE POLICY "Users can create own registrations"
  ON registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 5. TABLA DE PREGUNTAS DEL FORMULARIO
CREATE TABLE IF NOT EXISTS form_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  type TEXT CHECK (type IN ('text', 'select', 'checkbox', 'date')) NOT NULL,
  options JSONB,
  required BOOLEAN DEFAULT false,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_form_questions_order ON form_questions("order");

-- RLS para form_questions
ALTER TABLE form_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can read form questions" ON form_questions;
CREATE POLICY "Everyone can read form questions"
  ON form_questions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admin can manage form questions" ON form_questions;
CREATE POLICY "Admin can manage form questions"
  ON form_questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 6. FUNCIÓN PARA CREAR PERFIL AUTOMÁTICAMENTE
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'socio');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. DATOS DE EJEMPLO
-- Preguntas del formulario
INSERT INTO form_questions (question, type, required, "order") VALUES
  ('Nombre completo', 'text', true, 1),
  ('Teléfono de contacto', 'text', true, 2),
  ('¿Has practicado Acroyoga antes?', 'select', true, 3),
  ('¿Tienes alguna lesión o condición médica?', 'text', false, 4)
ON CONFLICT DO NOTHING;

-- ==========================================
-- INSTRUCCIONES PARA CREAR USUARIO ADMIN
-- ==========================================
-- 1. Ve a Authentication > Users en Supabase
-- 2. Crea un nuevo usuario con tu email y contraseña
-- 3. Copia el UUID del usuario
-- 4. Ejecuta el siguiente comando reemplazando 'TU-UUID-AQUI':

-- UPDATE user_profiles 
-- SET role = 'admin' 
-- WHERE id = 'TU-UUID-AQUI';

-- O puedes usar este script después de crear el usuario:
-- INSERT INTO user_profiles (id, email, role)
-- VALUES ('TU-UUID-AQUI', 'tu-email@ejemplo.com', 'admin')
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';
