import React, { useEffect, useRef, useState } from 'react';
import { Message, Room } from '../types/chat';
import { formatDateSeparator } from '../utils/avatars';
import { MessageItem } from './MessageItem';
import { TypingIndicator } from './TypingIndicator';
import { HashIcon, ArrowDownIcon } from './Icons';

interface MessageListProps {
  room: Room;
  messages: Message[];
  currentUsername: string;
  typingUsers: string[];
  onReact: (messageId: string, emoji: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  room,
  messages,
  currentUsername,
  typingUsers,
  onReact,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomAnchorRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  // Auto-scroll when messages or typing indicators update
  const scrollToBottom = (smooth = true) => {
    if (bottomAnchorRef.current) {
      bottomAnchorRef.current.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  };

  useEffect(() => {
    // Check if user is already near bottom before auto scrolling
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
      if (isNearBottom) {
        scrollToBottom();
      }
    }
  }, [messages, typingUsers]);

  // Initial scroll to bottom on room change
  useEffect(() => {
    scrollToBottom(false);
  }, [room.id]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;
    setShowScrollBottom(distanceToBottom > 200);
  };

  return (
    <div className="relative flex-1 min-h-0 bg-[#0a0a0a]">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto px-2 sm:px-4 py-4 space-y-1"
      >
        {/* Room Header Banner / Welcome Card */}
        <div className="px-4 py-8 mb-4 border-b border-[#1c1c1c] text-left">
          <div className="w-12 h-12 rounded-2xl bg-[#141414] border border-[#262626] flex items-center justify-center text-[#4ade80] mb-3 shadow-inner">
            <HashIcon size={24} />
          </div>
          <h3 className="text-xl font-bold text-[#f2f2f2]">
            Welcome to #{room.name}!
          </h3>
          <p className="text-sm text-[#8c8c8c] mt-1 max-w-lg leading-relaxed">
            {room.topic}
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#161616] border border-[#262626] text-xs text-[#8c8c8c]">
            <span className="w-2 h-2 rounded-full bg-[#4ade80]" />
            <span>Messages in this channel are saved in localStorage</span>
          </div>
        </div>

        {/* Message Feeds with Date Dividers */}
        {messages.map((msg, index) => {
          const prevMsg = messages[index - 1];
          const showDateDivider =
            !prevMsg ||
            formatDateSeparator(prevMsg.timestamp) !== formatDateSeparator(msg.timestamp);

          return (
            <React.Fragment key={msg.id}>
              {showDateDivider && (
                <div className="relative my-4 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#1f1f1f]" />
                  </div>
                  <span className="relative px-3 py-0.5 bg-[#121212] border border-[#262626] rounded-full text-[11px] font-semibold text-[#8c8c8c] uppercase tracking-wider select-none">
                    {formatDateSeparator(msg.timestamp)}
                  </span>
                </div>
              )}

              <MessageItem
                message={msg}
                currentUsername={currentUsername}
                onReact={onReact}
              />
            </React.Fragment>
          );
        })}

        {/* Real-time Simulated Typing Indicator */}
        <TypingIndicator typingUsers={typingUsers} />

        {/* Invisible anchor element to scroll into view */}
        <div ref={bottomAnchorRef} className="h-1" />
      </div>

      {/* Floating "Scroll to Bottom" button */}
      {showScrollBottom && (
        <button
          onClick={() => scrollToBottom(true)}
          className="absolute bottom-4 right-6 bg-[#1f1f1f] hover:bg-[#262626] text-[#4ade80] border border-[#333333] px-3 py-1.5 rounded-full text-xs font-semibold shadow-xl flex items-center gap-1.5 transition-all duration-150 animate-fadeIn"
        >
          <ArrowDownIcon size={14} />
          <span>New messages</span>
        </button>
      )}
    </div>
  );
};
