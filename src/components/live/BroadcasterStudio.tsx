import React, { useState, useRef, useEffect } from 'react';
import {
  Video as VideoIcon,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  Radio,
  Copy,
  Check,
  Eye,
  EyeOff,
  RefreshCw,
  Activity,
  Layers,
  Settings2,
  AlertCircle,
} from 'lucide-react';
import { currentChannel } from '../../data/mockData';

interface BroadcasterStudioProps {
  onBack: () => void;
}

export const BroadcasterStudio: React.FC<BroadcasterStudioProps> = ({ onBack }) => {
  const [streamTitle, setStreamTitle] = useState('Deep-Dive: Building Ultra-Low Latency SFU Ingest');
  const [category, setCategory] = useState('Technology');
  const [streamKey, setStreamKey] = useState('vybeo_live_99f2b8a1c4e7de39');
  const [showKey, setShowKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedServer, setCopiedServer] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [liveDuration, setLiveDuration] = useState(0);

  // Device states
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);
  const [micActive, setMicActive] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);

  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const ingestServerUrl = 'rtmp://ingest.global.vybeo.net/live';

  // Request camera / microphone
  const startCamera = async () => {
    try {
      setMediaError(null);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });
      mediaStreamRef.current = stream;
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play().catch(() => {});
      }
      setHasCamera(true);
      setCameraActive(true);
      setIsScreenSharing(false);
    } catch (err: any) {
      console.warn('Could not access real camera:', err);
      setMediaError('Camera permission not available. Test pattern simulator active.');
      setHasCamera(false);
    }
  };

  const startScreenShare = async () => {
    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      mediaStreamRef.current = stream;
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play().catch(() => {});
      }
      setIsScreenSharing(true);
      setHasCamera(true);
    } catch (err) {
      console.warn('Screen share cancelled', err);
    }
  };

  const stopAllMedia = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = null;
    }
    setHasCamera(false);
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopAllMedia();
    };
  }, []);

  // Duration timer when live
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLive) {
      timer = setInterval(() => setLiveDuration((prev) => prev + 1), 1000);
    } else {
      setLiveDuration(0);
    }
    return () => clearInterval(timer);
  }, [isLive]);

  const toggleMic = () => {
    if (mediaStreamRef.current) {
      const audioTracks = mediaStreamRef.current.getAudioTracks();
      audioTracks.forEach((t) => (t.enabled = !micActive));
    }
    setMicActive(!micActive);
  };

  const toggleCamera = () => {
    if (mediaStreamRef.current) {
      const videoTracks = mediaStreamRef.current.getVideoTracks();
      videoTracks.forEach((t) => (t.enabled = !cameraActive));
    }
    setCameraActive(!cameraActive);
  };

  const regenerateStreamKey = () => {
    const newKey = `vybeo_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    setStreamKey(newKey);
  };

  const formatUptime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      {/* Studio Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#FF003F]/20 text-[#FF1E46]">
              <Radio size={20} className={isLive ? 'animate-pulse' : ''} />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">VYBEO Live Studio</h1>
          </div>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            Broadcast Ingest & SFU Control Panel · Channel: @{currentChannel.handle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isLive && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-600/20 border border-red-600/40 text-red-400 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>ON AIR · {formatUptime(liveDuration)}</span>
            </div>
          )}

          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition shadow-lg ${
              isLive
                ? 'bg-neutral-800 hover:bg-neutral-700 text-red-400 border border-neutral-700'
                : 'bg-gradient-to-r from-red-600 to-[#FF003F] text-white hover:brightness-110 shadow-red-600/30'
            }`}
          >
            <Radio size={16} />
            <span>{isLive ? 'End Broadcast' : 'Go Live Now'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left: Video Monitor & Hardware Ingest Preview */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative aspect-video bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
            {/* Real video feed or simulated test-pattern banner */}
            <video
              ref={videoPreviewRef}
              muted
              playsInline
              className={`w-full h-full object-cover ${!hasCamera || !cameraActive ? 'hidden' : 'block'}`}
            />

            {(!hasCamera || !cameraActive) && (
              <div className="text-center p-6 space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400">
                  <VideoOff size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Ingest Feed Standby</h3>
                  <p className="text-xs text-neutral-400 max-w-sm mt-1">
                    {mediaError || 'Click below to connect your webcam or broadcast with RTMP encoder (OBS / vMix).'}
                  </p>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <button
                    onClick={startCamera}
                    className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition"
                  >
                    Connect Webcam
                  </button>
                  <button
                    onClick={startScreenShare}
                    className="px-3.5 py-1.5 rounded-lg bg-[#FF003F]/20 hover:bg-[#FF003F]/30 text-[#FF1E46] text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <Monitor size={14} /> Screen Share
                  </button>
                </div>
              </div>
            )}

            {/* Overlaid Ingest HUD */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold ${isLive ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-300'}`}>
                {isLive ? 'BROADCASTING' : 'PREVIEW'}
              </span>
              <span className="px-2 py-1 rounded bg-black/60 backdrop-blur-md text-white text-[11px] font-mono">
                1080p60 · 6.2 Mbps
              </span>
            </div>

            {/* Ingest Control Bar */}
            <div className="absolute bottom-3 inset-x-3 px-4 py-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-neutral-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleCamera}
                  className={`p-2 rounded-lg text-white transition ${cameraActive ? 'bg-neutral-800 hover:bg-neutral-700' : 'bg-red-600/80'}`}
                  title={cameraActive ? 'Disable Video' : 'Enable Video'}
                >
                  {cameraActive ? <VideoIcon size={16} /> : <VideoOff size={16} />}
                </button>
                <button
                  onClick={toggleMic}
                  className={`p-2 rounded-lg text-white transition ${micActive ? 'bg-neutral-800 hover:bg-neutral-700' : 'bg-red-600/80'}`}
                  title={micActive ? 'Mute Mic' : 'Unmute Mic'}
                >
                  {micActive ? <Mic size={16} /> : <MicOff size={16} />}
                </button>
                <button
                  onClick={startScreenShare}
                  className={`p-2 rounded-lg text-white transition ${isScreenSharing ? 'bg-[#FF003F]' : 'bg-neutral-800 hover:bg-neutral-700'}`}
                  title="Share Screen"
                >
                  <Monitor size={16} />
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-neutral-300">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Activity size={14} /> Stable 60 FPS
                </span>
                <span className="text-neutral-500">|</span>
                <span>Bitrate: 6,180 kbps</span>
              </div>
            </div>
          </div>

          {/* Stream Metadata Form */}
          <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Settings2 size={16} className="text-[#FF1E46]" />
              Broadcast Settings
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-neutral-400 font-semibold mb-1 block">
                  Broadcast Title
                </label>
                <input
                  type="text"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF003F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-400 font-semibold mb-1 block">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF003F]"
                  >
                    <option value="Technology">Technology & Engineering</option>
                    <option value="Gaming">Gaming & Esports</option>
                    <option value="Music">Music & Synthesizers</option>
                    <option value="Creative">Creative & 3D Art</option>
                    <option value="Science">Cosmology & Science</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-neutral-400 font-semibold mb-1 block">
                    Latency Mode
                  </label>
                  <select className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF003F]">
                    <option value="webrtc">Ultra-Low Latency WebRTC (&lt;300ms)</option>
                    <option value="ll-hls">Low-Latency HLS (2-3s)</option>
                    <option value="standard">Standard HLS (6-8s)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Ingest & RTMP Credentials */}
        <div className="lg:col-span-4 space-y-4">
          {/* RTMP Credentials Box */}
          <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Layers size={16} className="text-[#FF1E46]" />
              OBS / External Encoder Config
            </h3>
            <p className="text-xs text-neutral-400">
              Paste these into OBS Studio, Streamlabs, or vMix to stream directly into the VYBEO ingestion cluster.
            </p>

            {/* Server URL */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Server Ingest URL
              </label>
              <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2">
                <input
                  type="text"
                  readOnly
                  value={ingestServerUrl}
                  className="bg-transparent text-xs text-neutral-200 font-mono flex-1 focus:outline-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(ingestServerUrl);
                    setCopiedServer(true);
                    setTimeout(() => setCopiedServer(false), 2000);
                  }}
                  className="text-neutral-400 hover:text-white"
                >
                  {copiedServer ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Stream Key */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Stream Key (Private)
                </label>
                <button
                  onClick={regenerateStreamKey}
                  className="text-[11px] text-neutral-400 hover:text-[#FF1E46] flex items-center gap-1 font-mono"
                >
                  <RefreshCw size={11} /> Reset Key
                </button>
              </div>
              <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2">
                <input
                  type={showKey ? 'text' : 'password'}
                  readOnly
                  value={streamKey}
                  className="bg-transparent text-xs text-neutral-200 font-mono flex-1 focus:outline-none"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="text-neutral-400 hover:text-white"
                >
                  {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(streamKey);
                    setCopiedKey(true);
                    setTimeout(() => setCopiedKey(false), 2000);
                  }}
                  className="text-neutral-400 hover:text-white"
                >
                  {copiedKey ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>

          {/* Telemetry / Ingest Health */}
          <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-3">
            <h3 className="font-bold text-white text-sm">Cluster Ingest Health</h3>
            <div className="divide-y divide-neutral-800 text-xs">
              <div className="py-2 flex items-center justify-between">
                <span className="text-neutral-400">Ingest Region</span>
                <span className="font-mono text-white">us-east (Virginia SFU)</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-neutral-400">Video Transcode</span>
                <span className="font-mono text-emerald-400 font-semibold">Active (H.264 / 60fps)</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-neutral-400">Audio Ingest</span>
                <span className="font-mono text-white">48.0 kHz Stereo (AAC)</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-neutral-400">Packet Loss / Jitter</span>
                <span className="font-mono text-emerald-400">0.00% (0.4ms)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
