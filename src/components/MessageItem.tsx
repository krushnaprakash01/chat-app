import React, { useState } from 'react';
import { Message } from '../types/chat';
import { formatTime, getInitials } from '../utils/avatars';
import { SmileIcon } from './Icons';

interface MessageItemProps {
  message: Message;
  currentUsername: string;
  onReact: (messageId: string, emoji: string) => void;
}

const QUICK_REACTIONS = ['👍', '❤️', '🔥', '🚀', '😂', '💡'];

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  currentUsername,
  onReact,
}) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const isMe = message.username.toLowerCase() === currentUsername.toLowerCase();
  const reactions = message.reactions || {};

  // Simple formatter for backtick code blocks
  const renderMessageContent = (text: string) => {
    // If message contains code blocks or inline code, format it nicely
    const parts = text.split(/(`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded bg-[#1f1f1f] text-[#4ade80] font-mono text-xs border border-[#2e2e2e]"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div
      className={`group relative flex gap-3 px-4 py-2 hover:bg-[#141414] transition-colors rounded-xl ${
        isMe ? 'bg-[#101010]/60' : ''
      }`}
    >
      {/* User Avatar */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-[#0a0a0a] shadow-sm select-none mt-0.5"
        style={{ backgroundColor: message.userColor }}
      >
        {getInitials(message.username)}
      </div>

      {/* Message Body */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-semibold text-xs sm:text-sm text-[#f2f2f2]">
            {message.username}
          </span>

          {isMe && (
            <span className="px-1.5 py-0.2 rounded bg-[#4ade80]/15 text-[#4ade80] text-[10px] font-bold border border-[#4ade80]/30">
              YOU
            </span>
          )}

          <span className="text-[11px] text-[#8c8c8c]">
            {formatTime(message.timestamp)}
          </span>
        </div>

        {/* Message Text */}
        <div className="text-sm text-[#f2f2f2] leading-relaxed break-words whitespace-pre-wrap">
          {renderMessageContent(message.text)}
        </div>

        {/* Reactions List */}
        {Object.keys(reactions).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {Object.entries(reactions).map(([emoji, users]) => {
              if (!users || users.length === 0) return null;
              const hasReacted = users.includes(currentUsername);

              return (
                <button
                  key={emoji}
                  onClick={() => onReact(message.id, emoji)}
                  title={users.join(', ')}
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs transition-all border ${
                    hasReacted
                      ? 'bg-[#4ade80]/15 border-[#4ade80]/40 text-[#4ade80]'
                      : 'bg-[#1a1a1a] border-[#2c2c2c] text-[#8c8c8c] hover:border-[#383838] hover:text-[#f2f2f2]'
                  }`}
                >
                  <span className="text-xs">{emoji}</span>
                  <span className="text-[11px] font-medium">{users.length}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Quick Action Toolbar (on hover) */}
      <div className="absolute top-1 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-[#1c1c1c] border border-[#2e2e2e] rounded-lg p-1 shadow-lg z-20">
        {QUICK_REACTIONS.slice(0, 3).map((emoji) => (
          <button
            key={emoji}
            onClick={() => onReact(message.id, emoji)}
            className="w-7 h-7 flex items-center justify-center text-xs hover:bg-[#262626] rounded transition-transform active:scale-125"
            title={`React ${emoji}`}
          >
            {emoji}
          </button>
        ))}

        <div className="relative">
          <button
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            className="w-7 h-7 flex items-center justify-center text-[#8c8c8c] hover:text-[#f2f2f2] hover:bg-[#262626] rounded transition-colors"
            title="More reactions"
          >
            <SmileIcon size={14} />
          </button>

          {showReactionPicker && (
            <div className="absolute right-0 top-full mt-1 bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl p-2 shadow-2xl flex gap-1 z-30 animate-fadeIn">
              {QUICK_REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onReact(message.id, emoji);
                    setShowReactionPicker(false);
                  }}
                  className="w-8 h-8 flex items-center justify-center text-base hover:bg-[#262626] rounded-lg transition-transform active:scale-125"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
