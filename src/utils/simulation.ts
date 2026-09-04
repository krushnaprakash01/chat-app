import { Message, RoomId, SimulatedPeer } from '../types/chat';
import { appendMessage } from './storage';

export const SIMULATED_PEERS: SimulatedPeer[] = [
  // General room peers
  {
    id: 'peer-sarah',
    username: 'Sarah Connor',
    color: '#38bdf8',
    tagline: 'Tech Lead • Frontend Architecture',
    rooms: ['general', 'tech-talk'],
  },
  {
    id: 'peer-marcus',
    username: 'Marcus Chen',
    color: '#4ade80',
    tagline: 'Staff Engineer • React Core',
    rooms: ['general', 'tech-talk'],
  },
  {
    id: 'peer-sophie',
    username: 'Sophie Taylor',
    color: '#f472b6',
    tagline: 'Design Systems Lead • UI/UX',
    rooms: ['general', 'random'],
  },
  {
    id: 'peer-alex',
    username: 'Alex Morgan',
    color: '#fb923c',
    tagline: 'Product Operations',
    rooms: ['general'],
  },

  // Tech-talk room peers
  {
    id: 'peer-linus',
    username: 'Linus Tech',
    color: '#a78bfa',
    tagline: 'Systems & Tooling',
    rooms: ['tech-talk'],
  },
  {
    id: 'peer-dave',
    username: 'Dave K.',
    color: '#facc15',
    tagline: 'DevOps & Cloud Infra',
    rooms: ['tech-talk'],
  },
  {
    id: 'peer-arjun',
    username: 'Arjun Patel',
    color: '#34d399',
    tagline: 'TypeScript Specialist',
    rooms: ['tech-talk'],
  },
  {
    id: 'peer-elena',
    username: 'Elena Rostova',
    color: '#60a5fa',
    tagline: 'Performance & WASM',
    rooms: ['tech-talk'],
  },

  // Random room peers
  {
    id: 'peer-memelord',
    username: 'MemeLord',
    color: '#f87171',
    tagline: 'Chief Meme Curator 🎯',
    rooms: ['random'],
  },
  {
    id: 'peer-chloe',
    username: 'Chloe Vibes',
    color: '#f472b6',
    tagline: 'Coffee Enthusiast ☕',
    rooms: ['random', 'general'],
  },
  {
    id: 'peer-cat',
    username: 'PixelCat',
    color: '#2dd4bf',
    tagline: 'Gamer & CSS Hacker',
    rooms: ['random'],
  },
];

export function getPeersForRoom(roomId: RoomId): SimulatedPeer[] {
  return SIMULATED_PEERS.filter((peer) => peer.rooms.includes(roomId));
}

const CONTEXTUAL_RESPONSES: Record<RoomId, string[]> = {
  general: [
    'Great point! Thanks for sharing with the channel 👍',
    'Glad to see you in the room! How has the sprint been going?',
    'Awesome update! The team was just talking about this today.',
    'Totally agree with that. The interface is feeling super snappy!',
    'Nice! Looking forward to seeing the final version.',
    'Welcome in! Let us know if you need any feedback on this.',
  ],
  'tech-talk': [
    'Spot on. The combination of Vite and TypeScript bundler mode is unmatched.',
    'That is super clean. Have you tested how that handles edge case error boundaries?',
    'Definitely agree! In TypeScript 5.5, the inferred predicate checks make this even cleaner.',
    'Nice insight. We observed about a 40% reduction in re-renders with this approach.',
    'Tailwind CSS JIT compiler makes rapid prototyping so seamless.',
    'I was just reading an RFC regarding this pattern yesterday. Solid implementation!',
  ],
  random: [
    'Haha spot on! Adding this to my favorites list 😂',
    'Rule #1 of programming: If it works on localhost, ship it! 🚢',
    'Brb, getting another coffee before reading the next line of code ☕',
    '404: Motivation not found. Retrying in 5 minutes...',
    'This channel never fails to deliver quality laughs 😂',
    'Can confirm, this is 100% accurate in every team!',
  ],
};

export function pickSimulatedResponder(roomId: RoomId): {
  peer: SimulatedPeer;
  replyText: string;
} {
  const peers = getPeersForRoom(roomId);
  const peer = peers[Math.floor(Math.random() * peers.length)] || SIMULATED_PEERS[0];
  const pool = CONTEXTUAL_RESPONSES[roomId];
  const replyText = pool[Math.floor(Math.random() * pool.length)];

  return { peer, replyText };
}

export function createSimulatedMessage(
  roomId: RoomId,
  peer: SimulatedPeer,
  text: string
): Message {
  return {
    id: `sim-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    roomId,
    userId: peer.id,
    username: peer.username,
    userColor: peer.color,
    text,
    timestamp: Date.now(),
  };
}

/**
 * Trigger simulated real-time interaction:
 * 1. Callback when peer starts typing
 * 2. Callback when peer finishes typing and posts a response
 */
export function triggerSimulatedReply(
  roomId: RoomId,
  onTypingStart: (username: string) => void,
  onTypingEnd: () => void,
  onMessageCreated: (msg: Message) => void
): () => void {
  const { peer, replyText } = pickSimulatedResponder(roomId);

  // Random delay before typing begins (1000 - 2000ms)
  const typingStartDelay = 1000 + Math.random() * 1200;
  // Duration of typing (1800 - 3200ms)
  const typingDuration = 1800 + Math.random() * 1500;

  const startTimer = setTimeout(() => {
    onTypingStart(peer.username);

    const finishTimer = setTimeout(() => {
      onTypingEnd();
      const newMsg = createSimulatedMessage(roomId, peer, replyText);
      appendMessage(newMsg);
      onMessageCreated(newMsg);
    }, typingDuration);

    // Store finish timer cleanup
    activeFinishTimer = finishTimer;
  }, typingStartDelay);

  let activeFinishTimer: ReturnType<typeof setTimeout> | null = null;

  return () => {
    clearTimeout(startTimer);
    if (activeFinishTimer) {
      clearTimeout(activeFinishTimer);
    }
  };
}
