-- ============================================================================
-- Migración Base: Esquema Relacional de Profiles, Games y Scores (Spec 07)
-- ============================================================================

-- 1. Perfiles de usuario vinculados a auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Tabla de Juegos del Arcade
CREATE TABLE IF NOT EXISTS public.games (
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
CREATE TABLE IF NOT EXISTS public.scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0),
  accuracy TEXT DEFAULT '100%',
  combo TEXT DEFAULT 'x1',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices de consulta de alto rendimiento
CREATE INDEX IF NOT EXISTS idx_scores_game_score ON public.scores(game_id, score DESC);
CREATE INDEX IF NOT EXISTS idx_scores_user ON public.scores(user_id);

-- RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Lectura pública de perfiles') THEN
    CREATE POLICY "Lectura pública de perfiles" ON public.profiles FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Usuarios pueden actualizar su propio perfil') THEN
    CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON public.profiles FOR UPDATE USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'games' AND policyname = 'Lectura pública de juegos') THEN
    CREATE POLICY "Lectura pública de juegos" ON public.games FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'scores' AND policyname = 'Lectura pública de puntuaciones') THEN
    CREATE POLICY "Lectura pública de puntuaciones" ON public.scores FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'scores' AND policyname = 'Usuarios autenticados pueden registrar puntuaciones') THEN
    CREATE POLICY "Usuarios autenticados pueden registrar puntuaciones" ON public.scores FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- 4. Sembrado de Juegos del Catálogo Oficial
INSERT INTO public.games (id, title, category, category_keys, year, description, badge, badge_variant, difficulty, art_type, plays_count)
VALUES
  (
    'cyber-tetris-99',
    'CYBER TETRIS 99',
    'PUZZLE ESTRATÉGICO',
    ARRAY['puzzle', 'classics-80s', 'popular'],
    1984,
    'Encaja las matrices cuánticas antes de que el muro sature el búfer del sistema.',
    'MÁS POPULAR',
    'primary',
    'NORMAL',
    'tetris',
    48000
  ),
  (
    'asteroids-2084',
    'ASTEROIDS 2084',
    'SHOOT ''EM UP ESPACIAL',
    ARRAY['shoot-em-up', 'classics-80s', 'vector'],
    1979,
    'Sobrevive al cinturón de escombros cósmicos con física de inercia y armas de dispersión.',
    'CLÁSICO VECTOR',
    'secondary',
    'DIFÍCIL',
    'asteroids',
    34200
  ),
  (
    'arkanoid-neon-revenge',
    'ARKANOID: NEON REVENGE',
    'ACTION BREAKOUT',
    ARRAY['breakout', 'classics-80s'],
    1986,
    'Destruye barreras de neón con la nave Vaus y recoge cápsulas energéticas cuánticas.',
    'DESTACADO',
    'primary',
    'NORMAL',
    'arkanoid',
    51200
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  category_keys = EXCLUDED.category_keys,
  description = EXCLUDED.description,
  badge = EXCLUDED.badge;
