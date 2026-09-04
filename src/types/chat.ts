export type RoomId = 'general' | 'tech-talk' | 'random';

export interface Room {
  id: RoomId;
  name: string;
  topic: string;
  baseOnline: number;
}

export interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface Message {
  id: string;
  roomId: RoomId;
  userId: string;
  username: string;
  userColor: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
  reactions?: Record<string, string[]>; // emoji -> array of usernames
}

export interface User {
  id: string;
  username: string;
  avatarColor: string;
  joinedAt: number;
}

export interface SimulatedPeer {
  id: string;
  username: string;
  color: string;
  tagline: string;
  rooms: RoomId[];
}
