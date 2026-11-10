import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  Radio,
  Send,
  DollarSign,
  Heart,
  Share2,
  Bell,
  Shield,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { LiveStream, LiveChatMessage } from '../../types';
import { VybeoPlayer } from '../player/VybeoPlayer';
import { SuperChatModal } from './SuperChatModal';
import { currentUser } from '../../data/mockData';

interface LiveRoomProps {
  stream: LiveStream;
  onBack: () => void;
}

export const LiveRoom: React.FC<LiveRoomProps> = ({ stream, onBack }) => {
  const [messages, setMessages] = useState<LiveChatMessage[]>(stream.messages);
  const [chatInput, setChatInput] = useState('');
  const [viewerCount, setViewerCount] = useState(stream.viewerCount);
  const [isSubscribed, setIsSubscribed] = useState(stream.channel.isSubscribed || false);
  const [likesCount, setLikesCount] = useState(14820);
  const [isLiked, setIsLiked] = useState(false);
  const [showSuperChatModal, setShowSuperChatModal] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Simulate incoming live chat messages & subtle viewer fluctuations
  useEffect(() => {
    const mockNames = ['PixelRider', 'NovaWave', 'Vortex99', 'GhostInShell', 'AeroPulse', 'ElenaTech', 'KryptoFox'];
    const mockMsgs = [
      'The audio latency is basically zero! 🔥',
      'What bitrate are you pushing from the encoder?',
      'Let’s goooo!! Best stream of the evening',
      'Can you demo the transcode queue next?',
      'Obsidian UI looks so sleek on OLED screens',
      'Subscribed! Keep up the brilliant broadcasts',
      'Greetings from Berlin 🇩🇪',
    ];

    const chatInterval = setInterval(() => {
      const randomUser = mockNames[Math.floor(Math.random() * mockNames.length)];
      const randomMsg = mockMsgs[Math.floor(Math.random() * mockMsgs.length)];
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setMessages((prev) => [
        ...prev.slice(-40), // keep last 40 to avoid memory buildup
        {
          id: `m_${Date.now()}`,
          liveStreamId: stream.id,
          userId: `u_${randomUser}`,
          user: {
            id: `u_${randomUser}`,
            email: `${randomUser}@example.com`,
            username: randomUser.toLowerCase(),
            displayName: randomUser,
            avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + (randomUser.length * 1000)}?w=100&auto=format&fit=crop&q=80`,
            role: 'USER',
          },
          message: randomMsg,
          isSuperChat: false,
          amountCents: 0,
          createdAt: now,
        },
      ]);

      // Jitter viewer count slightly (+/- 5)
      setViewerCount((v) => Math.max(10, v + Math.floor(Math.random() * 11) - 5));
    }, 4500);

    return () => clearInterval(chatInterval);
  }, [stream.id]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: LiveChatMessage = {
      id: `m_${Date.now()}`,
      liveStreamId: stream.id,
      userId: currentUser.id,
      user: currentUser,
      message: chatInput.trim(),
      isSuperChat: false,
      amountCents: 0,
      createdAt: now,
    };
    setMessages((prev) => [...prev, newMsg]);
    setChatInput('');
  };

  const handleSuperChatReceived = (superChat: LiveChatMessage) => {
    setMessages((prev) => [...prev, superChat]);
  };

  const superChats = messages.filter((m) => m.isSuperChat);

  return (
    <div className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Video Player + Stream Information */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          <div className="relative">
            <VybeoPlayer
              src={stream.playbackUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
              poster={stream.thumbnailUrl}
              autoPlay={true}
            />

            {/* Live Status Overlay Badges */}
            <div className="absolute top-4 left-4 flex items-center gap-2 z-20 pointer-events-none">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FF003F] text-white text-xs font-bold font-mono tracking-wider shadow-lg animate-pulse">
                <Radio size={14} /> LIVE
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-white text-xs font-mono font-medium border border-neutral-800">
                <Users size={13} className="text-[#FF1E46]" />
                {viewerCount.toLocaleString()} viewers
              </span>
              <span className="hidden sm:inline-flex px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono">
                WebRTC SFU &lt;280ms
              </span>
            </div>
          </div>

          {/* Stream Title & Action Bar */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {stream.title}
            </h1>
            <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pt-3 border-t border-neutral-800/80">
              {/* Channel Info */}
              <div className="flex items-center gap-3">
                <img
                  src={stream.channel.user.avatarUrl}
                  alt={stream.channel.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#FF003F]"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-white text-sm sm:text-base">
                    <span>{stream.channel.name}</span>
                    <Shield size={14} className="text-[#FF1E46] fill-[#FF1E46]" />
                  </div>
                  <div className="text-xs text-neutral-400 font-mono">
                    {stream.channel.subscriberCount.toLocaleString()} subscribers
                  </div>
                </div>
                <button
                  onClick={() => setIsSubscribed(!isSubscribed)}
                  className={`ml-3 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    isSubscribed
                      ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      : 'bg-[#FF003F] text-white hover:bg-red-600 shadow-md shadow-[#FF003F]/20'
                  }`}
                >
                  <Bell size={14} />
                  <span>{isSubscribed ? 'Subscribed' : 'Subscribe'}</span>
                </button>
              </div>

              {/* Actions: Likes, Super Chat, Share */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsLiked(!isLiked);
                    setLikesCount((prev) => prev + (isLiked ? -1 : 1));
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
                    isLiked
                      ? 'bg-[#FF003F]/15 border-[#FF003F] text-[#FF1E46]'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <Heart size={16} className={isLiked ? 'fill-current' : ''} />
                  <span className="font-mono">{likesCount.toLocaleString()}</span>
                </button>

                <button
                  onClick={() => setShowSuperChatModal(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-gradient-to-r from-[#FF003F] to-[#FF6B00] text-white shadow-lg hover:brightness-110 transition"
                >
                  <DollarSign size={16} />
                  <span>Super Chat</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard?.writeText?.(window.location.href);
                    alert('Live stream link copied to clipboard!');
                  }}
                  className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition"
                  title="Share Stream"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            {/* Description box */}
            <div className="mt-4 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs sm:text-sm text-neutral-300 leading-relaxed">
              <div className="flex items-center gap-2 mb-2 text-xs text-neutral-400 font-mono">
                <span>Category: <strong className="text-white">{stream.category}</strong></span>
                <span>·</span>
                <span>Started: <strong className="text-white">{stream.startedAt}</strong></span>
                <span>·</span>
                <span className="text-emerald-400 font-medium">Ingest: 1080p60 WebRTC</span>
              </div>
              <p>{stream.description}</p>
            </div>
          </div>
        </div>

        {/* Right: Live Chat Surface */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col h-[640px] bg-neutral-900/90 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Chat Header */}
          <div className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-[#FF1E46]" />
              <span className="font-bold text-sm text-white">Live Stream Chat</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Slow Mode: 3s
            </span>
          </div>

          {/* Super Chat Pinned Shelf (if any) */}
          {superChats.length > 0 && (
            <div className="p-2 bg-neutral-950/80 border-b border-neutral-800 flex gap-2 overflow-x-auto no-scrollbar">
              {superChats.slice(-3).map((sc) => (
                <div
                  key={sc.id}
                  className="px-2.5 py-1 rounded-lg text-white text-[11px] font-medium flex items-center gap-1.5 shrink-0 shadow-sm"
                  style={{ backgroundColor: sc.tierColor || '#FF003F' }}
                >
                  <Sparkles size={12} />
                  <span className="font-bold">{sc.user.displayName}:</span>
                  <span className="font-mono">${(sc.amountCents / 100).toFixed(0)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Messages Feed */}
          <div
            ref={chatScrollRef}
            className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs text-neutral-200"
          >
            {messages.map((msg) => {
              if (msg.isSuperChat) {
                return (
                  <div
                    key={msg.id}
                    className="rounded-xl overflow-hidden border border-neutral-800 shadow-md my-1"
                    style={{ backgroundColor: msg.tierColor || '#FF003F' }}
                  >
                    <div className="px-3 py-1.5 bg-black/25 flex items-center justify-between text-white font-bold">
                      <div className="flex items-center gap-1.5">
                        <img
                          src={msg.user.avatarUrl}
                          alt={msg.user.displayName}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span>{msg.user.displayName}</span>
                      </div>
                      <span className="font-mono">${(msg.amountCents / 100).toFixed(2)}</span>
                    </div>
                    <div className="p-2.5 bg-black/40 text-white font-medium text-xs">
                      {msg.message}
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className="flex items-start gap-2 leading-snug">
                  <img
                    src={msg.user.avatarUrl}
                    alt={msg.user.displayName}
                    className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="flex-1">
                    <span className="font-semibold text-neutral-400 mr-1.5 hover:underline cursor-pointer">
                      {msg.user.displayName}:
                    </span>
                    <span className="text-neutral-200">{msg.message}</span>
                  </div>
                  <span className="text-[10px] text-neutral-600 font-mono shrink-0">
                    {msg.createdAt}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 border-t border-neutral-800 bg-neutral-950/80">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Send a live message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF003F]"
              />
              <button
                onClick={() => setShowSuperChatModal(true)}
                className="p-2 rounded-xl bg-neutral-800 hover:bg-[#FF003F]/20 hover:text-[#FF1E46] text-neutral-300 transition"
                title="Super Chat"
              >
                <DollarSign size={16} />
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim()}
                className="p-2 rounded-xl bg-[#FF003F] text-white hover:bg-red-600 transition disabled:opacity-30"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSuperChatModal && (
        <SuperChatModal
          streamId={stream.id}
          onClose={() => setShowSuperChatModal(false)}
          onSend={handleSuperChatReceived}
        />
      )}
    </div>
  );
};
