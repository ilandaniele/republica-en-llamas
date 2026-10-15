import { useState } from 'react';
import { MIN_USERNAME_LENGTH } from '../useUsernameAvailability.js';

interface ProfileHeaderProps {
  displayName: string;
  email: string | undefined;
  initialUsername: string;
  onRename: (username: string) => Promise<string | null>;
  onLogoutClick: () => void;
}

function generateAvatarColor(username: string): string {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 60%, 40%)`;
}

function UsernameEditor({
  initialUsername,
  onRename,
  onClose,
}: {
  initialUsername: string;
  onRename: ProfileHeaderProps['onRename'];
  onClose: () => void;
}) {
  const [newUsername, setNewUsername] = useState(initialUsername);
  const [usernameError, setUsernameError] = useState('');

  const handleSave = async () => {
    if (newUsername.trim().length < MIN_USERNAME_LENGTH) {
      setUsernameError('Al menos 3 caracteres');
      return;
    }
    const error = await onRename(newUsername);
    if (error) setUsernameError(error);
    else onClose();
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          className="rounded border border-navy-500 bg-navy-900 px-3 py-1 font-mono text-sm text-smoke-100 focus:border-gold-500 focus:outline-none"
          // eslint-disable-next-line jsx-a11y/no-autofocus -- inline edit opened by explicit user click
          autoFocus
        />
        <button
          onClick={() => {
            void handleSave();
          }}
          className="font-mono text-xs text-gold-400 hover:text-gold-300"
        >
          Guardar
        </button>
        <button onClick={onClose} className="text-smoke-500 hover:text-smoke-300 font-mono text-xs">
          Cancelar
        </button>
      </div>
      {usernameError && <p className="mt-1 font-mono text-xs text-crimson-400">{usernameError}</p>}
    </>
  );
}

export function ProfileHeader({
  displayName,
  email,
  initialUsername,
  onRename,
  onLogoutClick,
}: ProfileHeaderProps) {
  const [editingUsername, setEditingUsername] = useState(false);

  return (
    <div className="pixel-border mb-6 flex items-center gap-6 bg-navy-800 p-6">
      <div
        className="pixel-border flex h-14 w-14 shrink-0 items-center justify-center text-xl font-bold text-white"
        style={{ backgroundColor: generateAvatarColor(displayName) }}
      >
        {displayName.slice(0, 2).toUpperCase()}
      </div>
      <div className="flex-1">
        {editingUsername ? (
          <UsernameEditor
            initialUsername={initialUsername}
            onRename={onRename}
            onClose={() => setEditingUsername(false)}
          />
        ) : (
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl font-bold text-smoke-100">{displayName}</h2>
            <button
              onClick={() => setEditingUsername(true)}
              className="font-mono text-xs text-smoke-600 hover:text-smoke-400"
            >
              ✎
            </button>
          </div>
        )}
        <p className="text-smoke-500 mt-1 font-mono text-xs">{email}</p>
      </div>
      <button
        onClick={onLogoutClick}
        className="shrink-0 rounded border border-navy-500 bg-navy-700 px-4 py-2 font-mono text-xs text-smoke-400 transition-colors hover:bg-navy-600"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
