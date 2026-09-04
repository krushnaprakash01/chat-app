import React from 'react';

interface TypingIndicatorProps {
  typingUsers: string[];
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ typingUsers }) => {
  if (!typingUsers || typingUsers.length === 0) {
    return null;
  }

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0]} is typing`;
    }
    if (typingUsers.length === 2) {
      return `${typingUsers[0]} and ${typingUsers[1]} are typing`;
    }
    return `${typingUsers[0]} and ${typingUsers.length - 1} others are typing`;
  };

  return (
    <div className="flex items-center gap-2 px-4 py-1.5 text-xs text-[#8c8c8c] select-none animate-fadeIn">
      {/* 3 Animated Bouncing Dots */}
      <div className="flex items-center gap-1 bg-[#1a1a1a] px-2 py-1 rounded-full border border-[#262626]">
        <span
          className="w-1.5 h-1.5 rounded-full bg-[#4ade80] inline-block"
          style={{ animation: 'pulseDot 1.2s infinite ease-in-out', animationDelay: '0ms' }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-[#4ade80] inline-block"
          style={{ animation: 'pulseDot 1.2s infinite ease-in-out', animationDelay: '200ms' }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-[#4ade80] inline-block"
          style={{ animation: 'pulseDot 1.2s infinite ease-in-out', animationDelay: '400ms' }}
        />
      </div>

      <span className="font-medium text-[#8c8c8c]">{getTypingText()}...</span>
    </div>
  );
};
