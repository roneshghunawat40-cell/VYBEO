import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  Volume1,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  RotateCcw,
  CheckCheck,
  Tv,
  PictureInPicture2,
  Gauge,
} from 'lucide-react';
import { VideoChapter } from '../../types';

interface VybeoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  chapters?: VideoChapter[];
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
}

export const VybeoPlayer: React.FC<VybeoPlayerProps> = ({
  src,
  poster,
  autoPlay = true,
  chapters = [],
  onTimeUpdate,
  onEnded,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.9);
  const [currentResolution, setCurrentResolution] = useState<string>('Auto (1080p)');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<'main' | 'quality' | 'speed'>('main');
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheater, setIsTheater] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number>(0);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resolutions = [
    { label: 'Auto (1080p)', bitrate: '4.8 Mbps' },
    { label: '1080p60 HD', bitrate: '4.5 Mbps' },
    { label: '720p60 HD', bitrate: '2.5 Mbps' },
    { label: '480p SD', bitrate: '1.0 Mbps' },
    { label: '360p Low', bitrate: '0.6 Mbps' },
  ];

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3200);
  };

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleVolumeChange = (newVol: number) => {
    if (!videoRef.current) return;
    videoRef.current.volume = newVol;
    setVolume(newVol);
    if (newVol === 0) {
      setIsMuted(true);
      videoRef.current.muted = true;
    } else {
      setIsMuted(false);
      videoRef.current.muted = false;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      const restoreVol = prevVolume || 0.5;
      videoRef.current.volume = restoreVol;
      setVolume(restoreVol);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      videoRef.current.muted = true;
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setCurrentTime(cur);
    setDuration(dur);
    setProgress((cur / dur) * 100);
    onTimeUpdate?.(cur, dur);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (videoRef.current && duration) {
      videoRef.current.currentTime = pos * duration;
      setProgress(pos * 100);
    }
  };

  const handleBarMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverPosition(pos * 100);
    if (duration) {
      setHoverTime(pos * duration);
    }
  };

  const handleBarMouseLeave = () => {
    setHoverTime(null);
  };

  const changeResolution = (label: string) => {
    setCurrentResolution(label);
    setShowSettings(false);
  };

  const changeSpeed = (spd: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = spd;
    setPlaybackSpeed(spd);
    setShowSettings(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const togglePictureInPicture = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (e) {
      console.warn('PiP not supported or cancelled', e);
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space' || e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        setIsTheater((prev) => !prev);
      } else if (e.key === 'ArrowRight') {
        if (videoRef.current) videoRef.current.currentTime += 5;
      } else if (e.key === 'ArrowLeft') {
        if (videoRef.current) videoRef.current.currentTime -= 5;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleVolumeChange(Math.min(1, volume + 0.1));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleVolumeChange(Math.max(0, volume - 0.1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, volume, isMuted]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Sync video source change
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = src;
      if (autoPlay) {
        videoRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [src, autoPlay]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative group bg-black w-full overflow-hidden shadow-2xl transition-all duration-300 ${
        isTheater ? 'aspect-[21/9] max-h-[78vh]' : 'aspect-video'
      } rounded-2xl border border-neutral-800`}
    >
      <video
        ref={videoRef}
        poster={poster}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          onEnded?.();
        }}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        playsInline
      />

      {/* Big Center Play/Pause Flash Overlay */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px] cursor-pointer"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FF003F]/90 text-white flex items-center justify-center shadow-lg shadow-[#FF003F]/40 transform hover:scale-110 active:scale-95 transition-transform duration-200">
            <Play size={32} className="ml-1 fill-white" />
          </div>
        </div>
      )}

      {/* Scrub Bar Overlay with Chapter Indicators & Hover Preview */}
      <div
        className={`absolute bottom-12 inset-x-0 px-4 transition-opacity duration-300 z-30 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          onClick={handleSeek}
          onMouseMove={handleBarMouseMove}
          onMouseLeave={handleBarMouseLeave}
          className="relative h-2 hover:h-3 bg-white/20 hover:bg-white/30 transition-all cursor-pointer rounded-full overflow-visible group/scrub"
        >
          {/* Progress fill */}
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-600 via-[#FF1E46] to-[#FF003F] rounded-full"
            style={{ width: `${progress}%` }}
          />

          {/* Chapter markers */}
          {chapters.map((ch, idx) => {
            if (!duration || ch.timestamp === 0) return null;
            const leftPercent = (ch.timestamp / duration) * 100;
            return (
              <div
                key={idx}
                className="absolute top-0 bottom-0 w-0.5 bg-black/60 z-10"
                style={{ left: `${leftPercent}%` }}
                title={`${ch.title} (${formatTime(ch.timestamp)})`}
              />
            );
          })}

          {/* Hover Time Bubble */}
          {hoverTime !== null && (
            <div
              className="absolute -top-9 -translate-x-1/2 px-2 py-1 bg-neutral-900/95 border border-neutral-700 text-white text-xs font-mono rounded shadow-xl pointer-events-none whitespace-nowrap"
              style={{ left: `${hoverPosition}%` }}
            >
              {formatTime(hoverTime)}
            </div>
          )}

          {/* Scrubber thumb handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-md scale-0 group-hover/scrub:scale-100 transition-transform"
            style={{ left: `${progress}%` }}
          />
        </div>
      </div>

      {/* Control Surface */}
      <div
        className={`absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-black/95 via-black/75 to-transparent px-4 flex items-center justify-between text-white transition-opacity duration-300 z-20 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Left: Play/Pause, Volume, Time */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={togglePlay}
            className="p-1 hover:text-[#FF1E46] transition-colors focus:outline-none"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={22} /> : <Play size={22} className="fill-current" />}
          </button>

          {/* Volume control with hover slider */}
          <div className="flex items-center group/vol">
            <button
              onClick={toggleMute}
              className="p-1 hover:text-[#FF1E46] transition-colors focus:outline-none"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX size={20} />
              ) : volume < 0.5 ? (
                <Volume1 size={20} />
              ) : (
                <Volume2 size={20} />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-0 group-hover/vol:w-20 transition-all duration-200 accent-[#FF003F] h-1.5 bg-neutral-700 rounded-lg cursor-pointer ml-1"
            />
          </div>

          <div className="text-xs sm:text-sm font-mono text-neutral-300 select-none">
            <span className="text-white font-medium">{formatTime(currentTime)}</span>
            <span className="mx-1 text-neutral-500">/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Settings, Speed, PiP, Theater, Fullscreen */}
        <div className="flex items-center gap-2 sm:gap-3 relative">
          {/* Quick Speed Badge */}
          {playbackSpeed !== 1 && (
            <span className="text-xs font-mono font-bold bg-[#FF003F]/20 text-[#FF1E46] px-1.5 py-0.5 rounded">
              {playbackSpeed}x
            </span>
          )}

          {/* Settings Menu Button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSettings(!showSettings);
                setActiveSettingsTab('main');
              }}
              className={`p-1.5 hover:text-[#FF1E46] transition-colors rounded-lg ${
                showSettings ? 'text-[#FF1E46]' : ''
              }`}
              aria-label="Playback Settings"
            >
              <Settings size={20} className={showSettings ? 'rotate-45 transition-transform' : ''} />
            </button>

            {/* Settings Dropdown Popover */}
            {showSettings && (
              <div className="absolute right-0 bottom-12 w-56 bg-neutral-900/95 backdrop-blur-md border border-neutral-800 rounded-xl p-2 shadow-2xl z-50 text-xs">
                {activeSettingsTab === 'main' && (
                  <div className="space-y-1">
                    <div className="font-semibold px-2 py-1.5 text-neutral-400 border-b border-neutral-800 flex items-center justify-between">
                      <span>Playback Settings</span>
                      <span className="text-[10px] text-neutral-500 font-mono">HLS v7</span>
                    </div>

                    <button
                      onClick={() => setActiveSettingsTab('quality')}
                      className="w-full flex items-center justify-between px-2.5 py-2 hover:bg-neutral-800/80 rounded-lg transition-colors text-left"
                    >
                      <span className="text-neutral-300">Quality</span>
                      <span className="text-[#FF1E46] font-semibold flex items-center gap-1">
                        {currentResolution.split(' ')[0]}
                        <span className="text-neutral-500">›</span>
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveSettingsTab('speed')}
                      className="w-full flex items-center justify-between px-2.5 py-2 hover:bg-neutral-800/80 rounded-lg transition-colors text-left"
                    >
                      <span className="text-neutral-300">Playback Speed</span>
                      <span className="text-neutral-400 font-mono flex items-center gap-1">
                        {playbackSpeed === 1 ? 'Normal' : `${playbackSpeed}x`}
                        <span className="text-neutral-500">›</span>
                      </span>
                    </button>
                  </div>
                )}

                {activeSettingsTab === 'quality' && (
                  <div className="space-y-1">
                    <button
                      onClick={() => setActiveSettingsTab('main')}
                      className="w-full px-2 py-1 text-left text-neutral-400 hover:text-white flex items-center gap-1 border-b border-neutral-800 pb-1.5 mb-1"
                    >
                      <span>‹</span> Quality Ladder
                    </button>
                    {resolutions.map((res) => (
                      <button
                        key={res.label}
                        onClick={() => changeResolution(res.label)}
                        className={`w-full flex items-center justify-between px-2 py-1.5 hover:bg-neutral-800 rounded-lg transition-colors ${
                          currentResolution === res.label ? 'text-[#FF1E46] font-bold' : 'text-neutral-300'
                        }`}
                      >
                        <div className="flex flex-col text-left">
                          <span>{res.label}</span>
                          <span className="text-[10px] text-neutral-500 font-mono">{res.bitrate}</span>
                        </div>
                        {currentResolution === res.label && <CheckCheck size={14} />}
                      </button>
                    ))}
                  </div>
                )}

                {activeSettingsTab === 'speed' && (
                  <div className="space-y-1">
                    <button
                      onClick={() => setActiveSettingsTab('main')}
                      className="w-full px-2 py-1 text-left text-neutral-400 hover:text-white flex items-center gap-1 border-b border-neutral-800 pb-1.5 mb-1"
                    >
                      <span>‹</span> Playback Speed
                    </button>
                    {speeds.map((spd) => (
                      <button
                        key={spd}
                        onClick={() => changeSpeed(spd)}
                        className={`w-full flex items-center justify-between px-2 py-1.5 hover:bg-neutral-800 rounded-lg transition-colors ${
                          playbackSpeed === spd ? 'text-[#FF1E46] font-bold' : 'text-neutral-300'
                        }`}
                      >
                        <span>{spd === 1 ? 'Normal (1.0x)' : `${spd}x`}</span>
                        {playbackSpeed === spd && <CheckCheck size={14} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Picture in Picture */}
          <button
            onClick={togglePictureInPicture}
            className="p-1.5 hover:text-[#FF1E46] transition-colors rounded-lg hidden sm:block"
            title="Picture in Picture"
            aria-label="Picture in Picture"
          >
            <PictureInPicture2 size={19} />
          </button>

          {/* Theater Mode Toggle */}
          <button
            onClick={() => setIsTheater(!isTheater)}
            className={`p-1.5 hover:text-[#FF1E46] transition-colors rounded-lg hidden sm:block ${
              isTheater ? 'text-[#FF1E46]' : ''
            }`}
            title="Theater Mode"
            aria-label="Theater Mode"
          >
            <Tv size={19} />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 hover:text-[#FF1E46] transition-colors rounded-lg"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            aria-label="Fullscreen"
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};
