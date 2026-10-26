-- ============================================================================
-- Migración Incremental: Registro y Sembrado de Chrono Snake (Spec 09)
-- Archivo: supabase/migrations/20261026120000_add_chrono_snake_game.sql
-- ============================================================================

-- 1. Registrar o actualizar metadatos del juego en public.games
INSERT INTO public.games (
  id,
  title,
  category,
  category_keys,
  year,
  description,
  badge,
  badge_variant,
  difficulty,
  art_type,
  plays_count
) VALUES (
  'chrono-snake',
  'CHRONO SNAKE',
  'ARCADE PUZZLE',
  ARRAY['puzzle', 'action-maze'],
  1997,
  'Devora frutas cibernéticas del atlas cuántico y evita los muros sólidos de la cabina.',
  'CLÁSICO RETRO',
  'surface',
  'NORMAL',
  'snake',
  29000
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  category_keys = EXCLUDED.category_keys,
  description = EXCLUDED.description,
  badge = EXCLUDED.badge;

-- 2. Sembrar récords iniciales de prueba para el Leaderboard
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Intentar obtener el ID del primer perfil registrado
  SELECT id INTO v_user_id FROM public.profiles LIMIT 1;
  
  -- Si existe un perfil, insertar récords de prueba iniciales
  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.scores (user_id, game_id, score, accuracy, combo)
    VALUES 
      (v_user_id, 'chrono-snake', 87150, '100%', 'x50'),
      (v_user_id, 'chrono-snake', 72400, '98%', 'x42'),
      (v_user_id, 'chrono-snake', 58950, '95%', 'x33'),
      (v_user_id, 'chrono-snake', 43200, '91%', 'x25'),
      (v_user_id, 'chrono-snake', 29500, '86%', 'x18');
  END IF;
END $$;
