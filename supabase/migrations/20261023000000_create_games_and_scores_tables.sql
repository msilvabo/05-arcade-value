-- 1. Perfiles de usuario vinculados a auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  gamer_tag TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger para crear perfil automático al registrarse un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, gamer_tag, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'gamer_tag', 'PLAYER_' || substring(new.id::text, 1, 6)),
    COALESCE(new.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    gamer_tag = EXCLUDED.gamer_tag,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = timezone('utc'::text, now());
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

-- 3. Tabla de Puntuaciones Históricas (Soporta usuarios autenticados e invitados con nickname libre)
CREATE TABLE IF NOT EXISTS public.scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  player_name TEXT,
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

-- Políticas de RLS para profiles
DROP POLICY IF EXISTS "Lectura pública de perfiles" ON public.profiles;
CREATE POLICY "Lectura pública de perfiles" ON public.profiles 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON public.profiles;
CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

-- Políticas de RLS para games
DROP POLICY IF EXISTS "Lectura pública de juegos" ON public.games;
CREATE POLICY "Lectura pública de juegos" ON public.games 
  FOR SELECT USING (true);

-- Políticas de RLS para scores
DROP POLICY IF EXISTS "Lectura pública de puntuaciones" ON public.scores;
CREATE POLICY "Lectura pública de puntuaciones" ON public.scores 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir registro libre de puntuaciones" ON public.scores;
CREATE POLICY "Permitir registro libre de puntuaciones" ON public.scores 
  FOR INSERT WITH CHECK (true);
