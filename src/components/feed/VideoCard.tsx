import React, { useState } from 'react';
import { Shield, Clock, Share2, Play, Bookmark } from 'lucide-react';
import { Video } from '../../types';

interface VideoCardProps {
  video: Video;
  onSelect: (video: Video) => void;
  onToggleWatchLater?: (video: Video) => void;
  isWatchLater?: boolean;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onSelect,
  onToggleWatchLater,
  isWatchLater = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(0)}K`;
    return views.toString();
  };

  return (
    <div
      className="group cursor-pointer flex flex-col space-y-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(video)}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800/80 shadow-md">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Hover Gradient Scrim & Play Glyphs */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#FF003F]/90 text-white flex items-center justify-center shadow-lg shadow-[#FF003F]/30 transform scale-90 group-hover:scale-100 transition-transform">
            <Play size={20} className="ml-0.5 fill-white" />
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-black/85 backdrop-blur-sm rounded text-[11px] font-mono font-medium text-white shadow-sm pointer-events-none">
          {formatDuration(video.duration)}
        </div>

        {/* Quick Action Overlay (Watch Later) */}
        {onToggleWatchLater && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchLater(video);
            }}
            className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg backdrop-blur-md transition ${
              isWatchLater
                ? 'bg-[#FF003F] text-white opacity-100'
                : 'bg-black/60 text-neutral-300 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-black/90'
            }`}
            title={isWatchLater ? 'Remove from Watch Later' : 'Save to Watch Later'}
          >
            <Clock size={15} className={isWatchLater ? 'fill-white' : ''} />
          </button>
        )}
      </div>

      {/* Metadata Row */}
      <div className="flex gap-3 items-start px-0.5">
        {/* Channel Avatar */}
        <img
          src={video.channel.user.avatarUrl}
          alt={video.channel.name}
          className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5 border border-neutral-800"
        />

        <div className="flex-1 min-w-0">
          {/* Video Title */}
          <h3 className="font-bold text-sm sm:text-base text-neutral-100 group-hover:text-[#FF1E46] transition-colors line-clamp-2 leading-snug">
            {video.title}
          </h3>

          {/* Channel Name with Verified Badge */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-1 hover:text-white transition">
            <span className="truncate">{video.channel.name}</span>
            {video.channel.user.isVerified && (
              <Shield size={12} className="text-[#FF1E46] fill-[#FF1E46] shrink-0" />
            )}
          </div>

          {/* Unboxed Metadata with Typographic Separator (Zero-Pill Discipline) */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono mt-0.5">
            <span>{formatViews(video.viewsCount)} views</span>
            <span aria-hidden="true">·</span>
            <span>{video.createdAt}</span>
            <span aria-hidden="true">·</span>
            <span className="text-neutral-400">{video.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
