import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Music2,
  Plus,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  Send,
  X,
  Sparkles,
  Check,
} from 'lucide-react';
import { initialShorts } from '../../data/mockData';

interface ShortItem {
  id: string;
  title: string;
  videoUrl: string;
  creatorHandle: string;
  creatorAvatar: string;
  musicTitle: string;
  likesCount: number;
  commentsCount: number;
}

interface CommentEntry {
  id: string;
  user: string;
  avatar: string;
  text: string;
  likes: number;
  time: string;
}

export const VybeoShortsFeed: React.FC = () => {
  const [shorts, setShorts] = useState<ShortItem[]>(initialShorts);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [likedShorts, setLikedShorts] = useState<Record<string, boolean>>({});
  const [followedCreators, setFollowedCreators] = useState<Record<string, boolean>>({});
  const [showCommentsFor, setShowCommentsFor] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [commentsMap, setCommentsMap] = useState<Record<string, CommentEntry[]>>({
    s1: [
      { id: 'sc1', user: 'DevAlex', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', text: 'BullMQ + FFmpeg is literally witchcraft fast!', likes: 412, time: '20m ago' },
      { id: 'sc2', user: 'TechSam', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', text: 'What bitrate ladder are you using?', likes: 98, time: '1h ago' },
    ],
    s2: [
      { id: 'sc3', user: 'SynthLover', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', text: 'That electric ruby theme is clean 🔥', likes: 215, time: '35m ago' },
    ],
  });
  const [copiedShare, setCopiedShare] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const toggleLike = (id: string) => {
    setLikedShorts((prev) => {
      const isLiked = !prev[id];
      setShorts((sList) =>
        sList.map((s) => (s.id === id ? { ...s, likesCount: s.likesCount + (isLiked ? 1 : -1) } : s))
      );
      return { ...prev, [id]: isLiked };
    });
  };

  const toggleFollow = (handle: string) => {
    setFollowedCreators((prev) => ({ ...prev, [handle]: !prev[handle] }));
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;
    const index = Math.round(scrollTop / clientHeight);
    if (index !== activeIndex && index >= 0 && index < shorts.length) {
      setActiveIndex(index);
    }
  };

  const scrollToIndex = (index: number) => {
    if (!containerRef.current) return;
    const target = Math.max(0, Math.min(shorts.length - 1, index));
    containerRef.current.scrollTo({
      top: target * containerRef.current.clientHeight,
      behavior: 'smooth',
    });
    setActiveIndex(target);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        scrollToIndex(activeIndex + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        scrollToIndex(activeIndex - 1);
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setIsMuted((prev) => !prev);
      } else if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        const activeShort = shorts[activeIndex];
        if (activeShort) toggleLike(activeShort.id);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIndex, shorts]);

  // Video play/pause synchronization
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (idx === activeIndex) {
        video.currentTime = 0;
        video.muted = isMuted;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [activeIndex, isMuted]);

  const handleAddComment = (shortId: string) => {
    if (!commentInput.trim()) return;
    const newEntry: CommentEntry = {
      id: `c_${Date.now()}`,
      user: 'You',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      text: commentInput.trim(),
      likes: 0,
      time: 'Just now',
    };
    setCommentsMap((prev) => ({
      ...prev,
      [shortId]: [newEntry, ...(prev[shortId] || [])],
    }));
    setShorts((prev) =>
      prev.map((s) => (s.id === shortId ? { ...s, commentsCount: s.commentsCount + 1 } : s))
    );
    setCommentInput('');
  };

  const handleShare = (short: ShortItem) => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="relative flex justify-center items-center h-[calc(100vh-4.5rem)] py-2 sm:py-4">
      {/* Up / Down Navigation Floating Controls */}
      <div className="hidden lg:flex flex-col gap-2 absolute right-8 top-1/2 -translate-y-1/2 z-30">
        <button
          onClick={() => scrollToIndex(activeIndex - 1)}
          disabled={activeIndex === 0}
          className="p-3 rounded-full bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800 hover:text-[#FF1E46] disabled:opacity-30 disabled:pointer-events-none transition-colors"
          aria-label="Previous Short"
        >
          <ChevronUp size={22} />
        </button>
        <button
          onClick={() => scrollToIndex(activeIndex + 1)}
          disabled={activeIndex === shorts.length - 1}
          className="p-3 rounded-full bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800 hover:text-[#FF1E46] disabled:opacity-30 disabled:pointer-events-none transition-colors"
          aria-label="Next Short"
        >
          <ChevronDown size={22} />
        </button>
      </div>

      {/* Main Snap Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="relative h-full w-full max-w-[420px] aspect-[9/16] overflow-y-scroll snap-y snap-mandatory no-scrollbar rounded-2xl sm:rounded-3xl border border-neutral-800/80 bg-black shadow-2xl"
      >
        {shorts.map((short, idx) => {
          const isLiked = Boolean(likedShorts[short.id]);
          const isFollowed = Boolean(followedCreators[short.creatorHandle]);

          return (
            <div
              key={short.id}
              className="relative h-full w-full snap-start snap-always bg-neutral-950 flex items-center justify-center overflow-hidden select-none"
            >
              {/* Vertical Video Element */}
              <video
                ref={(el) => {
                  videoRefs.current[idx] = el;
                }}
                src={short.videoUrl}
                loop
                playsInline
                muted={isMuted}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setIsMuted(!isMuted)}
              />

              {/* Top Mute / Sound Status Badge */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="absolute top-4 left-4 z-20 p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition"
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>

              {/* Double Tap or Direct Play Indicator */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90 pointer-events-none" />

              {/* Overlay Action Sidebar (Right) */}
              <div className="absolute right-3.5 bottom-16 flex flex-col items-center gap-5 text-white z-20">
                {/* Creator Avatar with Follow Plus */}
                <div className="relative mb-2">
                  <img
                    src={short.creatorAvatar}
                    alt={short.creatorHandle}
                    className="w-11 h-11 rounded-full border-2 border-[#FF1E46] object-cover shadow-lg"
                  />
                  <button
                    onClick={() => toggleFollow(short.creatorHandle)}
                    className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 p-1 rounded-full transition transform active:scale-90 ${
                      isFollowed ? 'bg-neutral-800 text-neutral-300' : 'bg-[#FF003F] text-white shadow-md'
                    }`}
                  >
                    {isFollowed ? <Check size={11} /> : <Plus size={11} />}
                  </button>
                </div>

                {/* Like Button */}
                <button
                  onClick={() => toggleLike(short.id)}
                  className="flex flex-col items-center gap-1 group focus:outline-none"
                >
                  <div
                    className={`p-3 rounded-full backdrop-blur-md transition-all duration-200 ${
                      isLiked
                        ? 'bg-[#FF003F]/20 text-[#FF003F] scale-110'
                        : 'bg-neutral-900/60 text-white group-hover:scale-110'
                    }`}
                  >
                    <Heart
                      size={24}
                      className={isLiked ? 'fill-[#FF003F] text-[#FF003F]' : 'group-hover:text-[#FF1E46]'}
                    />
                  </div>
                  <span className="text-[11px] font-mono font-medium">
                    {short.likesCount.toLocaleString()}
                  </span>
                </button>

                {/* Comments Button */}
                <button
                  onClick={() => setShowCommentsFor(short.id)}
                  className="flex flex-col items-center gap-1 group focus:outline-none"
                >
                  <div className="p-3 bg-neutral-900/60 backdrop-blur-md rounded-full group-hover:scale-110 transition">
                    <MessageCircle size={24} className="group-hover:text-[#FF1E46]" />
                  </div>
                  <span className="text-[11px] font-mono font-medium">{short.commentsCount}</span>
                </button>

                {/* Share Button */}
                <button
                  onClick={() => handleShare(short)}
                  className="flex flex-col items-center gap-1 group focus:outline-none"
                >
                  <div className="p-3 bg-neutral-900/60 backdrop-blur-md rounded-full group-hover:scale-110 transition">
                    {copiedShare ? (
                      <Check size={24} className="text-emerald-400" />
                    ) : (
                      <Share2 size={24} className="group-hover:text-[#FF1E46]" />
                    )}
                  </div>
                  <span className="text-[11px] font-mono font-medium">
                    {copiedShare ? 'Copied' : 'Share'}
                  </span>
                </button>

                {/* Spinning Music Vinyl */}
                <div className="mt-1 w-9 h-9 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-900 border border-neutral-700 flex items-center justify-center animate-[spin_6s_linear_infinite] shadow-md">
                  <div className="w-3 h-3 rounded-full bg-[#FF003F]" />
                </div>
              </div>

              {/* Bottom Metadata Drawer */}
              <div className="absolute bottom-4 left-4 right-20 z-20 text-white pointer-events-auto">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base hover:underline cursor-pointer">
                    @{short.creatorHandle}
                  </span>
                  {isFollowed && (
                    <span className="text-[10px] text-neutral-400 font-mono">Following</span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-neutral-200 mt-1 line-clamp-2 leading-relaxed">
                  {short.title}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-neutral-400 font-mono">
                  <Music2 size={13} className="text-[#FF1E46] shrink-0" />
                  <span className="truncate max-w-[200px]">{short.musicTitle}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide-over Comments Drawer */}
      {showCommentsFor && (
        <div className="fixed inset-0 sm:absolute sm:inset-y-0 sm:right-auto sm:w-[380px] bg-neutral-900/98 backdrop-blur-xl border border-neutral-800 rounded-3xl p-4 shadow-2xl z-40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">Comments</span>
                <span className="text-xs text-neutral-500 font-mono">
                  ({(commentsMap[showCommentsFor] || []).length})
                </span>
              </div>
              <button
                onClick={() => setShowCommentsFor(null)}
                className="p-1 text-neutral-400 hover:text-white rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Comments List */}
            <div className="divide-y divide-neutral-800/60 max-h-[60vh] overflow-y-auto no-scrollbar pt-2 space-y-2">
              {(commentsMap[showCommentsFor] || []).length === 0 ? (
                <div className="text-center py-12 text-neutral-500 text-xs">
                  No comments yet. Start the conversation!
                </div>
              ) : (
                (commentsMap[showCommentsFor] || []).map((c) => (
                  <div key={c.id} className="pt-2 text-xs flex gap-2.5">
                    <img src={c.avatar} alt={c.user} className="w-7 h-7 rounded-full object-cover shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-200">{c.user}</span>
                        <span className="text-[10px] text-neutral-500 font-mono">{c.time}</span>
                      </div>
                      <p className="text-neutral-300 mt-0.5 leading-snug">{c.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Comment Input */}
          <div className="pt-3 border-t border-neutral-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddComment(showCommentsFor);
              }}
              className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF003F]"
            />
            <button
              onClick={() => handleAddComment(showCommentsFor)}
              disabled={!commentInput.trim()}
              className="p-2 bg-[#FF003F] text-white rounded-xl disabled:opacity-40 hover:bg-red-600 transition"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
