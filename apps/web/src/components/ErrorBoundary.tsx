import { Component, type ErrorInfo, type ReactNode } from 'react';

export function RecoveryScreen() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center gap-6 bg-navy-900 p-6 text-center text-smoke-100"
      role="alert"
    >
      <h1 className="font-serif text-sm text-gold-400">No pudimos cargar el juego</h1>
      <p className="max-w-md font-mono text-xl">
        Reintentá la carga. Tu partida guardada se conserva en este navegador.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="pixel-border-gold bg-navy-800 px-6 py-4 font-mono text-xl text-gold-400"
      >
        Volver a intentar
      </button>
      <a href="/" className="font-mono text-xl underline">
        Ir al inicio
      </a>
    </main>
  );
}

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Game rendering failed', error, info.componentStack);
  }
  render() {
    return this.state.failed ? <RecoveryScreen /> : this.props.children;
  }
}
