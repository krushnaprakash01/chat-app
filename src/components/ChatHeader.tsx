import React from 'react';
import { Room } from '../types/chat';
import { HashIcon, MenuIcon, UsersIcon, Trash2Icon } from './Icons';

interface ChatHeaderProps {
  room: Room;
  onlineCount: number;
  onToggleSidebar: () => void;
  onOpenMembers: () => void;
  onResetRoom: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  room,
  onlineCount,
  onToggleSidebar,
  onOpenMembers,
  onResetRoom,
}) => {
  return (
    <header className="h-16 px-4 bg-[#121212] border-b border-[#262626] flex items-center justify-between shrink-0 z-10 select-none">
      {/* Left: Mobile hamburger + Room info */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 -ml-1 text-[#8c8c8c] hover:text-[#f2f2f2] hover:bg-[#1a1a1a] rounded-lg md:hidden transition-colors"
          aria-label="Open channels menu"
        >
          <MenuIcon size={20} />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#262626] flex items-center justify-center text-[#4ade80] shrink-0">
            <HashIcon size={18} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-[#f2f2f2] truncate">
                {room.name}
              </h2>
            </div>
            <p className="text-xs text-[#8c8c8c] truncate hidden sm:block">
              {room.topic}
            </p>
          </div>
        </div>
      </div>

      {/* Right: Online user badge & action buttons */}
      <div className="flex items-center gap-2">
        {/* Simulated Online User Counter Button */}
        <button
          onClick={onOpenMembers}
          title="View active members"
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#181818] hover:bg-[#202020] border border-[#262626] text-xs font-medium text-[#f2f2f2] transition-colors"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ade80]" />
          </span>
          <UsersIcon size={14} className="text-[#8c8c8c]" />
          <span>{onlineCount} online</span>
        </button>

        {/* Clear/Reset Room Chat History */}
        <button
          onClick={onResetRoom}
          title="Reset room messages"
          className="p-2 rounded-lg text-[#8c8c8c] hover:text-red-400 hover:bg-[#1a1a1a] border border-transparent hover:border-[#262626] transition-colors"
          aria-label="Reset room messages"
        >
          <Trash2Icon size={16} />
        </button>
      </div>
    </header>
  );
};
