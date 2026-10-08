import { lazy } from 'react';

// Single source for route chunks, so React.lazy and prefetching share one import() per screen.
export const routeLoaders = {
  home: () => import('../screens/HomeScreen.js'),
  game: () => import('../screens/GameScreen.js'),
  crisis: () => import('../screens/CrisisScreen.js'),
  gameOver: () => import('../screens/GameOverScreen.js'),
  leaderboard: () => import('../screens/LeaderboardScreen.js'),
  history: () => import('../screens/HistoryScreen.js'),
  presidentSelect: () => import('../screens/PresidentSelectScreen.js'),
  auth: () => import('../screens/AuthScreen.js'),
  register: () => import('../screens/RegisterScreen.js'),
  login: () => import('../screens/LoginScreen.js'),
  profile: () => import('../screens/ProfileScreen.js'),
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

export function prefetchRoutesWhenIdle(names: RouteName[]) {
  const run = () => names.forEach(prefetchRoute);
  if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 3000 });
  else setTimeout(run, 1500);
}
