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
