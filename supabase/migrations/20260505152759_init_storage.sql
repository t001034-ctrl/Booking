-- Public storage bucket for car listing photos. Files are uploaded by
-- server actions using the service role; reads use the public URL.

insert into storage.buckets (id, name, public)
values ('car-images', 'car-images', true)
on conflict (id) do nothing;
