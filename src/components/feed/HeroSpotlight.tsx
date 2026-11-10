import React from 'react';
import { Play, Radio, Shield, Clock, Sparkles } from 'lucide-react';
import { Video, LiveStream } from '../../types';

interface HeroSpotlightProps {
  video?: Video;
  liveStream?: LiveStream;
  onWatchVideo: (video: Video) => void;
  onWatchLive: (live: LiveStream) => void;
}

export const HeroSpotlight: React.FC<HeroSpotlightProps> = ({
  video,
  liveStream,
  onWatchVideo,
  onWatchLive,
}) => {
  if (!video && !liveStream) return null;

  const isLive = Boolean(liveStream);
  const title = isLive ? liveStream!.title : video!.title;
  const description = isLive ? liveStream!.description : video!.description;
  const channel = isLive ? liveStream!.channel : video!.channel;
  const thumb = isLive ? liveStream!.thumbnailUrl : video!.thumbnailUrl;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-neutral-800/80 bg-neutral-950 shadow-2xl mb-8 group">
      {/* Background Graphic with Vignette Scrim */}
      <div className="relative w-full aspect-[21/9] min-h-[300px] sm:min-h-[380px] max-h-[460px]">
        <img
          src={thumb}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
        />
        {/* Measured dark gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent max-w-3xl" />
      </div>

      {/* Hero Content Overlay */}
      <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end max-w-2xl text-white">
        {/* Top Kicker (Zero-Pill Discipline: Unboxed Text) */}
        <div className="flex items-center gap-2 text-xs font-mono mb-3">
          {isLive ? (
            <span className="flex items-center gap-1.5 text-[#FF1E46] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#FF003F] animate-ping" />
              FEATURED BROADCAST
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[#FF1E46] font-bold">
              <Sparkles size={14} />
              PREMIERE SPOTLIGHT
            </span>
          )}
          <span className="text-neutral-500">·</span>
          <span className="text-neutral-300">{channel.name}</span>
          <span className="text-neutral-500">·</span>
          <span className="text-neutral-400">
            {isLive ? `${liveStream!.viewerCount.toLocaleString()} watching` : `${video!.viewsCount.toLocaleString()} views`}
          </span>
        </div>

        {/* Hero Title */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-white mb-3 text-wrap-balance">
          {title}
        </h2>

        {/* Hero Description */}
        <p className="text-xs sm:text-sm text-neutral-300 line-clamp-2 leading-relaxed mb-6">
          {description}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (isLive && liveStream) onWatchLive(liveStream);
              else if (video) onWatchVideo(video);
            }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 via-[#FF1E46] to-[#FF003F] text-white text-xs sm:text-sm font-bold flex items-center gap-2 hover:brightness-110 transition shadow-lg shadow-[#FF003F]/25 transform active:scale-95"
          >
            <Play size={16} className="fill-white" />
            <span>{isLive ? 'Join Live Stream' : 'Watch Premiere Now'}</span>
          </button>

          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-neutral-900/80 backdrop-blur-md border border-neutral-800 text-xs text-neutral-300">
            <img
              src={channel.user.avatarUrl}
              alt={channel.name}
              className="w-5 h-5 rounded-full object-cover"
            />
            <span className="font-semibold text-white">{channel.name}</span>
            {channel.user.isVerified && (
              <Shield size={12} className="text-[#FF1E46] fill-[#FF1E46]" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
