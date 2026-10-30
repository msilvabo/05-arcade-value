# Checklist de Seguridad y Guía de Hardening (Spec 13)

## 1. Estado del Checklist de Seguridad

- [x] **RLS (Row Level Security):** Habilitado y ratificado en `profiles`, `games` y `scores`. Política de `INSERT` restringida a usuarios autenticados (`auth.uid() = user_id`) y saneada la regla `WITH CHECK (true)` (`supabase/migrations/20261029120000_security_hardening.sql`).
- [x] **Inmutabilidad de Search Path:** Función `public.handle_new_user()` fijada con `SET search_path = public`.
- [x] **Revocación de EXECUTE:** Se revocó el permiso de ejecución pública sobre `public.handle_new_user()` y `public.rls_auto_enable()` para roles `anon`, `authenticated` y `public`.
- [x] **Headers de Seguridad HTTP en Next.js:** Configurados en `next.config.ts` (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`).
- [x] **Validación de Contraseña Mínima de 8 Caracteres en Frontend:** Implementada en `components/auth/AuthCard.tsx` (tiempo real, medidor retro adaptado y bloqueo pre-submit) y en mapeo de mensajes de `lib/services/auth.ts`.
- [ ] **Configuración de Seguridad en Supabase Studio / Dashboard:** Requiere activación manual en panel web (ver Guía Operativa abajo).

---

## 2. Guía Operativa para Supabase Dashboard (Auth & Security)

Dado que las configuraciones de seguridad del servicio GoTrue (Supabase Auth) se gestionan a nivel de infraestructura y no mediante DDL SQL, deben aplicarse los siguientes pasos en el **Dashboard de Supabase**:

### 2.1 Leaked Password Protection (Mitigación Warning 4)

1. Navega a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard).
2. Ve a **Authentication** en el menú lateral izquierdo → **Security** (o **Password**).
3. Localiza la sección **Password Protection** / **Compromised Passwords**.
4. Activa el interruptor **Enable Leaked Password Protection** (verifica contra la base de HaveIBeenPwned).
5. Haz clic en **Save**.

### 2.2 Longitud Mínima de Contraseña (8 caracteres)

1. En la misma sección **Authentication** → **Security** / **Password**.
2. Localiza el campo **Minimum password length**.
3. Cambia el valor a **`8`** (o superior).
4. Haz clic en **Save**.

### 2.3 Rate Limiting Anti-Bot (Max Signup Rate)

1. Ve a **Authentication** → **Rate Limits**.
2. Localiza las reglas de límite por IP:
   - **Signups per hour / Max signup rate:** Configura un límite razonable (por ejemplo, `30` o `60` signups/hora por IP) para mitigar creación masiva automatizada de cuentas.
   - **Token refresh / Password reset requests:** Ajusta a un rango prudente (ej. `30` peticiones/hora).
3. Haz clic en **Save changes**.

---

## 3. Registro Histórico de Linter Warnings y Mitigaciones

| Warning Linter                                       | Gravedad | Estado              | Mitigación Aplicada                                                                                 |
| ---------------------------------------------------- | -------- | ------------------- | --------------------------------------------------------------------------------------------------- |
| `function_search_path_mutable`                       | WARN     | ✅ Mitigado         | `SET search_path = public` en `public.handle_new_user()` (`20261029120000_security_hardening.sql`). |
| `rls_policy_always_true`                             | WARN     | ✅ Mitigado         | Eliminada política `WITH CHECK (true)` en `public.scores`; ratificado `auth.uid() = user_id`.       |
| `anon_security_definer_function_executable`          | WARN     | ✅ Mitigado         | `REVOKE EXECUTE` en `handle_new_user()` y `rls_auto_enable()` para `anon` y `public`.               |
| `authenticated_security_definer_function_executable` | WARN     | ✅ Mitigado         | `REVOKE EXECUTE` en `handle_new_user()` y `rls_auto_enable()` para `authenticated`.                 |
| `auth_leaked_password_protection`                    | WARN     | ⚙️ Config Dashboard | Habilitación guiada en **Authentication** → **Security** en Supabase Dashboard.                     |

---

## 4. Referencia de Cabeceras HTTP Aplicadas en `next.config.ts`

```ts
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];
```
