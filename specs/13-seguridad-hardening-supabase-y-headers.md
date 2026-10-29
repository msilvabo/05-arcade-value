# SPEC 13 — Medidas de Seguridad, Headers HTTP y Hardening de Supabase

> **Estado:** Aprobado  
> **Depende de:** 05-supabase-auth-y-perfiles.md, 07-leaderboard-y-tabla-de-juegos.md, 12-autenticacion-login-registro.md  
> **Fecha:** 2026-10-29  
> **Objetivo:** Implementar las medidas de seguridad y hardening del sistema mitigando las advertencias del Database Linter de Supabase, incorporando cabeceras de seguridad HTTP en Next.js y garantizando el requisito de contraseñas de al menos 8 caracteres con protección contra contraseñas filtradas y limitación de tasa de registro.

---

## 1. Por qué existe esta especificación

Tras la auditoría inicial de seguridad documentada en `references/security/security-check-lists.md`, se identificaron puntos críticos que requieren atención inmediata en dos frentes complementarios:

1. **Vulnerabilidades y Linter Warnings en la Base de Datos (Supabase):**
   - **`function_search_path_mutable`:** La función `public.handle_new_user()` carece de un `search_path` fijo, exponiéndola a ataques de secuestro de esquemas si se crean objetos temporales maliciosos.
   - **`rls_policy_always_true`:** La tabla `public.scores` cuenta con una directiva `Permitir registro libre de puntuaciones` para `INSERT` con `WITH CHECK (true)`, anulando en la práctica el aislamiento de Row Level Security.
   - **`anon_security_definer_function_executable` & `authenticated_security_definer_function_executable`:** Las funciones `SECURITY DEFINER` (`handle_new_user()` y `rls_auto_enable()`) están expuestas con permisos de ejecución pública a través de la API REST/RPC para roles `anon` y `authenticated`.
   - **`auth_leaked_password_protection`:** La protección nativa contra contraseñas comprometidas (HaveIBeenPwned) se encuentra deshabilitada en la configuración del servicio Auth.

2. **Seguridad a nivel de Aplicación Web (Next.js):**
   - La aplicación carece de cabeceras de respuesta HTTP defensivas estándar en `next.config.ts`, haciéndola vulnerable a Clickjacking (`X-Frame-Options`), suplantación de tipos MIME (`X-Content-Type-Options`) y fugas de contexto de referencia (`Referrer-Policy`).
   - El formulario de registro (`AuthCard.tsx`) debe validar de forma explícita que las contraseñas cuenten con al menos 8 caracteres antes del envío, alineándose con las políticas de autenticación y previniendo ataques de fuerza bruta o credenciales débiles.

Esta especificación consolida las soluciones necesarias en código reproducible (migración SQL versionada y configuración Next.js) y proporciona la guía operativa para los ajustes requeridos en el Dashboard de Supabase.

---

## 2. Alcance

### Dentro del alcance

- **1. Migración SQL de Hardening en Supabase (`supabase/migrations/20261029120000_security_hardening.sql`):**
  - Fijar `SET search_path = public` en `public.handle_new_user()` para evitar manipulación de rutas de resolución de esquemas.
  - Revocar permisos directos de ejecución (`REVOKE EXECUTE`) sobre `public.handle_new_user()` y `public.rls_auto_enable()` para los roles `anon`, `authenticated` y `public`.
  - Eliminar de forma segura cualquier política permisiva `WITH CHECK (true)` existente en `public.scores`.
  - Asegurar y ratificar que `ROW LEVEL SECURITY` esté activo en `public.profiles`, `public.games` y `public.scores`.
  - Establecer que la inserción (`INSERT`) en `public.scores` esté restringida exclusivamente a usuarios autenticados validando `auth.uid() = user_id`.

- **2. Cabeceras de Seguridad HTTP en Next.js (`next.config.ts`):**
  - Implementar la función `headers()` en `nextConfig` aplicando cabeceras estándar en todas las rutas `/(.*)`:
    - `X-Content-Type-Options: nosniff` (previene interpretación errónea de archivos MIME).
    - `X-Frame-Options: DENY` (bloquea la incrustación en `iframe` previniendo ataques de clickjacking).
    - `Referrer-Policy: strict-origin-when-cross-origin` (limita la exposición de datos de navegación a terceros).
    - `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()` (restringe APIs sensibles del navegador).

