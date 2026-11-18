export const RUN_SAVE_ES: Record<string, string> = {
  'runSave.unsaved.daily_cap':
    'Llegaste al límite diario de partidas guardadas. Esta partida se juega sin guardar.',
  'runSave.unsaved.rate_limit':
    'Empezaste demasiadas partidas seguidas. Esta se juega sin guardar; esperá un minuto antes de la próxima.',
  'runSave.unsaved.network': 'No pudimos conectar con el servidor. Esta partida se juega sin guardar.',
  'runSave.unsaved.unavailable': 'El servidor no respondió. Esta partida se juega sin guardar.',
  'runSave.saveFailed': 'No se pudo guardar la partida. Revisá tu conexión y volvé a intentar.',
  'runSave.saveRateLimited': 'Demasiados intentos de guardado. Esperá un minuto y volvé a intentar.',
};

export const RUN_SAVE_EN: Record<string, string> = {
  'runSave.unsaved.daily_cap': 'You reached the daily limit of saved runs. This run will not be saved.',
  'runSave.unsaved.rate_limit':
    'You started too many runs in a row. This one will not be saved; wait a minute before the next.',
  'runSave.unsaved.network': 'We could not reach the server. This run will not be saved.',
  'runSave.unsaved.unavailable': 'The server did not respond. This run will not be saved.',
  'runSave.saveFailed': 'The run could not be saved. Check your connection and try again.',
  'runSave.saveRateLimited': 'Too many save attempts. Wait a minute and try again.',
};
