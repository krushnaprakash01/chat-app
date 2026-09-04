import React, { useState } from 'react';
import { User } from '../types/chat';
import { createNewUser, saveStoredUser } from '../utils/storage';
import { getAvatarColor, getInitials } from '../utils/avatars';
import { SparklesIcon, MessageSquareIcon } from './Icons';

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
}

const SUGGESTIONS = ['CodeNinja', 'CyberPilot', 'PixelDev', 'DevGuru', 'CloudWalker'];

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const trimmed = username.trim();
  const avatarColor = trimmed ? getAvatarColor(trimmed) : '#4ade80';
  const initials = trimmed ? getInitials(trimmed) : 'DC';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmed) {
      setError('Please enter a display name');
      return;
    }
    if (trimmed.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    if (trimmed.length > 20) {
      setError('Name must be 20 characters or less');
      return;
    }

    const newUser = createNewUser(trimmed);
    saveStoredUser(newUser);
    onLoginSuccess(newUser);
  };

  const handleSelectSuggestion = (suggested: string) => {
    setUsername(suggested);
    setError('');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-[#0a0a0a] text-[#f2f2f2] z-50">
      {/* Subtle glowing ambient background effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#4ade80]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-[#121212] border border-[#262626] rounded-2xl p-6 sm:p-8 shadow-2xl">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1a1a1a] border border-[#333333] mb-3 shadow-inner">
            <MessageSquareIcon size={28} className="text-[#4ade80]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#f2f2f2]">
            Welcome to <span className="text-[#4ade80]">DevChat</span>
          </h1>
          <p className="text-sm text-[#8c8c8c] mt-1">
            Real-time developer chat room. Enter your display name to start chatting.
          </p>
        </div>

        {/* Dynamic Avatar Preview */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg transition-all duration-300 transform"
            style={{
              backgroundColor: avatarColor,
              color: '#0a0a0a',
              boxShadow: `0 0 20px ${avatarColor}40`,
            }}
          >
            {initials}
          </div>
          <span className="text-xs text-[#8c8c8c] mt-2 font-mono">
            {trimmed ? `@${trimmed}` : 'Preview your avatar'}
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-xs font-semibold uppercase tracking-wider text-[#8c8c8c] mb-1.5">
              Display Name
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Alex, CyberPilot, Maya"
              autoFocus
              maxLength={20}
              className="w-full bg-[#0a0a0a] border border-[#262626] rounded-xl px-4 py-3 text-sm text-[#f2f2f2] placeholder-[#8c8c8c]/50 focus:outline-none focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] transition-colors"
            />
            {error && (
              <p className="text-xs text-red-400 mt-1.5 font-medium flex items-center gap-1">
                <span>⚠</span> {error}
              </p>
            )}
          </div>

          {/* Suggested Quick Handles */}
          <div>
            <p className="text-xs text-[#8c8c8c] mb-2 flex items-center gap-1">
              <SparklesIcon size={13} className="text-[#4ade80]" />
              Quick Suggestions:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => handleSelectSuggestion(item)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-[#1a1a1a] hover:bg-[#262626] text-[#8c8c8c] hover:text-[#f2f2f2] border border-[#262626] transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-[#4ade80] hover:bg-[#22c55e] text-[#0a0a0a] font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform active:scale-[0.99] shadow-lg shadow-[#4ade80]/20 flex items-center justify-center gap-2"
          >
            <span>Join Chat</span>
            <span className="text-lg">→</span>
          </button>
        </form>

        {/* Feature Highlights Footer */}
        <div className="mt-6 pt-5 border-t border-[#262626]/80 grid grid-cols-3 text-center gap-2">
          <div className="p-2 rounded-lg bg-[#0a0a0a]/50">
            <span className="text-xs font-mono text-[#4ade80] block">#general</span>
            <span className="text-[10px] text-[#8c8c8c]">Hangout</span>
          </div>
          <div className="p-2 rounded-lg bg-[#0a0a0a]/50">
            <span className="text-xs font-mono text-[#4ade80] block">#tech-talk</span>
            <span className="text-[10px] text-[#8c8c8c]">Code & Tools</span>
          </div>
          <div className="p-2 rounded-lg bg-[#0a0a0a]/50">
            <span className="text-xs font-mono text-[#4ade80] block">#random</span>
            <span className="text-[10px] text-[#8c8c8c]">Memes & Fun</span>
          </div>
        </div>
      </div>
    </div>
  );
};
