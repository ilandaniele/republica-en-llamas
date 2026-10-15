import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { m } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth.js';
import { useGameStore } from '../../stores/gameStore.js';
import { profileUsernameQuery, useProfileUsername, useRecentRuns } from './useProfile.js';
import { ProfileHeader } from './profile/ProfileHeader.js';
import { ProfileStats } from './profile/ProfileStats.js';
import { RecentRunsList } from './profile/RecentRunsList.js';
import { LogoutModal } from './profile/LogoutModal.js';

function NoSession({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="text-center">
        <p className="mb-4 font-mono text-smoke-400">No hay sesión activa.</p>
        <button onClick={onBack} className="font-mono text-sm text-gold-400 underline">
          Volver al inicio
        </button>
      </div>
    </div>
  );
}

export default function ProfileScreen() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, signOut, updateUsername } = useAuth();
  const personalBest = useGameStore((s) => s.personalBest);
  const setUserId = useGameStore((s) => s.setUserId);

  const { data: profileUsername } = useProfileUsername(user?.id);
  const { data: runsPage, isLoading: loadingRuns } = useRecentRuns(user?.id);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  if (!user) return <NoSession onBack={() => navigate('/')} />;

  const metadataUsername = user.user_metadata?.['username'] as string | undefined;
  const displayName = profileUsername ?? metadataUsername ?? user.email ?? '?';
  const recentRuns = runsPage?.runs ?? [];

  const renameUsername = async (username: string) => {
    const { error } = await updateUsername(username);
    if (error) return error.message;
    await queryClient.invalidateQueries({ queryKey: profileUsernameQuery(user.id).queryKey });
    return null;
  };

  const handleLogout = async () => {
    await signOut();
    setUserId(null);
    navigate('/');
  };

  return (
    <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen p-6">
      <div className="mx-auto max-w-2xl">
        <button
          onClick={() => navigate(-1)}
          className="text-smoke-500 hover:text-smoke-300 mb-6 flex items-center gap-1 font-mono text-xs"
        >
          ← Volver
        </button>
        <ProfileHeader
          displayName={displayName}
          email={user.email}
          initialUsername={metadataUsername ?? ''}
          onRename={renameUsername}
          onLogoutClick={() => setShowLogoutModal(true)}
        />
        <ProfileStats recentRuns={recentRuns} totalRuns={runsPage?.total ?? 0} personalBest={personalBest} />
        <RecentRunsList runs={recentRuns} loading={loadingRuns} />
      </div>
      <LogoutModal
        open={showLogoutModal}
        onConfirm={() => {
          void handleLogout();
        }}
        onCancel={() => setShowLogoutModal(false)}
      />
    </m.div>
  );
}
