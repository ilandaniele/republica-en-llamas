-- Create game-images storage bucket (public)
insert into storage.buckets (id, name, public)
  values ('game-images', 'game-images', true)
  on conflict (id) do nothing;

-- Allow anyone to read files in game-images
create policy "Public read game-images"
  on storage.objects for select
  using (bucket_id = 'game-images');
