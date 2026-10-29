# SPEC 12 — Autenticación de Pilotos, Login, Registro y Sesión de Usuario

> **Estado:** Aprobado  
> **Depende de:** 05-supabase-auth-y-perfiles.md, 07-leaderboard-y-tabla-de-juegos.md  
> **Fecha:** 2026-10-28  
> **Objetivo:** Implementar el sistema completo de autenticación de pilotos en Arcade Vault con registro (Email, GamerTag y Contraseña), inicio de sesión, confirmación obligatoria por correo, acceso OAuth (Google y GitHub) y sincronización de estado de sesión en la interfaz y Navbar.

---

## 1. Por qué existe esta especificación

Arcade Vault cuenta con la infraestructura cliente de Supabase (`lib/supabase/client.ts` y `lib/supabase/server.ts` de la Spec 05) y la tabla relacional `profiles` vinculada a `auth.users` mediante triggers automáticos en PostgreSQL (de la Spec 07). Además, cuenta con un prototipo visual de tarjeta de autenticación en `components/auth/AuthCard.tsx` y la página `/auth`.

Sin embargo, actualmente:
1. `AuthCard.tsx` opera como un mock visual con temporizadores `setTimeout`, sin invocar las APIs de Supabase Auth.
2. El formulario solo solicita `GamerTag` y `Contraseña`, careciendo del campo esencial `Email` que requiere Supabase Auth para la creación y recuperación de cuentas.
3. No existe un Route Handler de intercambio de código PKCE (`/auth/callback`) para completar el flujo de verificación por correo electrónico ni la autenticación federada con proveedores OAuth (Google y GitHub).
4. El componente `Navbar.tsx` muestra un enlace estático "Iniciar Sesión" y no refleja dinámicamente si hay un piloto autenticado con su GamerTag, avatar o la posibilidad de cerrar sesión.

Esta especificación formaliza la arquitectura, los contratos de datos y la implementación completa del flujo de autenticación, asegurando persistencia segura en cookies SSR y respetando el modo invitado para jugar sin cuenta.

---

## 2. Alcance

### Dentro del alcance

- **1. Formulario y Experiencia de Usuario (`components/auth/AuthCard.tsx`):**
  - **Pestaña Registro:** Campos para `Email`, `GamerTag` (alias único de piloto), `Contraseña` (con medidor de seguridad retro de 4 niveles) y `Confirmar Contraseña`.
  - **Pestaña Inicio de Sesión:** Campos para `Email` y `Contraseña`, con enlace a "¿Olvidaste tu código?".
  - **Recuperación de Contraseña:** Modal o estado alternativo dentro de la tarjeta para solicitar correo de restablecimiento (`supabase.auth.resetPasswordForEmail`).
  - **Confirmación Obligatoria de Correo:** Estado visual de notificación y espera que informa al piloto que debe verificar su correo antes de poder acceder al Vault.
  - **Autenticación Social (OAuth):** Conexión de los botones 8-bit de Google y GitHub invocando `supabase.auth.signInWithOAuth`.
  - **Modo Invitado:** Preservar la opción "Jugar como Invitado", permitiendo acceder al catálogo y almacenar puntuaciones exclusivamente en `localStorage`.

- **2. Endpoint de Intercambio de Código de Autenticación (`app/auth/callback/route.ts`):**
  - Route Handler GET en Next.js App Router para intercambiar el parámetro `code` (PKCE flow) por una sesión de Supabase vía `supabase.auth.exchangeCodeForSession(code)`.
  - Redirección post-autenticación al destino especificado en el parámetro `next` (por defecto `/`).

- **3. Sincronización de Sesión en la Barra de Navegación (`components/layout/Navbar.tsx`):**
  - Detección de sesión activa mediante `createBrowserClient` y suscripción al listener reactivo `supabase.auth.onAuthStateChange`.
  - Si el usuario está autenticado: mostrar badge con su `GamerTag`, indicador de conexión en línea (verde neón `#00ff66`) y botón "Cerrar Sesión" (`supabase.auth.signOut`).
  - Si el usuario no está autenticado: mostrar el botón habitual "Iniciar Sesión" con enlace a `/auth`.

