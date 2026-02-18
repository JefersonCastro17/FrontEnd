# Mercapleno React Vite - Auth Module

Este README explica, paso por paso, que hace cada archivo del modulo de autenticacion en la nueva arquitectura.

## Estructura (auth)

```text
app/
  App.jsx
  providers.jsx
  root.jsx
  components/
    auth/
      AuthShell.jsx
      AuthFeedback.jsx
  contexts/
    authContextInstance.js
    AuthContext.jsx
    useAuthContext.js
  lib/
    config/
      env.js
    api/
      httpClient.js
    services/
      authService.js
    utils/
      authUtils.js
    hooks/
      useLoginForm.js
      useRegisterForm.js
  routes/
    Login.jsx
    Registro.jsx
    Verificar.jsx
    Recuperar.jsx
.env.example
src/
  main.jsx
```

## Flujo general (resumen)

1. `src/main.jsx` monta `Root`.
2. `app/root.jsx` envuelve la app con `Providers`.
3. `app/providers.jsx` aplica `BrowserRouter` y `AuthProvider`.
4. `app/App.jsx` define rutas publicas/protegidas.
5. Las pantallas (`routes/*`) usan hooks (`lib/hooks/*`) y services (`lib/services/*`).
6. Los services llaman al cliente HTTP (`lib/api/httpClient.js`).
7. `httpClient` usa `VITE_API_URL` de `env.js` para construir URLs al backend.

---

## Archivo por archivo

## `.env.example`
- Define la variable de entorno base:
  - `VITE_API_URL=http://localhost:4000`
- Se copia a `.env` para configurar backend por ambiente.

## `app/lib/config/env.js`
- Centraliza configuracion.
- Lee `import.meta.env.VITE_API_URL`.
- Define `API_BASE_URL` limpio (sin slash final).
- Define endpoints auth en `AUTH_ENDPOINTS`.
- Define codigos de seguridad por rol (`ROLE_SECURITY_CODES`).

## `app/lib/api/httpClient.js`
- Capa HTTP generica para `POST` JSON.
- `buildUrl(path)` combina `API_BASE_URL + endpoint`.
- `parseJsonSafely` evita crash si respuesta no es JSON.
- `postJson`:
  1. hace `fetch`
  2. parsea respuesta
  3. si falla, lanza `ApiError` con `status` y `data`
  4. si ok, retorna JSON.

## `app/lib/services/authService.js`
- Capa de negocio de auth (sin UI).
- Expone funciones:
  - `login`
  - `register`
  - `verifyEmail`
  - `resendVerification`
  - `requestPasswordReset`
  - `resetPassword`
- Cada funcion usa `postJson` y el endpoint correcto.

## `app/lib/utils/authUtils.js`
- Utilidades puras:
  - `getHomeRouteByRole`: decide ruta post-login.
  - `getRoleSecurityCode`: codigo requerido por rol.
  - `calculateAge`: calcula edad desde fecha.
  - `validateRegistrationForm`: valida formulario de registro.
  - `createRegisterPayload`: asegura `id_rol=3`.

## `app/lib/hooks/useLoginForm.js`
- Encapsula toda la logica pesada de `Login`.
- Maneja estado de formulario y loading.
- Flujo:
  1. envia email/password al backend
  2. si rol requiere codigo, activa paso de seguridad
  3. valida codigo local
  4. ejecuta `login` en contexto
  5. navega a ruta segun rol.
- Maneja errores con mensajes consistentes.

## `app/lib/hooks/useRegisterForm.js`
- Encapsula logica pesada de `Registro`.
- Flujo:
  1. valida campos con `validateRegistrationForm`
  2. construye payload
  3. llama `authService.register`
  4. muestra feedback
  5. redirige a `/verificar` con email.

## `app/components/auth/AuthShell.jsx`
- Layout reutilizable para pantallas auth.
- Renderiza:
  - header con logo
  - navegacion configurable (`navLinks`)
  - contenedor de formulario.
- Evita duplicacion entre Login/Registro/Verificar/Recuperar.

## `app/components/auth/AuthFeedback.jsx`
- Componente reutilizable de mensajes.
- Recibe `feedback` con `{ type, message }`.
- Renderiza estilos `success/error` en un solo lugar.

## `app/contexts/authContextInstance.js`
- Exporta la instancia `AuthContext`.
- Se separa para cumplir regla de Fast Refresh/ESLint.

## `app/contexts/AuthContext.jsx`
- Proveedor de sesion.
- Responsabilidades:
  1. leer sesion inicial de `localStorage`
  2. guardar sesion en `login`
  3. limpiar sesion en `logout`
  4. exponer helpers (`getUserId`, `getUserEmail`, `getUserName`)
  5. exponer `isAuthenticated`.
- Usa `useMemo/useCallback` para estabilidad.

## `app/contexts/useAuthContext.js`
- Hook consumidor del contexto.
- Lanza error si se usa fuera de `AuthProvider`.

## `app/routes/Login.jsx`
- Vista de login (UI simple).
- Usa:
  - `useAuthContext`
  - `useLoginForm`
  - `AuthShell`
  - `AuthFeedback`
- Ya no contiene logica HTTP directa.

## `app/routes/Registro.jsx`
- Vista de registro (UI).
- Usa:
  - `useRegisterForm`
  - `AuthShell`
  - `AuthFeedback`
- Ya no contiene validacion de negocio pesada.

## `app/routes/Verificar.jsx`
- Vista para verificar email y reenviar codigo.
- Usa `authService` para llamadas.
- Muestra feedback y redirige a login al verificar.

## `app/routes/Recuperar.jsx`
- Vista de recuperacion por pasos:
  1. pedir codigo por email
  2. enviar codigo + nueva contrasena
- Usa `authService` y feedback unificado.

## `app/App.jsx`
- Router principal.
- Define rutas auth y rutas protegidas.
- `PublicOnlyRoute` evita entrar a login/registro si ya estas autenticado.
- `ProtectedPendingModule` bloquea rutas privadas sin sesion.

## `app/providers.jsx`
- Punto unico de proveedores globales.
- Aplica:
  - `BrowserRouter`
  - `AuthProvider`

## `app/root.jsx`
- Ensambla `Providers + App`.
- Es el root real consumido por `src/main.jsx`.

## `src/main.jsx`
- Entry point de Vite.
- Monta React en `#root` usando `Root`.

---

## Flujo paso a paso: Login real

1. Usuario envia formulario en `Login.jsx`.
2. `useLoginForm` llama `authService.login`.
3. `authService` usa `httpClient.postJson`.
4. `httpClient` arma URL con `API_BASE_URL`.
5. Backend responde:
   - Si rol 1/2: se pide codigo de seguridad.
   - Si rol 3: login directo.
6. Si login exitoso:
   - `AuthContext.login` guarda `user` + `token`.
   - se redirige segun rol.

## Flujo paso a paso: Registro

1. `Registro.jsx` envia datos a `useRegisterForm`.
2. Hook valida campos y edad.
3. Llama `authService.register`.
4. Si exito, muestra mensaje y navega a `/verificar?email=...`.

---

## Comandos utiles

```bash
npm run dev
npm run lint
npm run build
```
