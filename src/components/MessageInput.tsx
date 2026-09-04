import React, { useState, useRef, useEffect } from 'react';
import { SendIcon, SmileIcon } from './Icons';

interface MessageInputProps {
  roomName: string;
  onSendMessage: (text: string) => void;
  onUserTyping?: () => void;
}

const EMOJIS = ['👍', '❤️', '🔥', '🚀', '😂', '💡', '🎉', '👀'];

export const MessageInput: React.FC<MessageInputProps> = ({
  roomName,
  onSendMessage,
  onUserTyping,
}) => {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea up to max-height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [text]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    onSendMessage(trimmed);
    setText('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInsertEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const canSend = text.trim().length > 0;

  return (
    <div className="p-3 sm:p-4 bg-[#121212] border-t border-[#262626] shrink-0">
      <div className="max-w-4xl mx-auto relative">
        {/* Quick Emoji Bar Popup */}
        {showEmojiPicker && (
          <div className="absolute bottom-full mb-2 right-0 sm:left-0 sm:right-auto bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl p-2 shadow-2xl flex gap-1 z-30 animate-fadeIn">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleInsertEmoji(emoji)}
                className="w-8 h-8 flex items-center justify-center text-lg hover:bg-[#262626] rounded-lg transition-transform active:scale-125"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2 bg-[#0a0a0a] border border-[#262626] focus-within:border-[#4ade80] rounded-2xl px-3 py-2 transition-colors">
          {/* Emoji Trigger Button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`p-2 rounded-xl transition-colors ${
              showEmojiPicker
                ? 'text-[#4ade80] bg-[#1a1a1a]'
                : 'text-[#8c8c8c] hover:text-[#f2f2f2] hover:bg-[#1a1a1a]'
            }`}
            title="Insert emoji"
          >
            <SmileIcon size={20} />
          </button>

          {/* Text Input Area */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (onUserTyping) onUserTyping();
            }}
            onKeyDown={handleKeyDown}
            placeholder={`Message #${roomName}... (Enter to send, Shift+Enter for new line)`}
            className="flex-1 max-h-32 py-1.5 px-1 bg-transparent text-sm text-[#f2f2f2] placeholder-[#8c8c8c]/50 focus:outline-none resize-none leading-relaxed font-sans"
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className={`p-2.5 rounded-xl transition-all duration-200 transform ${
              canSend
                ? 'bg-[#4ade80] text-[#0a0a0a] hover:bg-[#22c55e] active:scale-95 shadow-md shadow-[#4ade80]/20 cursor-pointer'
                : 'bg-[#181818] text-[#8c8c8c]/40 cursor-not-allowed'
            }`}
            aria-label="Send message"
          >
            <SendIcon size={16} />
          </button>
        </div>

        {/* Input helper note for desktop */}
        <div className="hidden sm:flex justify-between items-center px-1 mt-1.5 text-[11px] text-[#8c8c8c]/70">
          <span>Pro tip: Wrap code in backticks like <code className="text-[#4ade80]">`code`</code></span>
          <span>Shift + Enter for new line</span>
        </div>
      </div>
    </div>
  );
};
