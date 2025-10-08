-- Seed values for Dernier Metro API
-- Safe to re-run: upserts on conflict

INSERT INTO public.config(key, value) VALUES
  ('app.name',       '{"service":"dernier-metro-api"}'),
  ('metro.defaults', '{"line":"M1","headwayMin":3,"tz":"Europe/Paris"}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO public.config(key, value) VALUES
  ('metro.last', '{"châtelet":"23:45","bastille":"00:12","nation":"00:30"}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
