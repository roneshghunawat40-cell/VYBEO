import React, { useState } from 'react';
import {
  X,
  Upload,
  Film,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Layers,
  Cpu,
} from 'lucide-react';
import { Video, VideoVisibility, VideoStatus } from '../../types';
import { currentChannel } from '../../data/mockData';

interface UploadModalProps {
  onClose: () => void;
  onVideoCreated: (video: Video) => void;
}

const PRESET_SOURCES = [
  {
    name: 'Cybernetic Simulation (1080p60)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumb: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1280&auto=format&fit=crop&q=80',
    duration: 596,
  },
  {
    name: 'Supersonic Fluid Dynamics (4K)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumb: 'https://images.unsplash.com/photo-1517976487502-53b478546b41?w=1280&auto=format&fit=crop&q=80',
    duration: 890,
  },
  {
    name: 'Deep-Space Observatory (1080p)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumb: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1280&auto=format&fit=crop&q=80',
    duration: 734,
  },
];

export const UploadModal: React.FC<UploadModalProps> = ({ onClose, onVideoCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technology');
  const [visibility, setVisibility] = useState<VideoVisibility>('PUBLIC');
  const [isShort, setIsShort] = useState(false);
  const [tagsInput, setTagsInput] = useState('Streaming, WebRTC, FFmpeg');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);

  // Transcoding simulation state
  const [isTranscoding, setIsTranscoding] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const pipelineSteps = [
    { title: 'Presigned S3 Voucher', desc: 'Secure object authorization & ingestion chunk' },
    { title: 'ffprobe Stream Inspection', desc: 'Analyzing audio/video codecs, GOP cadence & aspect ratio' },
    { title: 'Multi-Bitrate FFmpeg Ladder', desc: 'Transcoding 1080p (4500k), 720p (2500k), 480p (1000k), 360p (600k)' },
    { title: 'HLS TS Slicing & master.m3u8', desc: 'Generating independent segments (hls_time 4s)' },
    { title: 'Cloudflare / CloudFront CDN Sync', desc: 'Edge cache invalidation and database transition to TRANSCODED' },
  ];

  const handleStartTranscode = () => {
    if (!title.trim()) return;

    setIsTranscoding(true);
    setProgressPercent(10);
    setCurrentStepIndex(0);

    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        const next = prev + 1;
        if (next < pipelineSteps.length) {
          setProgressPercent(Math.round(((next + 1) / pipelineSteps.length) * 100));
          return next;
        } else {
          clearInterval(stepInterval);
          setProgressPercent(100);
          setIsComplete(true);

          const preset = PRESET_SOURCES[selectedPresetIndex];
          const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

          const newVideo: Video = {
            id: `v_${Date.now()}`,
            channelId: currentChannel.id,
            channel: currentChannel,
            title: title.trim(),
            description: description.trim() || 'Uploaded via VYBEO Creator Studio.',
            thumbnailUrl: preset.thumb,
            sourceFileUrl: preset.url,
            hlsMasterUrl: preset.url,
            duration: preset.duration,
            viewsCount: 0,
            likesCount: 0,
            dislikesCount: 0,
            isShort: Boolean(isShort),
            visibility: visibility,
            status: 'TRANSCODED',
            category: category,
            tags: tags,
            allowComments: true,
            createdAt: 'Just now',
          };

          setTimeout(() => {
            onVideoCreated(newVideo);
            onClose();
          }, 1400);

          return prev;
        }
      });
    }, 1100);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FF003F]/20 text-[#FF1E46]">
              <Upload size={20} />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">VYBEO Studio Upload</h2>
              <p className="text-xs text-neutral-400">FFmpeg Transcoder Pipeline & Multi-Bitrate Ladder</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isTranscoding && !isComplete}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition disabled:opacity-40"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {!isTranscoding ? (
            <>
              {/* Video Source Preset Picker */}
              <div>
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 block">
                  Select Video Ingest Asset
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PRESET_SOURCES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedPresetIndex(idx);
                        if (!title) setTitle(preset.name);
                      }}
                      className={`p-3 rounded-xl border text-left flex flex-col gap-2 transition ${
                        selectedPresetIndex === idx
                          ? 'border-[#FF003F] bg-neutral-800/80 shadow-md'
                          : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                      }`}
                    >
                      <img
                        src={preset.thumb}
                        alt={preset.name}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <span className="text-xs font-bold text-white truncate">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1 block">
                    Video Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Distributed Video Transcoding in Production"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF003F]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1 block">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Add chapters, links, and technical overview..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF003F] resize-none"
                  />
                </div>
              </div>

              {/* Category, Format & Visibility */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1 block">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF003F]"
                  >
                    <option value="Technology">Technology</option>
                    <option value="AI & Robotics">AI & Robotics</option>
                    <option value="Music">Music</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Science">Science</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1 block">
                    Format
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsShort(!isShort)}
                    className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      isShort
                        ? 'border-[#FF003F] bg-[#FF003F]/20 text-[#FF1E46]'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-300'
                    }`}
                  >
                    <Film size={14} />
                    <span>{isShort ? 'Vertical Short (9:16)' : 'Standard (16:9)'}</span>
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1 block">
                    Visibility
                  </label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as VideoVisibility)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF003F]"
                  >
                    <option value="PUBLIC">Public</option>
                    <option value="UNLISTED">Unlisted</option>
                    <option value="PRIVATE">Private</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1 block">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FF003F]"
                />
              </div>
            </>
          ) : (
            /* Transcoding Progress Pipeline Simulation */
            <div className="py-4 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <Cpu size={18} className="text-[#FF1E46] animate-pulse" />
                    Distributed Transcoding in Progress
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5 font-mono">
                    BullMQ Worker: worker-node-04a · Concurrency: 2
                  </p>
                </div>
                <span className="text-sm font-bold font-mono text-[#FF1E46]">
                  {progressPercent}%
                </span>
              </div>

              {/* Overall Progress Bar */}
              <div className="w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                <div
                  className="h-full bg-gradient-to-r from-red-600 via-[#FF1E46] to-[#FF003F] transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Pipeline Step List */}
              <div className="space-y-3 pt-2">
                {pipelineSteps.map((step, idx) => {
                  const isDone = idx < currentStepIndex || isComplete;
                  const isCurrent = idx === currentStepIndex && !isComplete;

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                        isDone
                          ? 'border-emerald-500/30 bg-emerald-950/20 text-neutral-200'
                          : isCurrent
                          ? 'border-[#FF003F]/40 bg-neutral-900 text-white shadow-lg'
                          : 'border-neutral-800/60 bg-neutral-950/40 text-neutral-500'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isDone ? (
                          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                        ) : isCurrent ? (
                          <Loader2 size={18} className="text-[#FF1E46] animate-spin shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-neutral-700 shrink-0" />
                        )}
                        <div>
                          <div className="text-xs font-bold">{step.title}</div>
                          <div className="text-[11px] text-neutral-400 mt-0.5">{step.desc}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-neutral-400">
                        {isDone ? 'COMPLETE' : isCurrent ? 'RUNNING' : 'PENDING'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {isComplete && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-center text-xs font-semibold text-emerald-400 flex items-center justify-center gap-2 animate-bounce">
                  <Sparkles size={16} /> Transcoding complete! Adding to your channel catalog...
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isTranscoding && (
          <div className="px-6 py-4 border-t border-neutral-800 flex items-center justify-between bg-neutral-950/60">
            <span className="text-xs text-neutral-500 font-mono">
              Max file size: 4.2 GB · Codec: H.264/AAC
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStartTranscode}
                disabled={!title.trim()}
                className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-[#FF003F] hover:brightness-110 rounded-xl transition shadow-lg disabled:opacity-40"
              >
                Upload & Transcode
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
