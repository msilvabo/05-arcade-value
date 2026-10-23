# Spec 07: Leaderboard y Tabla de Juegos en Supabase

**Estado:** Aprobado  
**Fecha:** 2026-10-23  
**Depende de:** 01-biblioteca-juegos-mvp.md, 05-supabase-auth-y-perfiles.md

---

## Objetivo

Diseñar e implementar el esquema relacional en Supabase para juegos (`games`), perfiles (`profiles`) y puntuaciones (`scores`), junto con políticas de seguridad (RLS), datos semilla (seed) iniciales y la integración de lectura con fallback resiliente en la página `/leaderboard` de Next.js.

---

## Alcance

### Dentro del alcance

- **1. Esquema Relacional y Migraciones SQL (`supabase/migrations/`):**
  - **Tabla `profiles`:**
    - Columnas: `id` (UUID, PK, `references auth.users(id) on delete cascade`), `gamer_tag` (TEXT, UNIQUE, NOT NULL), `avatar_url` (TEXT), `created_at` (TIMESTAMPTZ, default `now()`), `updated_at` (TIMESTAMPTZ, default `now()`).
    - Trigger SQL automático `on_auth_user_created` para sincronizar nuevos usuarios de `auth.users` creando su perfil con `gamer_tag` por defecto.
  - **Tabla `games`:**
    - Columnas: `id` (TEXT, PK, slug identificador ej. `'asteroids-2084'`), `title` (TEXT, NOT NULL), `category` (TEXT, NOT NULL), `category_keys` (TEXT[], NOT NULL), `year` (INTEGER, NOT NULL), `description` (TEXT), `badge` (TEXT), `badge_variant` (TEXT), `difficulty` (TEXT), `art_type` (TEXT), `plays_count` (BIGINT, default 0), `created_at` (TIMESTAMPTZ, default `now()`).
  - **Tabla `scores`:**
    - Columnas: `id` (UUID, PK, default `gen_random_uuid()`), `user_id` (UUID, NOT NULL, `references profiles(id) on delete cascade`), `game_id` (TEXT, NOT NULL, `references games(id) on delete cascade`), `score` (INTEGER, NOT NULL), `accuracy` (TEXT), `combo` (TEXT), `created_at` (TIMESTAMPTZ, default `now()`).
    - Índices compuestos para optimizar consultas de ranking: `idx_scores_game_score` (`game_id`, `score DESC`) y `idx_scores_user` (`user_id`).
  - **Vista o Consulta de Leaderboard:**
    - Consulta o vista `leaderboard_rankings` que agrupa el máximo score por usuario y juego o devuelve las mejores puntuaciones globales ordenadas por `score DESC`.
  - **Políticas de Row Level Security (RLS):**
    - `profiles`: lectura pública (`SELECT` para `anon` y `authenticated`), inserción y actualización únicamente para el propio usuario (`auth.uid() = id`).
    - `games`: lectura pública (`SELECT`), inserción/actualización restringida (solo servicio / admin).
    - `scores`: lectura pública (`SELECT`), inserción permitida únicamente para usuarios autenticados registrando su propio `auth.uid() = user_id`.

- **2. Seed Data SQL (`supabase/seed.sql`):**
  - Migración o script de seed con los juegos preexistentes de `data/games.ts` (`asteroids-2084`, `arkanoid-neon-revenge`, `cyber-tetris-99`, `space-invaders-galaxy`, `pacman-neon-grid`, `street-fighter-alpha-arcade`).
  - Datos de muestra para perfiles y puntuaciones iniciales de leaderboard basados en `data/leaderboard.ts`.

- **3. Capa de Servicios y Tipos TypeScript (`types/database.ts`, `lib/supabase/`):**
  - Tipos TypeScript que reflejen el esquema relacional (`GameRow`, `ProfileRow`, `ScoreRow`, `LeaderboardViewEntry`).
  - Servicios de consulta del servidor (`lib/supabase/leaderboard.ts` o `lib/services/leaderboard.ts`):
    - `getLeaderboardEntries(gameId?: string, limit?: number)`: consulta Supabase utilizando el cliente de servidor (`createServerClient`), retornando lista de entradas con join a `profiles` y `games`.
    - `getGames()`: consulta la lista de juegos activos desde la tabla `games`.
  - Mecanismo de **degradación elegante (fallback)**: si no hay credenciales de Supabase válidas, si la base de datos está vacía o si ocurre un error de red, retornar de forma transparente los datos mock de `data/leaderboard.ts` y `data/games.ts` garantizando que la aplicación nunca falle ni muestre pantallas rotas.

