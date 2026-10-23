Spec 05: Integración de Supabase, Autenticación y Perfiles de Jugador

**Estado:** Draft

**Fecha:** 2026-10-23

**Depende de:** 01-biblioteca-juegos-mvp.md, 02-arcade-interfaces-visuales.md, 03-home-landing-y-about.md

## Objetivo

Configurar la infraestructura y la plomería de conexión inicial con `@supabase/ssr` y `@supabase/supabase-js` en Next.js para permitir la comunicación cliente y servidor con Supabase mediante helpers dedicados (`client.ts` y `server.ts`).

## Alcance

### Dentro del alcance

1. **Instalar dependencias:** `npm install @supabase/supabase-js @supabase/ssr`.

   * Verificación: Ambos paquetes aparecen en `dependencies` de `package.json`.

2. **Añadir variables de entorno:** Añadir a `.env.local` y a `.env.template`:

   * `NEXT_PUBLIC_SUPABASE_URL=`

   * `NEXT_PUBLIC_SUPABASE_ANON_KEY=`

   * Verificación: Ambos archivos contienen las dos claves (vacías en `.env.local`, como placeholders documentados en `.env.template`).

3. **Crear `lib/supabase/client.ts`:** Cliente browser instanciado con `createBrowserClient` de `@supabase/ssr`.

4. **Crear `lib/supabase/server.ts`:** Cliente server con `createServerClient` de `@supabase/ssr`, leyendo y escribiendo cookies vía `next/headers`.

5. **Verificación final:** Ejecución de `npm run build` (o `npm run dev`) sin errores de compilación ni de tipos relacionados con los nuevos archivos.

### Fuera del alcance

* `SUPABASE_SERVICE_ROLE_KEY` en este spec (se añadirá cuando un spec concreto lo requiera).

* Creación de tablas, esquemas, migraciones SQL o políticas RLS en Supabase.

* Conexión e integración con la ruta `/auth`, formularios de login/registro o flujos de autenticación.

## Modelo de Datos y Tipos

Por el momento, no se define un modelo de datos o esquema en Supabase. El objetivo de este spec es únicamente la plomería de conexión; el modelo de datos se definirá spec a spec según la funcionalidad requerida.

## Plan de Implementación

1. **Instalar dependencias** — Executar `npm install @supabase/supabase-js @supabase/ssr`.

2. **Configurar variables de entorno** — Registrar las claves en `.env.local` y `.env.template`.

3. **Crear `lib/supabase/client.ts`**:

   ```
   import { createBrowserClient } from '@supabase/ssr'
   
   export const createClient = () =>
     createBrowserClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
     )
   
   ```

4. **Crear `lib/supabase/server.ts`**:

   ```
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

5. **Verificación final** — Ejecutar `npm run build` y verificar que el proyecto compila correctamente sin errores de TypeScript.

## Criterios de Aceptación

* \[ \] `@supabase/supabase-js` y `@supabase/ssr` aparecen en `dependencies` de `package.json`.

* \[ \] `.env.local` contiene `NEXT_PUBLIC_SUPABASE_URL=` y `NEXT_PUBLIC_SUPABASE_ANON_KEY=`.

* \[ \] `.env.template` contiene las mismas dos claves como placeholders documentados.

* \[ \] `lib/supabase/client.ts` existe y exporta `createClient` usando `createBrowserClient`.

* \[ \] `lib/supabase/server.ts` existe y exporta `createClient` async usando `createServerClient`.

* \[ \] `npm run build` completa sin errores de TypeScript relacionados con los nuevos archivos.

* \[ \] Ninguna página o componente existente se rompe tras la integración.

## Decisiones Tomadas y Descartadas

* **Aceptada: Uso de `@supabase/ssr` en lugar de instanciar `createClient` de `@supabase/supabase-js` directamente.**

  * *Justificación:* El paquete SSR maneja cookies y sesión correctamente en Next.js App Router; usar el cliente básico requeriría refactorizar cuando llegue el spec de Auth.

* **Aceptada: Dos archivos separados (`client.ts` y `server.ts`) en lugar de uno universal.**

  * *Justificación:* Next.js App Router tiene contextos de ejecución distintos (browser vs. server); un solo cliente que intente cubrir ambos rompe en uno de los dos contextos.

* **Descartada: `SUPABASE_SERVICE_ROLE_KEY` en este spec.**

  * *Justificación:* Solo se añade cuando un spec concreto lo requiera; incluirla ahora sería infraestructura sin uso.

* **Descartada: Crear tablas o esquema en Supabase en este spec.**

  * *Justificación:* El objetivo de este spec es únicamente la plomería de conexión; el modelo de datos se define spec a spec según la funcionalidad.

* **Descartada: Conectar `/auth` en este spec.**

  * *Justificación:* La autenticación real merece su propio spec con flujo, estados de error y redirecciones definidos explícitamente.

## Riesgos Identificados

* **Riesgo:** Variables de entorno no cargadas en tiempo de ejecución causando errores de cliente/servidor.

  * *Mitigación:* Documentar adecuadamente las claves en `.env.template` y asegurar el operador `!` en TypeScript para las variables públicas.

* **Riesgo:** Incompatibilidad con lecturas asíncronas de cookies en Next.js App Router.

  * *Mitigación:* Usar `await cookies()` dentro de `createClient` en `lib/supabase/server.ts`.