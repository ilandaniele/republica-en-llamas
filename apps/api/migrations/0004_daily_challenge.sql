-- Daily challenge: tickets and runs carry the UTC day whose shared seed they use.
alter table run_tickets add column daily_date text;
alter table game_runs add column daily_date text;
create index game_runs_daily_score_idx on game_runs (daily_date, score desc)
  where daily_date is not null and completed_at is not null;
