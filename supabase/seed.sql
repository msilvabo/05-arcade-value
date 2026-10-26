-- Seed inicial de Juegos del Arcade
INSERT INTO public.games (id, title, category, category_keys, year, description, badge, badge_variant, difficulty, art_type, plays_count)
VALUES
  (
    'arkanoid-neon-revenge',
    'ARKANOID: NEON REVENGE',
    'PUZZLE / ACCIÓN',
    ARRAY['puzzle', 'action-maze', 'classics-80s'],
    1986,
    'Destruye la barrera dimensional reflejando la esfera de energía cósmica.',
    'TORNEO ACTIVO',
    'secondary',
    'DIFÍCIL',
    'arkanoid',
    52000
  ),
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
    'space-invaders-galaxy',
    'SPACE INVADERS: GALAXY',
    'SHOOT ''EM UP',
    ARRAY['shoot-em-up', 'classics-80s', 'popular'],
    1978,
    'Defiende los últimos bastiones terrestres de la invasión alienígena pixelada.',
    'HARDCORE',
    'surface',
    'HARDCORE',
    'space-invaders',
    41000
  ),
  (
    'pacman-neon-maze',
    'PAC-MAN: NEON MAZE',
    'LABERINTO',
    ARRAY['action-maze', 'classics-80s', 'popular'],
    1980,
    'Devora todos los puntos cuánticos esquivando a los cuatro espectros cibernéticos.',
    'PERFECT SCORE',
    'tertiary',
    'DIFÍCIL',
    'pacman',
    36000
  ),
  (
    'chrono-snake',
    'CHRONO SNAKE',
    'ARCADE PUZZLE',
    ARRAY['puzzle', 'action-maze'],
    1997,
    'Aliméntate de condensadores de pulso y desafía los límites del hiper-espacio.',
    'MULTI-PULSO',
    'surface',
    'NORMAL',
    'snake',
    29000
  ),
  (
    'asteroids-2084',
    'ASTEROIDS 2084',
    'VECTOR COMBAT',
    ARRAY['shoot-em-up', 'classics-80s'],
    1979,
    'Navega y sobrevive a una tormenta de asteroides en gravedad cero espacial.',
    'VECTOR MONO',
    'surface',
    'DIFÍCIL',
    'asteroids',
    22000
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  category_keys = EXCLUDED.category_keys,
  year = EXCLUDED.year,
  description = EXCLUDED.description,
  badge = EXCLUDED.badge,
  badge_variant = EXCLUDED.badge_variant,
  difficulty = EXCLUDED.difficulty,
  art_type = EXCLUDED.art_type,
  plays_count = EXCLUDED.plays_count;

-- Usuarios de prueba en auth.users (para desarrollo local y pruebas)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
    VALUES
      ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'cyber_ghost@arcade.local', '', now(), '{"provider":"email","providers":["email"]}', '{"gamer_tag":"CYBER_GHOST"}', now(), now()),
      ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'neon_valkyrie@arcade.local', '', now(), '{"provider":"email","providers":["email"]}', '{"gamer_tag":"NEON_VALKYRIE"}', now(), now()),
      ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'retro_blaster@arcade.local', '', now(), '{"provider":"email","providers":["email"]}', '{"gamer_tag":"RETRO_BLASTER"}', now(), now()),
      ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'pixel_knight@arcade.local', '', now(), '{"provider":"email","providers":["email"]}', '{"gamer_tag":"PIXEL_KNIGHT"}', now(), now()),
      ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'chrono_runner@arcade.local', '', now(), '{"provider":"email","providers":["email"]}', '{"gamer_tag":"CHRONO_RUNNER"}', now(), now())
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- Perfiles de prueba
INSERT INTO public.profiles (id, gamer_tag, avatar_url)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'CYBER_GHOST', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBz-vdQ3Q2cnGTmiDjnkh9qff42xJdMVvxSmMmEn8aQZKznXKtxzyA963ahkXgHUdC40znYzWqk2YIYLP6iZo1LiXf_-qSHTHVYMd2wtz-qGCE2N9Td5xEcln0T4dut3K0ELT4nJlPI-IdzMflh7lIa58JofE9ah58A7i16Nq1WnVhgLviDZB9eBfsu4RnXc0lwDZeuIijec-opVy7WCQ0fb0G-1qh1YlzrFGCmHaHqRqbBDEaK2SjwvA'),
  ('00000000-0000-0000-0000-000000000002', 'NEON_VALKYRIE', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDghPJiTPZndS_0AK8c0vfgeK0PdPllmefCNuaqMks570Rw5MLkz6PzAfHOO85EbPqTWuKiDDO-yWcUsZVZ5WHHKiQKT-V16VdktvjScOfzwQDr6ILIYdrZSpyroMHllHl2jGhZI3xUKLQKCM1ePQs_LTU9WYC_oXC2qGx561c4isXyP154TzfQnPFzc6vEga-hF0zCG5zpxuWXIV7GvGuPqtMETZZNhPZXVIFlScZzjypFIprgkUKNsA'),
  ('00000000-0000-0000-0000-000000000003', 'RETRO_BLASTER', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDz0kmmDaEFKBgQspVYK33wXs97WWGI_VzQGWxuqwloKpGlMz04Fp5GoEloFUVgo9UTxvbKtizYrRDj5vlcReUne7CycezW72z5G8gkQYbStlQiB1NMNNS54it1-sZS8BTI1TX7e0qUFhyCnY1B0evp3amSrO9JqIgPpGCBaDSSzjQZdpqEgmkNb_15Zq8AK78BigLL8yjRNs-I0nh3uc4j4A-vT1UXgfpCzLz33VndEdM68QzF5JEp-g'),
  ('00000000-0000-0000-0000-000000000004', 'PIXEL_KNIGHT', ''),
  ('00000000-0000-0000-0000-000000000005', 'CHRONO_RUNNER', '')
ON CONFLICT (id) DO UPDATE SET
  gamer_tag = EXCLUDED.gamer_tag,
  avatar_url = EXCLUDED.avatar_url;

-- Puntuaciones de prueba representativas para Leaderboard
INSERT INTO public.scores (user_id, game_id, score, accuracy, combo)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'arkanoid-neon-revenge', 984520, '100%', 'x99'),
  ('00000000-0000-0000-0000-000000000002', 'arkanoid-neon-revenge', 892140, '98%', 'x64'),
  ('00000000-0000-0000-0000-000000000003', 'arkanoid-neon-revenge', 810000, '95%', 'x48'),
  ('00000000-0000-0000-0000-000000000004', 'arkanoid-neon-revenge', 765400, '92%', 'x42'),
  ('00000000-0000-0000-0000-000000000005', 'arkanoid-neon-revenge', 712300, '90%', 'x36'),
  ('00000000-0000-0000-0000-000000000001', 'asteroids-2084', 231800, '97%', 'x22'),
  ('00000000-0000-0000-0000-000000000002', 'asteroids-2084', 198400, '94%', 'x18'),
  ('00000000-0000-0000-0000-000000000003', 'asteroids-2084', 165200, '89%', 'x15'),
  ('00000000-0000-0000-0000-000000000001', 'cyber-tetris-99', 412900, '99%', 'x45'),
  ('00000000-0000-0000-0000-000000000004', 'space-invaders-galaxy', 154600, '93%', 'x20');
