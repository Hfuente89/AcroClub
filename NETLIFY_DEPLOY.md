# 🚀 Guía de Deployment en Netlify

## Paso 1: Preparar el Repositorio en GitHub

### Crear repositorio
```bash
git init
git add .
git commit -m "🎉 Initial commit: Acroyoga Club PWA"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/acroyoga-club.git
git push -u origin main
```

## Paso 2: Configurar Netlify

### Opción A: Conectar directamente desde GitHub (Recomendado)

1. Crea cuenta en [netlify.com](https://www.netlify.com) si no tienes
2. Haz clic en "New site from Git"
3. Selecciona GitHub y autoriza el acceso
4. Busca el repositorio `acroyoga-club`
5. Acepta las configuraciones por defecto (Netlify lo detectará automáticamente)

### Opción B: Importar repositorio existente

1. Ve a [netlify.com/import](https://app.netlify.com/start)
2. Pega tu URL de GitHub
3. Sigue el wizard

## Paso 3: Configurar Variables de Entorno

En el dashboard de Netlify:

1. Ve a **Site settings > Environment**
2. Click en **Edit variables**
3. Añade:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. Click en **Save**

## Paso 4: Verificar Build

1. Ve a **Deployments**
2. Haz click en el último deployment
3. Verifica que el build fue exitoso:
   - `npm install` ✅
   - `npm run build` ✅
   - `vite build` ✅

## Paso 5: Configurar Dominio

### Dominio Gratis de Netlify
Tu sitio estará disponible en: `https://your-site.netlify.app`

### Dominio Personalizado

1. Ve a **Site settings > Domain management**
2. Click en **Custom domains**
3. Añade tu dominio
4. Sigue las instrucciones para configurar DNS

Si compras el dominio en Netlify:
- Vaya a **Domain management**
- Click en **Register new domain**
- Sigue el proceso

## Paso 6: SSL/HTTPS

✅ SSL se configura automáticamente con **Let's Encrypt**

## Configuración de netlify.toml (Opcional)

Crea un archivo `netlify.toml` en la raíz del proyecto para control adicional:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

## Paso 7: Verificar PWA en Producción

1. Abre tu sitio en el navegador
2. Abre Chrome DevTools (F12)
3. Ve a **Lighthouse**
4. Ejecuta auditoría para PWA
5. Debería tener puntuación ~90+

## Configurar Subdominio para API (Opcional)

Si necesitas un servidor serverless personalizado:

1. Ve a **Functions** en Netlify
2. Crea funciones serverless en `/netlify/functions/`
3. Netlify las desplegará automáticamente en `/.netlify/functions/nombre`

Ejemplo:
```javascript
// netlify/functions/email.js
exports.handler = async (event) => {
  // Tu código serverless
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Success' })
  }
}
```

## Ciclo de Desarrollo

### Workflow Recomendado:

```bash
# 1. Hacer cambios locales
# git add .
# git commit -m "feat: descripción del cambio"

# 2. Push a GitHub
# git push origin main

# 3. Netlify desplegará automáticamente
# 4. Verifica en https://your-site.netlify.app
```

## Debugging en Producción

1. **Build fails**: Ve a Deployments > build log
2. **Errores en consola**: Abre DevTools en el navegador
3. **Monitorar performance**: Usa https://web.dev/measure/

## Rollback a Versión Anterior

1. Ve a **Deployments**
2. Busca el deployment anterior exitoso
3. Click en los 3 puntos → **Publish deploy**

## Monitoreo

### Configurar Alertas de Build Fallido

1. Ve a **Notifications**
2. Configura notificaciones por email para builds fallidos

### Analytics

Ve a **Analytics** para ver:
- Visitantes únicos
- Páginas más vistas
- Dispositivos usados

## Troubleshooting

### Error: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build timeout
Aumenta el límite en **Site settings > General > Build timeout**

### Variabales de entorno no funcionan
- Verifica que están configuradas exactamente igual al `.env.example`
- Reconstruye el sitio después de cambiar variables

## Comandos Útiles de Deploy

```bash
# Ver estado actual
netlify status

# Deploy manual
netlify deploy --prod

# Abrir dashboard
netlify open:admin
```

## Seguridad

✅ HTTPS automático  
✅ DDoS protection  
✅ WAF (Web Application Firewall)  
✅ Backups automáticos de Supabase

---

¡Tu app estará en vivo en minutos! 🚀
