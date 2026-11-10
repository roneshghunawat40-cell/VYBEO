import React, { useState } from 'react';
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Clock,
  Bookmark,
  Bell,
  Shield,
  MessageSquare,
  Heart,
  Send,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Video, Comment } from '../../types';
import { VybeoPlayer } from '../player/VybeoPlayer';
import { currentUser, sampleComments } from '../../data/mockData';

interface WatchViewProps {
  video: Video;
  allVideos: Video[];
  onSelectVideo: (video: Video) => void;
  onToggleWatchLater: (video: Video) => void;
  isWatchLater: boolean;
}

export const WatchView: React.FC<WatchViewProps> = ({
  video,
  allVideos,
  onSelectVideo,
  onToggleWatchLater,
  isWatchLater,
}) => {
  const [likesCount, setLikesCount] = useState(video.likesCount);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(video.channel.isSubscribed || false);
  const [bellState, setBellState] = useState<'ALL' | 'PERSONALIZED' | 'NONE'>('ALL');
  const [comments, setComments] = useState<Comment[]>(sampleComments);
  const [newCommentText, setNewCommentText] = useState('');
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  const relatedVideos = allVideos.filter((v) => v.id !== video.id);

  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
      if (isDisliked) setIsDisliked(false);
    }
  };

  const handleDislike = () => {
    if (isDisliked) {
      setIsDisliked(false);
    } else {
      setIsDisliked(true);
      if (isLiked) {
        setIsLiked(false);
        setLikesCount((prev) => prev - 1);
      }
    }
  };

  const handleAddComment = () => {
    if (!newCommentText.trim()) return;
    const newEntry: Comment = {
      id: `c_${Date.now()}`,
      videoId: video.id,
      userId: currentUser.id,
      user: currentUser,
      content: newCommentText.trim(),
      likesCount: 0,
      isCreatorHeart: false,
      createdAt: 'Just now',
      replies: [],
    };
    setComments((prev) => [newEntry, ...prev]);
    setNewCommentText('');
  };

  const handleLikeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const liked = !c.isLiked;
          return {
            ...c,
            isLiked: liked,
            likesCount: c.likesCount + (liked ? 1 : -1),
          };
        }
        return c;
      })
    );
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(0)}K`;
    return views.toString();
  };

  return (
    <div className="max-w-[1700px] mx-auto px-2 sm:px-4 lg:px-8 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Video Player, Metadata, Comments */}
        <div className="lg:col-span-8 xl:col-span-8 space-y-4">
          {/* Main Video Player */}
          <VybeoPlayer
            src={video.sourceFileUrl}
            poster={video.thumbnailUrl}
            autoPlay={true}
            chapters={video.chapters}
            onTimeUpdate={(cur) => {
              if (video.chapters && video.chapters.length > 0) {
                const idx = video.chapters.findIndex(
                  (ch, i) =>
                    cur >= ch.timestamp &&
                    (!video.chapters![i + 1] || cur < video.chapters![i + 1].timestamp)
                );
                if (idx !== -1 && idx !== activeChapterIndex) {
                  setActiveChapterIndex(idx);
                }
              }
            }}
          />

          {/* Video Title */}
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
            {video.title}
          </h1>

          {/* Channel Bar & Action Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-neutral-800/80">
            {/* Channel Info */}
            <div className="flex items-center gap-3">
              <img
                src={video.channel.user.avatarUrl}
                alt={video.channel.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-neutral-800"
              />
              <div>
                <div className="flex items-center gap-1.5 font-bold text-white text-sm sm:text-base">
                  <span>{video.channel.name}</span>
                  {video.channel.user.isVerified && (
                    <Shield size={14} className="text-[#FF1E46] fill-[#FF1E46]" />
                  )}
                </div>
                <div className="text-xs text-neutral-400 font-mono">
                  {video.channel.subscriberCount.toLocaleString()} subscribers
                </div>
              </div>

              {/* Subscribe button & bell */}
              <div className="flex items-center ml-2">
                <button
                  onClick={() => setIsSubscribed(!isSubscribed)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    isSubscribed
                      ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      : 'bg-[#FF003F] text-white hover:bg-red-600 shadow-md shadow-[#FF003F]/20'
                  }`}
                >
                  <Bell size={14} />
                  <span>{isSubscribed ? 'Subscribed' : 'Subscribe'}</span>
                </button>
              </div>
            </div>

            {/* Actions: Likes, Share, Watch Later */}
            <div className="flex items-center gap-2">
              {/* Like / Dislike Segmented Pill */}
              <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                <button
                  onClick={handleLike}
                  className={`px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 transition ${
                    isLiked ? 'text-[#FF1E46] bg-[#FF003F]/15' : 'text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <ThumbsUp size={15} className={isLiked ? 'fill-current' : ''} />
                  <span className="font-mono">{likesCount.toLocaleString()}</span>
                </button>
                <div className="w-[1px] h-4 bg-neutral-800" />
                <button
                  onClick={handleDislike}
                  className={`px-3 py-2 text-xs font-semibold flex items-center transition ${
                    isDisliked ? 'text-[#FF1E46] bg-[#FF003F]/15' : 'text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <ThumbsDown size={15} className={isDisliked ? 'fill-current' : ''} />
                </button>
              </div>

              {/* Watch Later */}
              <button
                onClick={() => onToggleWatchLater(video)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
                  isWatchLater
                    ? 'border-[#FF003F] bg-[#FF003F]/15 text-[#FF1E46]'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <Clock size={15} className={isWatchLater ? 'fill-current' : ''} />
                <span>{isWatchLater ? 'Saved' : 'Watch Later'}</span>
              </button>

              {/* Share */}
              <button
                onClick={() => {
                  navigator.clipboard?.writeText?.(window.location.href);
                  alert('Video link copied to clipboard!');
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 transition"
              >
                <Share2 size={15} />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Description & Chapter Drawer */}
          <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-2xl text-xs sm:text-sm space-y-3">
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
              <span className="font-semibold text-white">{formatViews(video.viewsCount)} views</span>
              <span>·</span>
              <span>{video.createdAt}</span>
              <span>·</span>
              <span className="text-[#FF1E46] font-medium">{video.category}</span>
            </div>

            <p className={`text-neutral-300 leading-relaxed ${showFullDesc ? '' : 'line-clamp-2'}`}>
              {video.description}
            </p>

            {/* Chapters Interactive List */}
            {video.chapters && video.chapters.length > 0 && (
              <div className="pt-2 border-t border-neutral-800/80 space-y-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Video Chapters
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {video.chapters.map((ch, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-lg border text-xs flex items-center justify-between transition ${
                        activeChapterIndex === idx
                          ? 'border-[#FF003F]/60 bg-[#FF003F]/10 text-white font-bold'
                          : 'border-neutral-800 bg-neutral-950/40 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span className="truncate max-w-[200px]">{ch.title}</span>
                      <span className="font-mono text-[11px] text-[#FF1E46]">
                        {Math.floor(ch.timestamp / 60)}:{(ch.timestamp % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setShowFullDesc(!showFullDesc)}
              className="text-xs font-bold text-neutral-400 hover:text-white flex items-center gap-1 pt-1 font-mono"
            >
              {showFullDesc ? (
                <>Show less <ChevronUp size={14} /></>
              ) : (
                <>Show more <ChevronDown size={14} /></>
              )}
            </button>
          </div>

          {/* Comments Section */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-[#FF1E46]" />
                <h3 className="font-bold text-white text-base">
                  {comments.length} Comments
                </h3>
              </div>
            </div>

            {/* Comment Input */}
            <div className="flex gap-3">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.displayName}
                className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5 border border-neutral-800"
              />
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  placeholder="Add a constructive comment..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddComment();
                  }}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF003F]"
                />
                {newCommentText.trim() && (
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setNewCommentText('')}
                      className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddComment}
                      className="px-4 py-1.5 rounded-xl bg-[#FF003F] text-white text-xs font-bold hover:bg-red-600 transition"
                    >
                      Comment
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Comments List */}
            <div className="divide-y divide-neutral-800/80 pt-2 space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="pt-4 flex gap-3 text-xs sm:text-sm">
                  <img
                    src={c.user.avatarUrl}
                    alt={c.user.displayName}
                    className="w-9 h-9 rounded-full object-cover shrink-0 border border-neutral-800"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-200">{c.user.displayName}</span>
                      <span className="text-[11px] text-neutral-500 font-mono">{c.createdAt}</span>
                    </div>
                    <p className="text-neutral-300 leading-relaxed">{c.content}</p>

                    {/* Comment Actions */}
                    <div className="flex items-center gap-4 pt-1 text-xs text-neutral-400 font-mono">
                      <button
                        onClick={() => handleLikeComment(c.id)}
                        className={`flex items-center gap-1 hover:text-white ${
                          c.isLiked ? 'text-[#FF1E46]' : ''
                        }`}
                      >
                        <ThumbsUp size={13} className={c.isLiked ? 'fill-current' : ''} />
                        <span>{c.likesCount}</span>
                      </button>

                      {c.isCreatorHeart && (
                        <div className="flex items-center gap-1 text-[#FF1E46] text-[11px] font-semibold">
                          <Heart size={12} className="fill-current" />
                          <span>Creator Heart</span>
                        </div>
                      )}
                    </div>

                    {/* Replies */}
                    {c.replies && c.replies.length > 0 && (
                      <div className="pl-4 pt-2 border-l-2 border-neutral-800 space-y-2 mt-2">
                        {c.replies.map((r) => (
                          <div key={r.id} className="flex gap-2.5">
                            <img
                              src={r.user.avatarUrl}
                              alt={r.user.displayName}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-white text-xs">{r.user.displayName}</span>
                                <span className="text-[10px] text-neutral-500 font-mono">{r.createdAt}</span>
                              </div>
                              <p className="text-xs text-neutral-300">{r.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Up Next Queue */}
        <div className="lg:col-span-4 xl:col-span-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <h3 className="font-bold text-white text-sm">Up Next</h3>
            <span className="text-xs font-mono text-neutral-400">Autoplay ON</span>
          </div>

          <div className="space-y-3">
            {relatedVideos.map((vid) => (
              <div
                key={vid.id}
                onClick={() => onSelectVideo(vid)}
                className="group cursor-pointer flex gap-3 p-2 rounded-xl hover:bg-neutral-900/60 transition"
              >
                <div className="relative w-36 aspect-video rounded-xl overflow-hidden bg-neutral-900 shrink-0 border border-neutral-800">
                  <img
                    src={vid.thumbnailUrl}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/85 text-[10px] font-mono text-white">
                    {Math.floor(vid.duration / 60)}:{(vid.duration % 60).toString().padStart(2, '0')}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-neutral-200 group-hover:text-[#FF1E46] transition line-clamp-2 leading-snug">
                    {vid.title}
                  </h4>
                  <p className="text-[11px] text-neutral-400 font-mono mt-1 truncate">
                    {vid.channel.name}
                  </p>
                  <p className="text-[11px] text-neutral-500 font-mono">
                    {formatViews(vid.viewsCount)} views · {vid.createdAt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