- **4. Acciones y Servicios de Autenticación (`lib/services/auth.ts` y/o Server Actions):**
  - Métodos encapsulados para `signUp(email, password, gamerTag)`, `signIn(email, password)`, `signInWithOAuth(provider)`, `signOut()` y `resetPassword(email)`.
  - Inyección de `gamer_tag` en `raw_user_meta_data` durante el `signUp` para que el trigger SQL `handle_new_user()` cree automáticamente la fila en `public.profiles`.

### Fuera del alcance (para futuras especificaciones)

- Implementación de doble factor de autenticación (2FA / MFA).
- Panel de edición completa de perfil (subida de avatars binarios a buckets de Supabase Storage).
- Bloqueo o middleware restrictivo que impida jugar a usuarios no registrados (los invitados pueden seguir jugando con persistencia local).
- Proveedores OAuth adicionales más allá de Google y GitHub (ej. Discord, Twitter/X, Apple).

---

## 3. Modelo de Datos y Tipos

### 3.1 Esquema de Base de Datos Existente (Spec 07)

Se reutiliza la tabla `public.profiles` creada en la migración `20261023000000_create_games_and_scores_tables.sql`:

```sql
-- public.profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  gamer_tag TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger automático al registrarse en auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, gamer_tag, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'gamer_tag', 'PLAYER_' || substring(new.id::text, 1, 6)),
    COALESCE(new.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3.2 Tipos en TypeScript (`types/auth.ts`)

```typescript
export interface AuthUserSession {
  id: string;
  email: string;
  gamerTag: string;
  avatarUrl?: string | null;
}

export type AuthMode = "login" | "register" | "forgot-password";

