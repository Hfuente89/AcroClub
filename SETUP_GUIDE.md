# 🚀 Guía de Configuración Completa

## 📋 Pasos para configurar Supabase

### 1. Configurar la Base de Datos

1. Ve a tu proyecto en [Supabase](https://supabase.com)
2. Abre el **SQL Editor**
3. Copia y pega todo el contenido de `database_setup.sql`
4. Ejecuta el script (botón "Run" o Ctrl+Enter)

### 2. Crear Usuario Admin

Opción A - Desde Supabase UI:
1. Ve a **Authentication** → **Users**
2. Click en "Add user" → "Create new user"
3. Ingresa tu email y contraseña
4. Copia el UUID del usuario creado
5. Ve al **SQL Editor** y ejecuta:
```sql
UPDATE user_profiles 
SET role = 'admin' 
WHERE id = 'PEGA-EL-UUID-AQUI';
```

Opción B - Registro desde la app:
1. Regístrate desde la aplicación
2. En Supabase, ve al **SQL Editor** y ejecuta:
```sql
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'tu-email@ejemplo.com';
```

### 3. Configurar Variables de Entorno en GitHub

Para que funcione en GitHub Pages:

1. Ve a tu repositorio: https://github.com/Hfuente89/AcroClub
2. Settings → Secrets and variables → Actions
3. Click en "New repository secret"
4. Crea estos dos secrets:

**Secret 1:**
- Name: `VITE_SUPABASE_URL`
- Value: `https://ronurawncsuaqsehtrrn.supabase.co`

**Secret 2:**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvbnVyYXduY3N1YXFzZWh0cnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMjQyMjksImV4cCI6MjA4NjkwMDIyOX0.AH_8_QOlbQ9OUdEFm6gr1YR-3Pc-oIZhU_FDaYIPYGY`

### 4. Probar Localmente

```bash
npm run dev
```

La aplicación debería abrir en http://localhost:3000

### 5. Desplegar a GitHub Pages

Una vez configurados los secrets:

```bash
git add .
git commit -m "Update workflow with env vars"
git push origin main
```

El workflow automático desplegará la app en 2-3 minutos.

## ✅ Verificación

- [ ] Base de datos creada en Supabase
- [ ] Usuario admin creado
- [ ] Secrets configurados en GitHub
- [ ] App funciona localmente
- [ ] App desplegada en GitHub Pages

## 🔐 Credenciales de Prueba

Para probar que todo funciona:
- URL de Supabase: https://ronurawncsuaqsehtrrn.supabase.co
- Inicia sesión con tu usuario admin

## 🐛 Solución de Problemas

**Error: "Variables de entorno no configuradas"**
- Verifica que `.env.local` existe con las credenciales correctas
- Para producción, verifica que los secrets estén en GitHub

**No puedo logearme como admin**
- Verifica que ejecutaste el UPDATE para cambiar el rol
- Consulta la tabla: `SELECT * FROM user_profiles;`

**La página está en blanco en GitHub Pages**
- Espera 2-3 minutos después del push
- Verifica que los secrets estén configurados
- Revisa los Actions en GitHub: https://github.com/Hfuente89/AcroClub/actions
