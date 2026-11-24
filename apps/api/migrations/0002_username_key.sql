alter table profiles add column username_key text;
update profiles set username_key = lower(username);
create unique index profiles_username_key_idx on profiles (username_key);
