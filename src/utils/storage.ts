import { Message, RoomId, User } from '../types/chat';
import { getAvatarColor } from './avatars';

const STORAGE_KEY_USER = 'chatapp_current_user';
const STORAGE_KEY_PREFIX_MSGS = 'chatapp_messages_';
const STORAGE_KEY_ACTIVE_ROOM = 'chatapp_active_room';

export const INITIAL_ROOMS: { id: RoomId; name: string; topic: string; baseOnline: number }[] = [
  {
    id: 'general',
    name: 'general',
    topic: 'Company-wide announcements, casual discussions, and welcomes',
    baseOnline: 18,
  },
  {
    id: 'tech-talk',
    name: 'tech-talk',
    topic: 'React, TypeScript, architecture, tools, and technical deep-dives',
    baseOnline: 14,
  },
  {
    id: 'random',
    name: 'random',
    topic: 'Memes, coffee breaks, music, and off-topic fun',
    baseOnline: 9,
  },
];

const SEED_MESSAGES: Record<RoomId, Message[]> = {
  general: [
    {
      id: 'gen-seed-1',
      roomId: 'general',
      userId: 'user-sarah',
      username: 'Sarah Connor',
      userColor: '#38bdf8',
      text: 'Hey everyone! Welcome to the new DevChat space 👋',
      timestamp: Date.now() - 1000 * 60 * 35,
      reactions: { '👋': ['Marcus Chen', 'Sophie Taylor'] },
    },
    {
      id: 'gen-seed-2',
      roomId: 'general',
      userId: 'user-marcus',
      username: 'Marcus Chen',
      userColor: '#4ade80',
      text: 'The dark theme is super clean! Love the green accents and smooth layout.',
      timestamp: Date.now() - 1000 * 60 * 22,
      reactions: { '🔥': ['Sarah Connor'] },
    },
    {
      id: 'gen-seed-3',
      roomId: 'general',
      userId: 'user-sophie',
      username: 'Sophie Taylor',
      userColor: '#f472b6',
      text: 'Everything persists nicely in localStorage too. Test out switching rooms!',
      timestamp: Date.now() - 1000 * 60 * 10,
      reactions: { '🚀': ['Sarah Connor', 'Marcus Chen'] },
    },
  ],
  'tech-talk': [
    {
      id: 'tech-seed-1',
      roomId: 'tech-talk',
      userId: 'user-linus',
      username: 'Linus Tech',
      userColor: '#a78bfa',
      text: 'Vite 5 + React 18 is insanely fast. HMR updates in sub-50ms.',
      timestamp: Date.now() - 1000 * 60 * 45,
      reactions: { '⚡': ['Dave K.', 'Arjun Patel'] },
    },
    {
      id: 'tech-seed-2',
      roomId: 'tech-talk',
      userId: 'user-dave',
      username: 'Dave K.',
      userColor: '#fb923c',
      text: 'Tailwind CSS utility classes make styling dark mode a breeze. What fonts are you all using?',
      timestamp: Date.now() - 1000 * 60 * 25,
    },
    {
      id: 'tech-seed-3',
      roomId: 'tech-talk',
      userId: 'user-arjun',
      username: 'Arjun Patel',
      userColor: '#34d399',
      text: 'Inter font with tabular figures for timestamps works best! TypeScript 5.5 type narrowing has also been great.',
      timestamp: Date.now() - 1000 * 60 * 8,
      reactions: { '👍': ['Linus Tech'] },
    },
  ],
  random: [
    {
      id: 'rand-seed-1',
      roomId: 'random',
      userId: 'user-memelord',
      username: 'MemeLord',
      userColor: '#facc15',
      text: 'There are only 10 types of people in the world: those who understand binary, and those who do not.',
      timestamp: Date.now() - 1000 * 60 * 50,
      reactions: { '😂': ['Chloe Vibes'] },
    },
    {
      id: 'rand-seed-2',
      roomId: 'random',
      userId: 'user-chloe',
      username: 'Chloe Vibes',
      userColor: '#f472b6',
      text: 'Daily coffee status: cup #3 down. Code now running on pure caffeine ☕',
      timestamp: Date.now() - 1000 * 60 * 30,
      reactions: { '☕': ['PixelCat', 'MemeLord'] },
    },
    {
      id: 'rand-seed-3',
      roomId: 'random',
      userId: 'user-cat',
      username: 'PixelCat',
      userColor: '#60a5fa',
      text: 'Why do programmers prefer dark mode? Because light attracts bugs! 🐛',
      timestamp: Date.now() - 1000 * 60 * 12,
      reactions: { '✨': ['Chloe Vibes'] },
    },
  ],
};

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveStoredUser(user: User): void {
  try {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  } catch (err) {
    console.error('Failed to save user in localStorage', err);
  }
}

export function clearStoredUser(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_USER);
  } catch (err) {
    console.error('Failed to clear user from localStorage', err);
  }
}

export function getActiveRoom(): RoomId {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVE_ROOM);
    if (raw === 'general' || raw === 'tech-talk' || raw === 'random') {
      return raw as RoomId;
    }
    return 'general';
  } catch {
    return 'general';
  }
}

export function saveActiveRoom(roomId: RoomId): void {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_ROOM, roomId);
  } catch (err) {
    console.error('Failed to save active room', err);
  }
}

export function getRoomMessages(roomId: RoomId): Message[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX_MSGS}${roomId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
    // If not in storage yet, load seed messages and save them
    const seeds = SEED_MESSAGES[roomId] || [];
    saveRoomMessages(roomId, seeds);
    return seeds;
  } catch {
    return SEED_MESSAGES[roomId] || [];
  }
}

export function saveRoomMessages(roomId: RoomId, messages: Message[]): void {
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX_MSGS}${roomId}`, JSON.stringify(messages));
    // Trigger custom event for same-tab updates if needed
    window.dispatchEvent(
      new CustomEvent('chatapp_messages_updated', {
        detail: { roomId, count: messages.length },
      })
    );
  } catch (err) {
    console.error(`Failed to save messages for ${roomId}`, err);
  }
}

export function appendMessage(message: Message): Message[] {
  const current = getRoomMessages(message.roomId);
  const updated = [...current, message];
  saveRoomMessages(message.roomId, updated);
  return updated;
}

export function toggleMessageReaction(
  roomId: RoomId,
  messageId: string,
  emoji: string,
  username: string
): Message[] {
  const messages = getRoomMessages(roomId);
  const updated = messages.map((msg) => {
    if (msg.id !== messageId) return msg;

    const reactions = { ...(msg.reactions || {}) };
    const currentUsers = reactions[emoji] || [];

    if (currentUsers.includes(username)) {
      // Remove reaction
      const filtered = currentUsers.filter((u) => u !== username);
      if (filtered.length === 0) {
        delete reactions[emoji];
      } else {
        reactions[emoji] = filtered;
      }
    } else {
      // Add reaction
      reactions[emoji] = [...currentUsers, username];
    }

    return { ...msg, reactions };
  });

  saveRoomMessages(roomId, updated);
  return updated;
}

export function resetRoomHistory(roomId: RoomId): Message[] {
  const seeds = SEED_MESSAGES[roomId] || [];
  saveRoomMessages(roomId, seeds);
  return seeds;
}

export function createNewUser(username: string): User {
  return {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    username: username.trim(),
    avatarColor: getAvatarColor(username.trim()),
    joinedAt: Date.now(),
  };
}