export interface AuthActionResult {
  success: boolean;
  message?: string;
  error?: string;
  requiresEmailVerification?: boolean;
}
```

---

## 4. Plan de Implementación

1. **Crear tipos de autenticación (`types/auth.ts`):**
   - Definir interfaces para estado de sesión del piloto, resultados de acciones y errores tipados.

2. **Crear servicio cliente de autenticación (`lib/services/auth.ts`):**
   - Implementar funciones con manejo exhaustivo de errores:
     - `signUpPilot({ email, password, gamerTag })` pasando `data: { gamer_tag: gamerTag }` en las opciones de `signUp`.
     - `signInPilot({ email, password })`.
     - `signInWithSocialProvider(provider: "google" | "github")` con redirección a `${origin}/auth/callback`.
     - `signOutPilot()`.
     - `sendPasswordResetEmail(email)`.
     - `getCurrentPilotProfile()`.

3. **Crear Route Handler PKCE (`app/auth/callback/route.ts`):**
   - Leer `code` y `next` de `request.nextUrl.searchParams`.
   - Si existe `code`, inicializar `createServerClient` y ejecutar `exchangeCodeForSession(code)`.
   - Redirigir al usuario a `next` (por defecto `/`) o a `/auth?error=auth_code_error` en caso de fallo.

4. **Refactorizar y conectar `components/auth/AuthCard.tsx`:**
   - Incorporar campo `email` en los modos de Login y Registro.
   - Conectar `signUpPilot` en modo Registro, mostrando la pantalla/notificación de confirmación de email enviada.
   - Conectar `signInPilot` en modo Login, gestionando errores (credenciales inválidas, correo no confirmado).
   - Conectar botones de Google y GitHub con `signInWithSocialProvider`.
   - Implementar flujo de recuperación de contraseña ("¿OLVIDASTE TU CÓDIGO?").
   - Mantener intacto el botón "Jugar como Invitado" que redirige a `/` con notificación retro.

5. **Actualizar `components/layout/Navbar.tsx` para reflejar la sesión:**
   - Suscribirse al estado de autenticación de Supabase (`onAuthStateChange`).
   - Cargar el perfil asociado del usuario (`gamer_tag`, avatar).
   - Renderizar el GamerTag con diseño retro arcade y botón desplegable o directo de "Cerrar Sesión".
   - Si no hay sesión, mantener el botón de acceso "Iniciar Sesión".

6. **Actualizar página de autenticación (`app/auth/page.tsx`):**
   - Manejar posibles mensajes de error o confirmación pasados por query params (ej. `?message=confirmed` o `?error=invalid_token`).

7. **Verificación técnica integral:**
   - Ejecutar `npm run build` y `npm run lint` para garantizar 0 errores de compilación y tipado estricto.
   - Probar flujo completo: registro -> verificación pendiente -> login -> navbar -> logout -> invitado.

---

## 5. Criterios de Aceptación

- [ ] `types/auth.ts` define las interfaces `AuthUserSession` y `AuthActionResult`.
- [ ] `lib/services/auth.ts` implementa los métodos `signUpPilot`, `signInPilot`, `signInWithSocialProvider`, `signOutPilot` y `sendPasswordResetEmail`.
- [ ] `app/auth/callback/route.ts` procesa el código PKCE y establece las cookies de sesión mediante `createServerClient`.
- [ ] El registro solicita `Email`, `GamerTag` y `Contraseña`, almacenando el `gamer_tag` en la metadata del usuario y disparando la inserción en `profiles`.
- [ ] Tras registrarse, se notifica explícitamente al usuario que debe verificar su correo antes de iniciar sesión.
- [ ] El inicio de sesión valida credenciales contra Supabase Auth y redirige a la aplicación al autenticarse.
- [ ] Si las credenciales son incorrectas o el correo no está verificado, se muestra un mensaje de error temático sin recargar la página.
- [ ] Los botones de Google y GitHub redirigen a los proveedores OAuth respectivos mediante Supabase.
- [ ] La opción "Jugar como Invitado" permanece accesible y funcional para usuarios anónimos.
- [ ] `Navbar.tsx` muestra el `GamerTag` del piloto autenticado y ofrece la opción de cerrar sesión.
- [ ] Al cerrar sesión, las cookies y el estado en el navegador se limpian y la barra de navegación vuelve al estado no autenticado.
- [ ] `npm run build` compila con éxito sin advertencias ni errores de TypeScript.

---

## 6. Decisiones Tomadas y Descartadas

- **Sí:** Solicitar Email, GamerTag y Contraseña en el registro. Supabase Auth se apoya en emails para la autenticación única y recuperación de contraseñas, mientras que GamerTag es la identidad arcade visible en Leaderboards y Cabina.
- **Sí:** Confirmación obligatoria de correo electrónico. Protege contra registros con correos inválidos o suplantación de identidad en el ranking competitivo.
- **Sí:** PKCE Code Exchange Route Handler (`app/auth/callback/route.ts`). Es el estándar recomendado por Next.js App Router y `@supabase/ssr` para flujos OAuth y verificación de correos.
- **Sí:** Mantener el modo invitado activo. La filosofía arcade de Arcade Vault prioriza que cualquier jugador pueda probar los juegos de inmediato sin fricción inicial.
- **No:** Bloquear rutas de juegos con Middleware obligatorio. Forzar login previo para jugar destruiría la experiencia de arcade rápida de la plataforma; el login se incentiva para registrar récords globales y competir.
- **No:** Reemplazar el cliente de Supabase existente. Se utiliza estrictamente `lib/supabase/client.ts` y `lib/supabase/server.ts` ya configurados en la Spec 05.

---

## 7. Riesgos Identificados

| Riesgo | Mitigación |
| --- | --- |
| Colisión o duplicado de `gamer_tag` en la tabla `profiles` | Validar en cliente y capturar el error de unicidad de base de datos (`23505`) para mostrar advertencia "ESTE GAMERTAG YA ESTÁ EN USO". |
| Desajuste de sesión entre Server Components y Client Components | Utilizar `@supabase/ssr` con cookies sincronizadas y suscribir `Navbar` a `onAuthStateChange`. |
| Proveedores OAuth no configurados en el dashboard de Supabase en entornos locales | Manejar graceful fallback: si el proveedor OAuth rechaza la petición, capturar el error y mostrar notificación de "PROVEEDOR NO DISPONIBLE EN MODO LOCAL". |

---

## 8. Qué **no** está en esta especificación

- Subida y almacenamiento de fotos de avatar personalizadas a Supabase Storage.
- Sistema de amigos, chats o mensajería directa entre pilotos.
- Autenticación multifactor (MFA/2FA) por SMS o app autenticadora.
- Bloqueo de acceso anónimo a la cabina CRT o a la biblioteca.