- **3. Validación de Longitud Mínima de Contraseña en Frontend (`components/auth/AuthCard.tsx`):**
  - Validación en tiempo real y previa al submit que exija un mínimo de 8 caracteres.
  - Indicador de error / advertencia retro si la longitud de la contraseña es inferior a 8 caracteres.
  - Actualización del medidor de seguridad visual para que el nivel mínimo aceptable requiera >= 8 caracteres.

- **4. Checklist y Guía de Hardening de Supabase Auth (Dashboard):**
  - Documentar el procedimiento para activar `Leaked Password Protection` en el Dashboard de Supabase (integración con HaveIBeenPwned).
  - Configurar la longitud mínima de contraseña en 8 caracteres dentro de Supabase Auth Settings.
  - Documentar la configuración de `Max Signup Rate` y límites de peticiones por IP en el panel de Rate Limits de Supabase.

### Fuera del alcance (para futuras especificaciones)

- Implementación de Content Security Policy (CSP) estricta basada en nonces por petición (se evaluará en una spec posterior para no interferir con Web Workers de audio o assets externos dinámicos).
- Captcha interactivo (Cloudflare Turnstile o Google reCAPTCHA) en el formulario de registro (actualmente mitigado con validaciones y rate limiting).
- Autenticación multifactor (MFA/2FA vía TOTP).

---

## 3. Modelo de Datos y Definiciones Técnicas

### 3.1 Migración SQL de Hardening (`supabase/migrations/20261029120000_security_hardening.sql`)

```sql
-- ============================================================================
-- Migración de Hardening de Seguridad (Spec 13)
-- ============================================================================

-- 1. Asegurar search_path inmutable en funciones SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, gamer_tag, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'gamer_tag', 'PLAYER_' || substring(new.id::text, 1, 6)),
    COALESCE(new.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN new;
END;
$$;

-- 2. Revocar privilegios de ejecución pública en funciones sensibles
-- Evita llamadas no autorizadas via /rest/v1/rpc/handle_new_user
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM public, anon, authenticated;

-- Manejo seguro de rls_auto_enable si existe en la base de datos
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'rls_auto_enable'
  ) THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM public, anon, authenticated;';
  END IF;
END $$;

-- 3. Habilitación estricta de Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

-- 4. Remediación de políticas permisivas en public.scores
-- Eliminar la política insegura WITH CHECK (true) si fue creada
DROP POLICY IF EXISTS "Permitir registro libre de puntuaciones" ON public.scores;

-- Asegurar política estricta de INSERT vinculada a la identidad del usuario
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'scores' AND policyname = 'Usuarios autenticados pueden registrar puntuaciones'
  ) THEN
    CREATE POLICY "Usuarios autenticados pueden registrar puntuaciones"
      ON public.scores
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
```

### 3.2 Configuración de Cabeceras HTTP en `next.config.ts`

```ts
const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];
```

---

## 4. Plan de Implementación

1. **Crear la migración SQL de hardening:**
   - Crear el archivo `supabase/migrations/20261029120000_security_hardening.sql` con las directivas DDL para fijar `search_path`, revocar `EXECUTE` en funciones `SECURITY DEFINER`, activar RLS y eliminar políticas `WITH CHECK (true)` en `public.scores`.
   - Validar sintácticamente el script SQL.

2. **Actualizar `next.config.ts` con cabeceras de seguridad:**
   - Importar o definir la constante `securityHeaders`.
   - Agregar el método asíncrono `headers()` en la configuración de Next.js apuntando al patrón `/(.*)`.
   - Verificar compilación limpia con `npm run build` o inspección de cabeceras HTTP.

3. **Reforzar validación de contraseña en `components/auth/AuthCard.tsx`:**
   - Incorporar validación que verifique `password.length >= 8`.
   - Si la contraseña tiene menos de 8 caracteres al intentar registrarse, mostrar mensaje retro de advertencia: `"LA CONTRASEÑA DEBE TENER AL MENOS 8 CARACTERES"`.
   - Ajustar el cálculo del medidor de seguridad para que la barra no marque nivel seguro si la longitud es menor a 8.

