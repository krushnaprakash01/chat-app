import React from 'react';
import { RoomId, User } from '../types/chat';
import { INITIAL_ROOMS } from '../utils/storage';
import { getInitials } from '../utils/avatars';
import { HashIcon, LogOutIcon, XIcon, MessageSquareIcon } from './Icons';

interface SidebarProps {
  currentRoom: RoomId;
  onSelectRoom: (roomId: RoomId) => void;
  currentUser: User;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
  unreadCounts: Record<RoomId, number>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoom,
  onSelectRoom,
  currentUser,
  onLogout,
  isOpen,
  onClose,
  unreadCounts,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-[#121212] border-r border-[#262626] flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top App Header */}
        <div>
          <div className="h-16 px-4 border-b border-[#262626] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#333333] flex items-center justify-center text-[#4ade80]">
                <MessageSquareIcon size={18} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-wide text-[#f2f2f2]">DevChat</span>
                  <span className="inline-block w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
                </div>
                <span className="text-[11px] text-[#8c8c8c] block -mt-0.5">Real-time Workspace</span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8c8c8c] hover:text-[#f2f2f2] hover:bg-[#1a1a1a] md:hidden transition-colors"
              aria-label="Close menu"
            >
              <XIcon size={18} />
            </button>
          </div>

          {/* Rooms Navigation */}
          <div className="p-3">
            <div className="px-3 pt-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[#8c8c8c]">
              Channels
            </div>
            <nav className="space-y-1">
              {INITIAL_ROOMS.map((room) => {
                const isActive = currentRoom === room.id;
                const unread = unreadCounts[room.id] || 0;

                return (
                  <button
                    key={room.id}
                    onClick={() => {
                      onSelectRoom(room.id);
                      onClose();
                    }}
                    className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-[#1c1c1c] text-[#4ade80] shadow-sm'
                        : 'text-[#8c8c8c] hover:bg-[#181818] hover:text-[#f2f2f2]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <HashIcon
                        size={17}
                        className={`shrink-0 transition-colors ${
                          isActive ? 'text-[#4ade80]' : 'text-[#8c8c8c] group-hover:text-[#f2f2f2]'
                        }`}
                      />
                      <span className="truncate">{room.name}</span>
                    </div>

                    {/* Unread Pill or Active Dot */}
                    {unread > 0 && !isActive ? (
                      <span className="px-1.5 py-0.5 rounded-full bg-[#4ade80] text-[#0a0a0a] text-xs font-bold shrink-0">
                        {unread}
                      </span>
                    ) : isActive ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] shrink-0" />
                    ) : null}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Current User Card at Bottom */}
        <div className="p-3 border-t border-[#262626] bg-[#0e0e0e]">
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#161616] border border-[#222222]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-[#0a0a0a]"
                style={{ backgroundColor: currentUser.avatarColor }}
              >
                {getInitials(currentUser.username)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#f2f2f2] truncate">
                  {currentUser.username}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                  <span className="text-[11px] text-[#8c8c8c]">Active now</span>
                </div>
              </div>
            </div>

            {/* Logout / Switch User Button */}
            <button
              onClick={onLogout}
              title="Sign out"
              className="p-1.5 text-[#8c8c8c] hover:text-red-400 hover:bg-[#202020] rounded-lg transition-colors shrink-0"
              aria-label="Sign out"
            >
              <LogOutIcon size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
