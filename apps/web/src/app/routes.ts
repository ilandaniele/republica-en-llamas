import { lazy } from 'react';

// Single source for route chunks, so React.lazy and prefetching share one import() per screen.
export const routeLoaders = {
  home: () => import('../features/home/HomeScreen.js'),
  game: () => import('../features/game/GameScreen.js'),
  crisis: () => import('../features/game/CrisisScreen.js'),
  gameOver: () => import('../features/game-over/GameOverScreen.js'),
  leaderboard: () => import('../features/leaderboard/LeaderboardScreen.js'),
  history: () => import('../features/history/HistoryScreen.js'),
  presidentSelect: () => import('../features/president-select/PresidentSelectScreen.js'),
  auth: () => import('../features/auth/AuthScreen.js'),
  register: () => import('../features/auth/RegisterScreen.js'),
  login: () => import('../features/auth/LoginScreen.js'),
  profile: () => import('../features/auth/ProfileScreen.js'),
};

export type RouteName = keyof typeof routeLoaders;

export const screens = {
  HomeScreen: lazy(routeLoaders.home),
  GameScreen: lazy(routeLoaders.game),
  CrisisScreen: lazy(routeLoaders.crisis),
  GameOverScreen: lazy(routeLoaders.gameOver),
  LeaderboardScreen: lazy(routeLoaders.leaderboard),
  HistoryScreen: lazy(routeLoaders.history),
  PresidentSelectScreen: lazy(routeLoaders.presidentSelect),
  AuthScreen: lazy(routeLoaders.auth),
  RegisterScreen: lazy(routeLoaders.register),
  LoginScreen: lazy(routeLoaders.login),
  ProfileScreen: lazy(routeLoaders.profile),
};

export function prefetchRoute(name: RouteName) {
  void routeLoaders[name]();
}

// Spread on a navigation control so its screen chunk loads on hover or focus, before the click.
export function prefetchOnIntent(name: RouteName) {
  const prefetch = () => prefetchRoute(name);
  return { onMouseEnter: prefetch, onFocus: prefetch };
}

export function prefetchRoutesWhenIdle(names: RouteName[]) {
  const run = () => names.forEach(prefetchRoute);
  if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 3000 });
  else setTimeout(run, 1500);
}