4. **Elaborar la guía operativa para el Dashboard de Supabase:**
   - Documentar en la sección de verificación los pasos específicos en Supabase Studio (Authentication -> Security):
     - Activar **Enable Leaked Password Protection**.
     - Establecer **Minimum password length** en `8`.
     - Configurar **Rate Limiting** para creación de usuarios (`Max signup rate`).

---

## 5. Criterios de Aceptación

- [ ] **Migración SQL creada:** Existe el archivo `supabase/migrations/20261029120000_security_hardening.sql` con todas las instrucciones de hardening requeridas.
- [ ] **Search Path inmutable:** `public.handle_new_user()` tiene fijado explícitamente `SET search_path = public`.
- [ ] **Funciones SECURITY DEFINER protegidas:** Se revocan permisos `EXECUTE` para roles `public`, `anon` y `authenticated` en `handle_new_user()` y `rls_auto_enable()`.
- [ ] **RLS ratificado:** Las tablas `profiles`, `games` y `scores` tienen `ROW LEVEL SECURITY` habilitado.
- [ ] **Política RLS de Scores saneada:** No existe ninguna política `WITH CHECK (true)` en `public.scores`. Solo los usuarios con sesión válida pueden insertar (`auth.uid() = user_id`).
- [ ] **Headers HTTP activos en Next.js:** Respuestas en `/` y demás rutas devuelven:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`
- [ ] **Validación de contraseña en AuthCard:** El registro rechaza contraseñas con menos de 8 caracteres antes de invocar la API.
- [ ] **Build y calidad:** `npm run build` y `npm run lint` pasan sin errores ni advertencias de compilación.

---

## 6. Decisiones Tomadas y Descartadas

- **Aprobada: Mantener a los usuarios invitados 100% en `localStorage` sin inserciones anónimas en Supabase.**
  - _Justificación:_ Evita saturar la base de datos con registros basura o bots sin autenticación y permite aplicar un RLS estricto (`auth.uid() = user_id`) en `public.scores`.
- **Aprobada: Migración SQL versionada para todo cambio estructural de base de datos.**
  - _Justificación:_ Permite trazabilidad en el repositorio git y reproducibilidad en entornos locales y de producción.
- **Aprobada: Incorporar Permissions-Policy además de las 3 cabeceras básicas.**
  - _Justificación:_ Deshabilita explícitamente APIs no utilizadas (cámara, micrófono, geolocalización) aumentando el grado de seguridad en auditorías automatizadas sin afectar la funcionalidad de la cabina arcade.
- **Descartada: Content-Security-Policy (CSP) estricta en este momento.**
  - _Justificación:_ Una política CSP estricta requiere hashes o nonces para estilos en línea y recursos dinámicos de audio/spritesheets, lo que introduciría riesgo de regresión en los juegos canvas sin una fase de pruebas aislada.

---

## 7. Riesgos Identificados y Mitigaciones

| Riesgo                                                                                           | Impacto | Mitigación                                                                                                                                                                                                                                                                                          |
| ------------------------------------------------------------------------------------------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Llamadas a `handle_new_user()` por triggers tras revocar EXECUTE**                             | Medio   | PostgreSQL ejecuta los triggers bajo los privilegios del definer de la función (`SECURITY DEFINER`) o superusuario interno de auth; revocar el privilegio a `public`, `anon` y `authenticated` impide invocarlo como endpoint RPC HTTP sin afectar el trigger interno `AFTER INSERT ON auth.users`. |
| **Cabecera `X-Frame-Options: DENY` si Arcade Vault se embebe en plataformas de juegos externas** | Bajo    | La aplicación opera como destino web principal. Si en el futuro se distribuye en iframes (ej. itch.io), se actualizará a `frame-ancestors` controlado.                                                                                                                                              |
| **Usuarios intentando registrarse con contraseñas cortas**                                       | Bajo    | La validación inmediata en frontend informa claramente la regla de 8 caracteres antes de que falle la petición en el backend.                                                                                                                                                                       |
