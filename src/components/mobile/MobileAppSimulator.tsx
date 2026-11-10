import React, { useState } from 'react';
import {
  Wifi,
  Battery,
  Signal,
  Home,
  Compass,
  PlusCircle,
  FolderHeart,
  User,
  Search,
  Bell,
  Radio,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { Video, LiveStream } from '../../types';
import { VybeoLogo } from '../brand/VybeoLogo';
import { VybeoPlayer } from '../player/VybeoPlayer';

interface MobileAppSimulatorProps {
  videos: Video[];
  liveStreams: LiveStream[];
  onClose: () => void;
  onOpenDesktopWatch: (video: Video) => void;
}

export const MobileAppSimulator: React.FC<MobileAppSimulatorProps> = ({
  videos,
  liveStreams,
  onClose,
  onOpenDesktopWatch,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'shorts' | 'live' | 'library'>('home');
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Outer Mobile Frame Mockup (iPhone / Android) */}
      <div className="relative w-full max-w-[390px] h-[780px] max-h-[95vh] bg-[#0A0A0A] border-[8px] border-neutral-800 rounded-[48px] shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10">
        {/* Dynamic Island / Top Notch */}
        <div className="absolute top-0 inset-x-0 h-8 flex items-center justify-between px-7 z-40 select-none">
          <span className="text-[12px] font-bold text-white font-mono">9:41</span>
          <div className="w-24 h-4 bg-black rounded-full mx-auto" />
          <div className="flex items-center gap-1.5 text-white">
            <Signal size={12} />
            <Wifi size={12} />
            <Battery size={13} />
          </div>
        </div>

        {/* Mobile App Header */}
        {!activeVideo ? (
          <div className="pt-9 pb-3 px-4 flex items-center justify-between border-b border-neutral-800/80 bg-[#0A0A0A] shrink-0 z-30">
            <VybeoLogo size={24} showText={true} />
            <div className="flex items-center gap-3 text-neutral-300">
              <button
                onClick={onClose}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition"
                title="Exit Mobile Simulator"
              >
                Desktop Mode
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-9 pb-2 px-3 flex items-center gap-2 border-b border-neutral-800 bg-[#0A0A0A] shrink-0 z-30">
            <button
              onClick={() => setActiveVideo(null)}
              className="p-1 text-white hover:text-[#FF1E46] transition"
            >
              <ArrowLeft size={20} />
            </button>
            <span className="text-xs font-bold text-white truncate flex-1">
              {activeVideo.title}
            </span>
          </div>
        )}

        {/* Main Scrollable Viewport */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-[#0A0A0A]">
          {activeVideo ? (
            /* Mobile Watch Mode */
            <div className="space-y-4">
              <div className="w-full aspect-video bg-black">
                <VybeoPlayer
                  src={activeVideo.sourceFileUrl}
                  poster={activeVideo.thumbnailUrl}
                  autoPlay={true}
                />
              </div>

              <div className="px-4 space-y-3">
                <h2 className="text-sm font-bold text-white leading-snug">
                  {activeVideo.title}
                </h2>
                <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
                  <span>{activeVideo.viewsCount.toLocaleString()} views · {activeVideo.createdAt}</span>
                  <button
                    onClick={() => {
                      onOpenDesktopWatch(activeVideo);
                      onClose();
                    }}
                    className="text-[#FF1E46] hover:underline"
                  >
                    Open in Desktop
                  </button>
                </div>

                <div className="flex items-center gap-3 py-2 border-y border-neutral-800/80">
                  <img
                    src={activeVideo.channel.user.avatarUrl}
                    alt={activeVideo.channel.name}
                    className="w-9 h-9 rounded-full object-cover border border-[#FF003F]"
                  />
                  <div className="flex-1">
                    <div className="text-xs font-bold text-white">{activeVideo.channel.name}</div>
                    <div className="text-[10px] text-neutral-400 font-mono">
                      {activeVideo.channel.subscriberCount.toLocaleString()} subs
                    </div>
                  </div>
                  <button className="px-3 py-1 rounded-full text-xs font-bold bg-[#FF003F] text-white">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Mobile Feed */
            <div className="divide-y divide-neutral-900">
              {videos.map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => setActiveVideo(vid)}
                  className="cursor-pointer group active:opacity-90"
                >
                  <div className="relative w-full aspect-video bg-neutral-900">
                    <img
                      src={vid.thumbnailUrl}
                      alt={vid.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/85 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-white">
                      {formatDuration(vid.duration)}
                    </div>
                  </div>

                  <div className="p-3 flex gap-3">
                    <img
                      src={vid.channel.user.avatarUrl}
                      alt={vid.channel.name}
                      className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                        {vid.title}
                      </h3>
                      <p className="text-[11px] text-neutral-400 font-mono mt-1 truncate">
                        {vid.channel.name} · {vid.viewsCount.toLocaleString()} views · {vid.createdAt}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Tab Bar (React Native Expo style) */}
        <div className="h-14 bg-[#0A0A0A] border-t border-neutral-800 flex items-center justify-around px-2 shrink-0 z-30">
          <button
            onClick={() => {
              setActiveTab('home');
              setActiveVideo(null);
            }}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'home' ? 'text-[#FF1E46]' : 'text-neutral-400'
            }`}
          >
            <Home size={18} />
            <span className="text-[9px] font-semibold">Home</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('shorts');
              setActiveVideo(null);
            }}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'shorts' ? 'text-[#FF1E46]' : 'text-neutral-400'
            }`}
          >
            <Compass size={18} />
            <span className="text-[9px] font-semibold">Shorts</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('live');
              setActiveVideo(null);
            }}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'live' ? 'text-[#FF1E46]' : 'text-neutral-400'
            }`}
          >
            <Radio size={18} />
            <span className="text-[9px] font-semibold">Live</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('library');
              setActiveVideo(null);
            }}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'library' ? 'text-[#FF1E46]' : 'text-neutral-400'
            }`}
          >
            <FolderHeart size={18} />
            <span className="text-[9px] font-semibold">Library</span>
          </button>
        </div>

        {/* Home Indicator Notch */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-neutral-600 rounded-full" />
      </div>
    </div>
  );
};
