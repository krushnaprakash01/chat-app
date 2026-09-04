import { useState, useEffect, useCallback, useMemo } from 'react';
import { RoomId, User, Message } from './types/chat';
import {
  INITIAL_ROOMS,
  getStoredUser,
  clearStoredUser,
  getActiveRoom,
  saveActiveRoom,
  getRoomMessages,
  appendMessage,
  toggleMessageReaction,
  resetRoomHistory,
} from './utils/storage';
import { triggerSimulatedReply } from './utils/simulation';
import { LoginScreen } from './components/LoginScreen';
import { Sidebar } from './components/Sidebar';
import { ChatHeader } from './components/ChatHeader';
import { MessageList } from './components/MessageList';
import { MessageInput } from './components/MessageInput';
import { OnlineUsersModal } from './components/OnlineUsersModal';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStoredUser());
  const [activeRoomId, setActiveRoomId] = useState<RoomId>(() => getActiveRoom());
  const [messages, setMessages] = useState<Message[]>(() => getRoomMessages(getActiveRoom()));
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);

  // Simulated online counts per room with subtle realistic fluctuations
  const [onlineOffsets, setOnlineOffsets] = useState<Record<RoomId, number>>({
    general: 0,
    'tech-talk': 0,
    random: 0,
  });

  // Track unread counts for non-active rooms
  const [unreadCounts, setUnreadCounts] = useState<Record<RoomId, number>>({
    general: 0,
    'tech-talk': 0,
    random: 0,
  });

  // Current active room object
  const currentRoom = useMemo(() => {
    return (
      INITIAL_ROOMS.find((r) => r.id === activeRoomId) || INITIAL_ROOMS[0]
    );
  }, [activeRoomId]);

  // Current room simulated online count
  const currentOnlineCount = useMemo(() => {
    const base = currentRoom.baseOnline;
    const offset = onlineOffsets[activeRoomId] || 0;
    // Plus 1 for current user
    return Math.max(3, base + offset + (currentUser ? 1 : 0));
  }, [currentRoom, onlineOffsets, activeRoomId, currentUser]);

  // Reload messages whenever active room changes
  useEffect(() => {
    const roomMsgs = getRoomMessages(activeRoomId);
    setMessages(roomMsgs);
    setTypingUsers([]);

    // Clear unread count for the newly opened room
    setUnreadCounts((prev) => ({
      ...prev,
      [activeRoomId]: 0,
    }));
  }, [activeRoomId]);

  // Handle cross-tab and intra-app message synchronization via storage events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith('chatapp_messages_')) {
        const changedRoom = e.key.replace('chatapp_messages_', '') as RoomId;
        if (changedRoom === activeRoomId) {
          setMessages(getRoomMessages(activeRoomId));
        } else if (['general', 'tech-talk', 'random'].includes(changedRoom)) {
          setUnreadCounts((prev) => ({
            ...prev,
            [changedRoom]: (prev[changedRoom] || 0) + 1,
          }));
        }
      }
      if (e.key === 'chatapp_current_user') {
        setCurrentUser(getStoredUser());
      }
    };

    const handleCustomMsgUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ roomId: RoomId; count: number }>;
      if (customEvent.detail?.roomId === activeRoomId) {
        setMessages(getRoomMessages(activeRoomId));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('chatapp_messages_updated', handleCustomMsgUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('chatapp_messages_updated', handleCustomMsgUpdate);
    };
  }, [activeRoomId]);

  // Periodic subtle fluctuation of online counts to simulate real-time community activity
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineOffsets((prev) => {
        const rooms: RoomId[] = ['general', 'tech-talk', 'random'];
        const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];
        const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
        return {
          ...prev,
          [randomRoom]: Math.max(-3, Math.min(4, (prev[randomRoom] || 0) + delta)),
        };
      });
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  // Room switching handler
  const handleSelectRoom = useCallback((roomId: RoomId) => {
    setActiveRoomId(roomId);
    saveActiveRoom(roomId);
    setIsSidebarOpen(false);
  }, []);

  // Send message handler
  const handleSendMessage = useCallback(
    (text: string) => {
      if (!currentUser) return;

      const userMessage: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        roomId: activeRoomId,
        userId: currentUser.id,
        username: currentUser.username,
        userColor: currentUser.avatarColor,
        text,
        timestamp: Date.now(),
      };

      const updated = appendMessage(userMessage);
      setMessages(updated);

      // Trigger simulated response with typing indicator
      triggerSimulatedReply(
        activeRoomId,
        (typingPeerName) => {
          setTypingUsers((prev) =>
            prev.includes(typingPeerName) ? prev : [...prev, typingPeerName]
          );
        },
        () => {
          setTypingUsers([]);
        },
        (replyMessage) => {
          // If the user is still in the same room when response arrives, update state
          if (replyMessage.roomId === activeRoomId) {
            setMessages((prev) => [...prev, replyMessage]);
          } else {
            setUnreadCounts((prev) => ({
              ...prev,
              [replyMessage.roomId]: (prev[replyMessage.roomId] || 0) + 1,
            }));
          }
        }
      );
    },
    [currentUser, activeRoomId]
  );

  // Message reaction handler
  const handleReact = useCallback(
    (messageId: string, emoji: string) => {
      if (!currentUser) return;
      const updated = toggleMessageReaction(
        activeRoomId,
        messageId,
        emoji,
        currentUser.username
      );
      setMessages(updated);
    },
    [activeRoomId, currentUser]
  );

  // Reset room messages handler
  const handleResetRoom = useCallback(() => {
    const confirmed = window.confirm(
      `Are you sure you want to reset all messages in #${currentRoom.name}? This will restore the room seed state.`
    );
    if (confirmed) {
      const reset = resetRoomHistory(activeRoomId);
      setMessages(reset);
      setTypingUsers([]);
    }
  }, [activeRoomId, currentRoom.name]);

  // Logout handler
  const handleLogout = useCallback(() => {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (confirmed) {
      clearStoredUser();
      setCurrentUser(null);
    }
  }, []);

  // If user is not logged in, show the clean login screen
  if (!currentUser) {
    return <LoginScreen onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="flex h-screen w-screen bg-[#0a0a0a] text-[#f2f2f2] overflow-hidden font-sans">
      {/* Collapsible / Responsive Sidebar */}
      <Sidebar
        currentRoom={activeRoomId}
        onSelectRoom={handleSelectRoom}
        currentUser={currentUser}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        unreadCounts={unreadCounts}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full bg-[#0a0a0a]">
        {/* Header with room title & online count */}
        <ChatHeader
          room={currentRoom}
          onlineCount={currentOnlineCount}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          onOpenMembers={() => setIsMembersModalOpen(true)}
          onResetRoom={handleResetRoom}
        />

        {/* Message Feed */}
        <MessageList
          room={currentRoom}
          messages={messages}
          currentUsername={currentUser.username}
          typingUsers={typingUsers}
          onReact={handleReact}
        />

        {/* Message Input Box */}
        <MessageInput
          roomName={currentRoom.name}
          onSendMessage={handleSendMessage}
        />
      </div>

      {/* Simulated Online Users Modal */}
      <OnlineUsersModal
        roomId={activeRoomId}
        roomName={currentRoom.name}
        currentUser={currentUser}
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        onlineCount={currentOnlineCount}
      />
    </div>
  );
}

export default App;
