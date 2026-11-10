import React, { useState } from 'react';
import {
  Clock,
  ListVideo,
  History,
  Trash2,
  Play,
  Share2,
  FolderPlus,
  Check,
} from 'lucide-react';
import { Video, Playlist } from '../../types';
import { samplePlaylists } from '../../data/mockData';

interface LibraryViewProps {
  watchLaterVideos: Video[];
  onSelectVideo: (video: Video) => void;
  onRemoveWatchLater: (videoId: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  watchLaterVideos,
  onSelectVideo,
  onRemoveWatchLater,
}) => {
  const [activeTab, setActiveTab] = useState<'watchLater' | 'playlists' | 'history'>('watchLater');
  const [playlists, setPlaylists] = useState<Playlist[]>(samplePlaylists);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleCreatePlaylist = () => {
    if (!newPlaylistTitle.trim()) return;
    const newPl: Playlist = {
      id: `pl_${Date.now()}`,
      userId: 'usr_me',
      title: newPlaylistTitle.trim(),
      description: 'Custom user created playlist.',
      visibility: 'PUBLIC',
      videos: watchLaterVideos.slice(0, 2),
      createdAt: 'Just now',
    };
    setPlaylists((prev) => [newPl, ...prev]);
    setNewPlaylistTitle('');
    setShowCreateModal(false);
  };

  return (
    <div className="max-w-[1500px] mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Library Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-black text-white">Your Library</h1>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            Saved playlists, watch history and watch-later queue
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
          <button
            onClick={() => setActiveTab('watchLater')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'watchLater'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Clock size={14} className={activeTab === 'watchLater' ? 'text-[#FF1E46]' : ''} />
            <span>Watch Later ({watchLaterVideos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('playlists')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'playlists'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ListVideo size={14} className={activeTab === 'playlists' ? 'text-[#FF1E46]' : ''} />
            <span>Playlists ({playlists.length})</span>
          </button>
        </div>
      </div>

      {/* Tab Content: Watch Later */}
      {activeTab === 'watchLater' && (
        <div className="space-y-4">
          {watchLaterVideos.length === 0 ? (
            <div className="text-center py-16 bg-neutral-900/40 border border-neutral-800/80 rounded-2xl space-y-3">
              <Clock size={36} className="mx-auto text-neutral-600" />
              <h3 className="font-bold text-white text-base">Your Watch Later queue is empty</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Hover any video on the feed and click the clock icon to save it here for later viewing.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {watchLaterVideos.map((vid) => (
                <div
                  key={vid.id}
                  className="p-3 bg-neutral-900 border border-neutral-800 rounded-2xl flex gap-3 group hover:border-neutral-700 transition"
                >
                  <div
                    onClick={() => onSelectVideo(vid)}
                    className="relative w-36 aspect-video bg-neutral-950 rounded-xl overflow-hidden cursor-pointer shrink-0"
                  >
                    <img
                      src={vid.thumbnailUrl}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <Play size={18} className="fill-white text-white" />
                    </div>
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/85 text-[10px] font-mono text-white">
                      {formatDuration(vid.duration)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4
                        onClick={() => onSelectVideo(vid)}
                        className="font-bold text-xs sm:text-sm text-white group-hover:text-[#FF1E46] transition line-clamp-2 cursor-pointer"
                      >
                        {vid.title}
                      </h4>
                      <p className="text-[11px] text-neutral-400 font-mono mt-1">
                        {vid.channel.name}
                      </p>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => onRemoveWatchLater(vid.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-400 rounded-lg hover:bg-neutral-800 transition"
                        title="Remove from Watch Later"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Playlists */}
      {activeTab === 'playlists' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-white text-base">Custom Playlists</h3>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#FF003F] text-white hover:bg-red-600 transition flex items-center gap-1.5"
            >
              <FolderPlus size={15} /> Create Playlist
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {playlists.map((pl) => (
              <div
                key={pl.id}
                className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ListVideo size={18} className="text-[#FF1E46]" />
                    <h4 className="font-bold text-white text-base">{pl.title}</h4>
                  </div>
                  <span className="text-xs font-mono text-neutral-400">
                    {pl.videos.length} videos
                  </span>
                </div>

                <p className="text-xs text-neutral-400">{pl.description}</p>

                {/* Playlist Video Thumbnails */}
                <div className="grid grid-cols-2 gap-2">
                  {pl.videos.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => onSelectVideo(v)}
                      className="relative aspect-video rounded-lg overflow-hidden bg-neutral-950 cursor-pointer group"
                    >
                      <img
                        src={v.thumbnailUrl}
                        alt={v.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <Play size={16} className="fill-white text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-sm space-y-4">
            <h3 className="font-bold text-white text-base">New Playlist</h3>
            <input
              type="text"
              placeholder="Playlist name..."
              value={newPlaylistTitle}
              onChange={(e) => setNewPlaylistTitle(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#FF003F]"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-3.5 py-2 text-xs font-semibold text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePlaylist}
                disabled={!newPlaylistTitle.trim()}
                className="px-4 py-2 rounded-xl bg-[#FF003F] text-white text-xs font-bold hover:bg-red-600 transition disabled:opacity-40"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
