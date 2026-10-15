import { m, AnimatePresence } from 'framer-motion';

interface LogoutModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function LogoutModal({ open, onConfirm, onCancel }: LogoutModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/90 p-6"
        >
          <m.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="pixel-border w-full max-w-sm bg-navy-800 p-6"
          >
            <h3
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '8px',
                color: 'var(--smoke-100)',
                marginBottom: '12px',
              }}
            >
              ¿Cerrar sesión?
            </h3>
            <p className="mb-6 font-mono text-xs text-smoke-400">
              Tu progreso guardado se mantendrá en el servidor. Podés volver cuando quieras.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onConfirm}
                className="pixel-border-crisis flex-1 px-4 py-2 text-smoke-100 transition-colors"
                style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }}
              >
                Cerrar sesión
              </button>
              <button
                onClick={onCancel}
                className="pixel-border text-smoke-300 flex-1 bg-navy-700 px-4 py-2 transition-colors hover:bg-navy-600"
                style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }}
              >
                Cancelar
              </button>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
