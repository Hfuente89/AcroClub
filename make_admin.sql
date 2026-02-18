-- Ejecuta este script en Supabase SQL Editor para hacer admin a un usuario
-- Reemplaza 'tu-email@ejemplo.com' con el email del usuario que quieres hacer admin

UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'tu-email@ejemplo.com';

-- O si sabes el UUID del usuario:
-- UPDATE user_profiles SET role = 'admin' WHERE id = 'UUID-AQUI';

-- Para ver todos los usuarios y sus roles:
-- SELECT id, email, role, created_at FROM user_profiles ORDER BY created_at DESC;
