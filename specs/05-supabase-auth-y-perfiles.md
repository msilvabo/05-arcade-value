# Spec 05: Integración de Supabase y Configuración de Clientes

**Estado:** Aprobado  
**Fecha:** 2026-10-23  
**Depende de:** 01-biblioteca-juegos-mvp.md

---

## Objetivo

Establecer la conexión y la plomería de infraestructura base de Supabase en Next.js (App Router) utilizando el paquete `@supabase/ssr`, configurando los clientes de navegador y servidor para la gestión adecuada de contexto y cookies sin crear esquemas, tablas ni alterar la base de datos en esta etapa.

---

## Alcance

### Dentro del alcance

- **1. Instalación de Dependencias:**
  - Instalación de `@supabase/supabase-js` y `@supabase/ssr`.
  - Verificación de presencia en `dependencies` dentro de `package.json`.
- **2. Configuración de Variables de Entorno:**
  - Definición de `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en `.env.local` y `.env.template`.
- **3. Cliente Browser (`lib/supabase/client.ts`):**
  - Creación del helper `createClient` exportando `createBrowserClient` de `@supabase/ssr`.
- **4. Cliente Server (`lib/supabase/server.ts`):**
  - Creación del helper asíncrono `createClient` exportando `createServerClient` de `@supabase/ssr`, con lectura y escritura de cookies mediante `next/headers`.
- **5. Verificación de Compilación y Tipos:**
  - Verificación de compilación mediante `npm run build` o `npm run dev` sin errores de TypeScript ni fallas de compilación.

### Fuera del alcance

- Creación o modificación de tablas, esquemas, triggers, funciones SQL o migraciones en la base de datos de Supabase.
- Configuración de la clave de administración `SUPABASE_SERVICE_ROLE_KEY`.
- Implementación de flujos de autenticación en la interfaz, vistas de `/login`, `/register`, Server Actions de Auth o conexión de la ruta `/auth`.
- Creación de modelos de datos, perfiles de usuario o tablas de puntuaciones.

---

## Modelo de Datos y Tipos

En esta etapa no se definen esquemas ni modelos de datos persistentes en Supabase. Se establece exclusivamente la infraestructura de conexión del cliente en TypeScript:

```ts
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
```

```ts
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = async () => {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        }
      }
    }
  )
}
```

---

## Plan de Implementación

1. **Instalar dependencias:**  
   Ejecutar `npm install @supabase/supabase-js @supabase/ssr`.  
   *Verificación:* Ambos paquetes aparecen en `dependencies` de `package.json`.

2. **Añadir variables de entorno:**  
   Añadir las siguientes variables a `.env.local` y `.env.template`:  
   ```env
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   ```  
   *Verificación:* Ambos archivos contienen las dos claves (vacías en `.env.local`, como placeholders documentados en `.env.template`).

3. **Crear `lib/supabase/client.ts`:**  
   Implementar el cliente de navegador con `createBrowserClient` de `@supabase/ssr`.  
   *Verificación:* El archivo existe y TypeScript no reporta errores.

4. **Crear `lib/supabase/server.ts`:**  
   Implementar el cliente de servidor con `createServerClient` de `@supabase/ssr`, leyendo y escribiendo cookies vía `next/headers`.  
   *Verificación:* El archivo existe y TypeScript no reporta errores.

5. **Verificación final:**  
   Ejecutar `npm run build` (o `npm run dev`) asegurando que el proceso termine sin errores de compilación ni de tipos relacionados con los nuevos archivos.

---

## Criterios de Aceptación

- [ ] `@supabase/supabase-js` y `@supabase/ssr` aparecen en `dependencies` de `package.json`.
- [ ] `.env.local` contiene `NEXT_PUBLIC_SUPABASE_URL=` y `NEXT_PUBLIC_SUPABASE_ANON_KEY=`.
- [ ] `.env.template` contiene las mismas dos claves como placeholders documentados.
- [ ] `lib/supabase/client.ts` existe y exporta `createClient` usando `createBrowserClient`.
- [ ] `lib/supabase/server.ts` existe y exporta `createClient` async usando `createServerClient`.
- [ ] `npm run build` completa sin errores de TypeScript relacionados con los nuevos archivos.
- [ ] Ninguna página o componente existente se rompe tras la integración.

---

## Decisiones Tomadas y Descartadas

- **Sí:** `@supabase/ssr` en lugar de instanciar `createClient` de `@supabase/supabase-js` directamente. El paquete SSR maneja cookies y sesión correctamente en Next.js App Router; usar el cliente básico requeriría refactorizar cuando llegue el spec de Auth.
- **Sí:** Dos archivos separados (`client.ts` y `server.ts`) en lugar de uno universal. Next.js App Router tiene contextos de ejecución distintos (browser vs. server); un solo cliente que intente cubrir ambos rompe en uno de los dos contextos.
- **No:** `SUPABASE_SERVICE_ROLE_KEY` en este spec. Solo se añade cuando un spec concreto lo requiera; incluirla ahora sería infraestructura sin uso.
- **No:** Crear tablas o esquema en Supabase. El objetivo de este spec es únicamente la plomería de conexión; el modelo de datos se define spec a spec según la funcionalidad.
- **No:** Conectar `/auth` en este spec. La autenticación real merece su propio spec con flujo, estados de error y redirecciones definidos explícitamente.

---

## Riesgos Identificados

- **Riesgo:** Incompatibilidad de cookies en Server Components durante peticiones en Next.js 16 si no se gestionan de forma asíncrona.
  - *Mitigación:* Usar estrictamente `await cookies()` dentro de `lib/supabase/server.ts` de acuerdo con las especificaciones vigentes de Next.js App Router.
- **Riesgo:** Importación accidental del cliente de servidor (`server.ts`) dentro de un Client Component.
  - *Mitigación:* Mantener nombres explícitos de archivo (`client.ts` vs `server.ts`) y verificar la compilación con `npm run build`.