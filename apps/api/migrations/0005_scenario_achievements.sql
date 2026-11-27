create index game_runs_user_scenario_idx on game_runs (user_id, scenario_id)
  where completed_at is not null and scenario_id is not null;
