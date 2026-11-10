import React from 'react';
import { Radio, Users, Shield, Plus, Sparkles } from 'lucide-react';
import { LiveStream } from '../../types';

interface LiveDirectoryProps {
  liveStreams: LiveStream[];
  onSelectStream: (stream: LiveStream) => void;
  onGoLive: () => void;
}

export const LiveDirectory: React.FC<LiveDirectoryProps> = ({
  liveStreams,
  onSelectStream,
  onGoLive,
}) => {
  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Directory Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#FF003F]/20 text-[#FF1E46]">
              <Radio size={20} className="animate-pulse" />
            </div>
            <h1 className="text-2xl font-black text-white">Live Broadcast Hub</h1>
          </div>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            Real-time interactive WebRTC SFU broadcasts with sub-300ms latency & Super Chat tipping
          </p>
        </div>

        <button
          onClick={onGoLive}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-[#FF003F] text-white text-xs sm:text-sm font-bold flex items-center gap-2 hover:brightness-110 transition shadow-lg shadow-red-600/25"
        >
          <Radio size={16} />
          <span>Launch Broadcaster Studio</span>
        </button>
      </div>

      {/* Live Stream Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {liveStreams.map((stream) => (
          <div
            key={stream.id}
            onClick={() => onSelectStream(stream)}
            className="group cursor-pointer flex flex-col space-y-3"
          >
            {/* Stream Poster */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800/80 shadow-md">
              <img
                src={stream.thumbnailUrl}
                alt={stream.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Overlaid Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FF003F] text-white text-[11px] font-bold font-mono tracking-wider shadow-lg animate-pulse">
                  <Radio size={12} /> LIVE
                </span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm text-white text-[11px] font-mono">
                  <Users size={12} className="text-[#FF1E46]" />
                  {stream.viewerCount.toLocaleString()}
                </span>
              </div>

              {/* Category */}
              <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-black/85 backdrop-blur-sm rounded text-[10px] font-mono text-neutral-300">
                {stream.category}
              </div>
            </div>

            {/* Stream Metadata */}
            <div className="flex gap-3 items-start px-0.5">
              <img
                src={stream.channel.user.avatarUrl}
                alt={stream.channel.name}
                className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5 border-2 border-[#FF003F]"
              />

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm sm:text-base text-neutral-100 group-hover:text-[#FF1E46] transition-colors line-clamp-2 leading-snug">
                  {stream.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-1">
                  <span className="truncate">{stream.channel.name}</span>
                  <Shield size={12} className="text-[#FF1E46] fill-[#FF1E46] shrink-0" />
                </div>

                <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-mono mt-0.5">
                  <span className="text-emerald-400 font-medium">WebRTC SFU &lt;280ms</span>
                  <span>·</span>
                  <span>Started {stream.startedAt}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
