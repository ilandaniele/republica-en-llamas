import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

const APP_NAME = 'República en Llamas';

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Inicio',
  '/debate': 'Práctica de debate',
  '/president': 'Elegí presidente',
  '/game': 'Partida',
  '/gameover': 'Fin de la partida',
  '/leaderboard': 'Ranking',
  '/history': 'Historial',
  '/auth': 'Cuenta',
  '/register': 'Registro',
  '/login': 'Iniciar sesión',
  '/reset-password': 'Restablecer contraseña',
  '/profile': 'Perfil',
};

function focusPageHeading() {
  const target = document.querySelector<HTMLElement>('h1, main');
  if (!target) return;
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}

export function RouteFocus() {
  const { pathname } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    const section = ROUTE_TITLES[pathname];
    document.title = section ? `${section} · ${APP_NAME}` : APP_NAME;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const frame = requestAnimationFrame(focusPageHeading);
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
