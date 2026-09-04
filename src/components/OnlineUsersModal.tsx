import React from 'react';
import { RoomId, User } from '../types/chat';
import { getPeersForRoom } from '../utils/simulation';
import { getInitials } from '../utils/avatars';
import { UsersIcon, XIcon } from './Icons';

interface OnlineUsersModalProps {
  roomId: RoomId;
  roomName: string;
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
  onlineCount: number;
}

export const OnlineUsersModal: React.FC<OnlineUsersModalProps> = ({
  roomId,
  roomName,
  currentUser,
  isOpen,
  onClose,
  onlineCount,
}) => {
  if (!isOpen) return null;

  const peers = getPeersForRoom(roomId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-md bg-[#121212] border border-[#262626] rounded-2xl p-5 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#262626] flex items-center justify-center text-[#4ade80]">
              <UsersIcon size={16} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#f2f2f2]">
                Members in #{roomName}
              </h3>
              <p className="text-xs text-[#8c8c8c]">
                {onlineCount} active developers currently online
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#8c8c8c] hover:text-[#f2f2f2] hover:bg-[#1f1f1f] rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* Member List */}
        <div className="overflow-y-auto py-3 space-y-2 flex-1">
          {/* Current User */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#181818] border border-[#2e2e2e]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-[#0a0a0a]"
                  style={{ backgroundColor: currentUser.avatarColor }}
                >
                  {getInitials(currentUser.username)}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#4ade80] ring-2 ring-[#121212]" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#f2f2f2] truncate">
                    {currentUser.username}
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-[#4ade80]/15 text-[#4ade80] text-[10px] font-bold border border-[#4ade80]/30">
                    YOU
                  </span>
                </div>
                <p className="text-xs text-[#8c8c8c] truncate">Active in this session</p>
              </div>
            </div>
          </div>

          {/* Section Divider */}
          <div className="px-2 pt-2 text-[11px] font-semibold uppercase tracking-wider text-[#8c8c8c]">
            Online Room Peers ({peers.length})
          </div>

          {/* Simulated Active Peers */}
          {peers.map((peer) => (
            <div
              key={peer.id}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#181818] border border-transparent hover:border-[#222222] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-[#0a0a0a]"
                    style={{ backgroundColor: peer.color }}
                  >
                    {getInitials(peer.username)}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#4ade80] ring-2 ring-[#121212]" />
                </div>

                <div className="min-w-0">
                  <span className="text-sm font-semibold text-[#f2f2f2] block truncate">
                    {peer.username}
                  </span>
                  <p className="text-xs text-[#8c8c8c] truncate">{peer.tagline}</p>
                </div>
              </div>

              <span className="text-[11px] font-mono text-[#4ade80] px-2 py-0.5 rounded bg-[#4ade80]/10 border border-[#4ade80]/20 shrink-0">
                Online
              </span>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-[#262626] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1c1c1c] hover:bg-[#262626] text-xs font-semibold text-[#f2f2f2] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
