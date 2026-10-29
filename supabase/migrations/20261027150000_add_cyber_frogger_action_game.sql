-- ============================================================================
-- Migración Incremental: Registro y Sembrado de Cyber-Frogger Action (Spec GJ-01)
-- Archivo: supabase/migrations/20261027150000_add_cyber_frogger_action_game.sql
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
  'cyber-frogger-action',
  'CYBER-FROGGER: DATA HIGHWAY',
  'ARCADE ACTION',
  ARRAY['action-maze', 'classics-80s'],
  2026,
  'Pilota el micro-dron Cyber-Frog a través de autopistas de tráfico corrupto y refrigerante de plasma para infiltrar 5 Nodos Maestros.',
  'GAME JAM ''26',
  'secondary',
  'DIFÍCIL',
  'frogger',
  18400
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  category_keys = EXCLUDED.category_keys,
  description = EXCLUDED.description,
  badge = EXCLUDED.badge,
  art_type = EXCLUDED.art_type;

-- 2. Sembrar récords iniciales de prueba para el Leaderboard
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM public.profiles LIMIT 1;
  
  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.scores (user_id, game_id, score, accuracy, combo)
    VALUES 
      (v_user_id, 'cyber-frogger-action', 142500, '99%', 'x32'),
      (v_user_id, 'cyber-frogger-action', 128400, '95%', 'x24'),
      (v_user_id, 'cyber-frogger-action', 96000, '90%', 'x18'),
      (v_user_id, 'cyber-frogger-action', 82300, '88%', 'x14'),
      (v_user_id, 'cyber-frogger-action', 64500, '82%', 'x10')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
