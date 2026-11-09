import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router';
import { authClient } from '../../lib/auth.js';

export default function PasswordResetScreen() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token || saving) return;
    if (password.length < 12 || password.length > 128) {
      setError('Usá entre 12 y 128 caracteres.');
      return;
    }
    if (password !== confirmation) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const { error: updateError } = await authClient.resetPassword({ newPassword: password, token });
      if (updateError) {
        setError('No se pudo actualizar la contraseña. Pedí un enlace nuevo e intentá otra vez.');
        return;
      }
      setPassword('');
      setConfirmation('');
      setSaved(true);
    } catch {
      setError('No se pudo completar la operación. Revisá tu conexión e intentá nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto max-w-lg p-6">
      <h1 className="mb-5 text-3xl text-gold-400">Restablecer contraseña</h1>
      {error && (
        <p role="alert" className="text-crimson-300 mb-4 text-xl">
          {error}
        </p>
      )}
      {saved ? (
        <p role="status" className="mb-4 text-xl">
          Contraseña actualizada. Iniciá sesión con la nueva contraseña.
        </p>
      ) : token ? (
        <form
          onSubmit={(event) => {
            void submit(event);
          }}
          className="space-y-4"
        >
          <p>Usá una contraseña única de al menos 12 caracteres.</p>
          <label className="block">
            Nueva contraseña
            <input
              type="password"
              autoComplete="new-password"
              minLength={12}
              maxLength={128}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 block w-full border-2 border-celeste-dark bg-navy-800 p-3 text-xl"
            />
          </label>
          <label className="block">
            Confirmar contraseña
            <input
              type="password"
              autoComplete="new-password"
              minLength={12}
              maxLength={128}
              required
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              className="mt-2 block w-full border-2 border-celeste-dark bg-navy-800 p-3 text-xl"
            />
          </label>
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-gold-400 p-3 text-xl text-navy-900 disabled:opacity-50"
          >
            {saving ? 'Actualizando...' : 'Actualizar contraseña'}
          </button>
        </form>
      ) : (
        <p role="alert" className="mb-4 text-xl">
          El enlace no es válido, ya se usó o venció. Pedí otro desde el inicio de sesión.
        </p>
      )}
      <Link to="/login" className="mt-5 inline-block text-xl text-celeste-light">
        Volver a iniciar sesión
      </Link>
    </main>
  );
}