- **4. Integración en la Interfaz de Usuario (`app/leaderboard/page.tsx`):**
  - Actualizar `app/leaderboard/page.tsx` para obtener los datos desde el servicio del servidor (Server Component).
  - Permitir filtrado por juego seleccionado dinámicamente según la tabla `games`.
  - Mantener intacto el diseño CRT / neón arcade y la accesibilidad existente.

### Fuera del alcance

- Formularios de administración o edición manual de juegos desde el frontend (CRUD de catálogo).
- Creación de partidas en tiempo real o webhooks de telemetría durante el juego (se abordan en specs específicas de juegos).
- Modificación del sistema de autenticación de Supabase configurado en Spec 05.

---

## Modelo de Datos y Tipos

### 1. Esquema SQL (PostgreSQL / Supabase)

```sql
-- 1. Perfiles de usuario vinculados a auth.users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  gamer_tag TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger para crear perfil automático al registrarse
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

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Tabla de Juegos del Arcade
CREATE TABLE public.games (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  category_keys TEXT[] NOT NULL DEFAULT '{}',
  year INTEGER NOT NULL,
  description TEXT DEFAULT '',
  badge TEXT,
  badge_variant TEXT DEFAULT 'primary',
  difficulty TEXT DEFAULT 'NORMAL',
  art_type TEXT DEFAULT 'generic',
  plays_count BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabla de Puntuaciones Históricas
CREATE TABLE public.scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0),
  accuracy TEXT DEFAULT '100%',
  combo TEXT DEFAULT 'x1',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices de consulta de alto rendimiento
CREATE INDEX idx_scores_game_score ON public.scores(game_id, score DESC);
CREATE INDEX idx_scores_user ON public.scores(user_id);

-- RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de perfiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Lectura pública de juegos" ON public.games FOR SELECT USING (true);

CREATE POLICY "Lectura pública de puntuaciones" ON public.scores FOR SELECT USING (true);
CREATE POLICY "Usuarios autenticados pueden registrar puntuaciones" ON public.scores FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 2. Tipos de TypeScript (`types/database.ts`)

```typescript
export interface ProfileRow {
  id: string;
  gamer_tag: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface GameRow {
  id: string;
  title: string;
  category: string;
  category_keys: string[];
  year: number;
  description: string;
  badge: string | null;
  badge_variant: string | null;
  difficulty: string;
  art_type: string;
  plays_count: number;
  created_at: string;
}

export interface ScoreRow {
  id: string;
  user_id: string;
  game_id: string;
  score: number;
  accuracy: string;
  combo: string;
  created_at: string;
}

export interface LeaderboardEntryDTO {
  rank: number;
  gamerTag: string;
  avatar: string;
  score: number;
  formattedScore: string;
  gameId: string;
  gameTitle: string;
  badge: string;
  date: string;
  accuracy: string;
  combo: string;
}
```

---

## Plan de Implementación

1. **Creación de Migraciones SQL y Seed:**
   - Crear el archivo `supabase/migrations/20261023000000_create_games_and_scores_tables.sql` con el DDL de `profiles`, `games`, `scores`, triggers, índices y políticas RLS.
   - Crear `supabase/seed.sql` conteniendo los inserts iniciales de los 6 juegos de `data/games.ts` y puntuaciones de prueba representativas.

2. **Definición de Tipos y DTOs (`types/database.ts`):**
   - Implementar los tipos TypeScript para las entidades de base de datos y compatibilidad con `types/leaderboard.ts` y `types/game.ts`.

3. **Capa de Servicios de Acceso a Datos (`lib/services/leaderboard.ts` y `lib/services/games.ts`):**
   - Implementar funciones que utilicen `createClient` de `lib/supabase/server.ts`.
   - Realizar query a Supabase:
     - Selección de `scores` haciendo join con `profiles` y `games`.
     - Manejo de filtros opcionales por `gameId`.
   - Implementar bloque `try/catch` con fallback automático hacia `LEADERBOARD_ENTRIES` (`data/leaderboard.ts`) y `GAMES` (`data/games.ts`) ante cualquier error de conexión o entorno sin configurar.

4. **Conexión de la Página `/leaderboard` (`app/leaderboard/page.tsx`):**
   - Convertir la carga de datos en `app/leaderboard/page.tsx` para consumir asíncronamente los servicios del servidor.
   - Actualizar filtros dinámicos de juegos según la lista devuelta por la base de datos.
   - Garantizar que los estados de carga y visualización de medallas (top 3) funcionen tanto con datos de Supabase como con el fallback mock.

5. **Verificación y Pruebas:**
   - Probar la compilación completa del proyecto con `npm run build`.
   - Ejecutar linter con `npm run lint`.
   - Verificar visualmente la renderización de la página `/leaderboard` en navegador.

---

## Criterios de Aceptación

- [ ] Archivo de migración `supabase/migrations/20261023000000_create_games_and_scores_tables.sql` creado con sintaxis PostgreSQL válida para `profiles`, `games`, `scores`, trigger de registro y RLS habilitado.
- [ ] Archivo `supabase/seed.sql` creado con los juegos de `data/games.ts` y récords de prueba.
- [ ] Tipos TypeScript definidos en `types/database.ts` sin errores de compilación (`strict: true`).
- [ ] Servicios de consulta en `lib/services/` capaces de consultar Supabase mediante join (`scores` + `profiles` + `games`).
- [ ] Sistema de fallback funcional: si las variables de entorno de Supabase no están presentes o la tabla no responde, la página `/leaderboard` muestra los datos mock sin crashear.
- [ ] La página `/leaderboard` renderiza dinámicamente las entradas de clasificación y el selector de juegos.
- [ ] `npm run build` y `npm run lint` finalizan con código de salida 0.

---

## Decisiones Tomadas y Descartadas

- **Histórico de puntuaciones (`scores`) vs Solo récord máximo:**  
  _Decisión:_ Se utiliza una tabla histórica de `scores` con índices optimizados en lugar de sobrescribir un único high-score por usuario.  
  _Justificación:_ Permite calcular rankings globales, análisis de actividad reciente, mejores marcas personales y torneos por periodo sin pérdida de telemetría histórica.

- **Tabla `profiles` vinculada a `auth.users` mediante trigger:**  
  _Decisión:_ Crear la tabla `profiles` sincronizada automáticamente con `auth.users` a través de un trigger `handle_new_user()`.  
  _Justificación:_ Desacopla la lógica pública de gamerTags y avatares del esquema protegido `auth`, permitiendo consultas públicas seguras para el leaderboard mediante RLS sin exponer correos ni datos privados.

- **Estructura en `supabase/migrations/`:**  
  _Decisión:_ Organizar los scripts en migraciones versionadas y archivo `seed.sql` estándar de Supabase CLI.  
  _Justificación:_ Sigue las mejores prácticas del ecosistema Supabase para facilitar la ejecución tanto local (`supabase start` / `supabase db push`) como remota en el panel cloud.

- **Fallback resiliente en servidor:**  
  _Decisión:_ Envolver las consultas a Supabase en funciones con fallback automático a los datos mock de `data/`.  
  _Justificación:_ Permite continuar el desarrollo y las pruebas en entornos donde la instancia remota de Supabase aún no tiene aplicadas las migraciones o no cuenta con conexión a internet.

---

## Riesgos Identificados y Mitigaciones

- **Riesgo:** Consultas lentas o escaneos secuenciales en la tabla `scores` a medida que crezca el número de partidas jugadas.  
  _Mitigación:_ Se crearon índices explícitos `idx_scores_game_score` (`game_id`, `score DESC`) y limitación por defecto (`LIMIT 50`) en las consultas de ranking.

- **Riesgo:** Usuarios sin perfil creado si el trigger falla durante registros anteriores.  
  _Mitigación:_ La función de trigger utiliza `COALESCE` con valores por defecto y las consultas usan `LEFT JOIN` con perfil fallback en TypeScript.
