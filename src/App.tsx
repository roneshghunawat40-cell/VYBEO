import React, { useState, useMemo } from 'react';
import { Navbar } from './components/layout/Navbar';
import { HeroSpotlight } from './components/feed/HeroSpotlight';
import { VideoCard } from './components/feed/VideoCard';
import { WatchView } from './components/watch/WatchView';
import { VybeoShortsFeed } from './components/shorts/VybeoShortsFeed';
import { LiveDirectory } from './components/live/LiveDirectory';
import { LiveRoom } from './components/live/LiveRoom';
import { BroadcasterStudio } from './components/live/BroadcasterStudio';
import { CreatorStudio } from './components/studio/CreatorStudio';
import { UploadModal } from './components/studio/UploadModal';
import { LibraryView } from './components/library/LibraryView';
import { MobileAppSimulator } from './components/mobile/MobileAppSimulator';
import { initialVideos, initialLiveStreams } from './data/mockData';
import { Video, LiveStream } from './types';
import { Radio, Search, Filter } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<
    'feed' | 'watch' | 'shorts' | 'live' | 'live_room' | 'studio' | 'broadcaster' | 'library'
  >('feed');
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>(initialLiveStreams);
  const [selectedVideo, setSelectedVideo] = useState<Video>(initialVideos[0]);
  const [selectedLiveStream, setSelectedLiveStream] = useState<LiveStream>(initialLiveStreams[0]);
  const [watchLaterIds, setWatchLaterIds] = useState<string[]>(['v2']);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSimulator, setShowMobileSimulator] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const categories = ['All', 'Technology', 'AI & Robotics', 'Music', 'Science', 'Gaming'];

  // Filtered videos based on category and search query
  const filteredVideos = useMemo(() => {
    return videos.filter((v) => {
      const matchesCategory = categoryFilter === 'All' || v.category === categoryFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.channel.name.toLowerCase().includes(q) ||
        v.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [videos, categoryFilter, searchQuery]);

  const watchLaterVideos = useMemo(() => {
    return videos.filter((v) => watchLaterIds.includes(v.id));
  }, [videos, watchLaterIds]);

  const toggleWatchLater = (video: Video) => {
    setWatchLaterIds((prev) =>
      prev.includes(video.id) ? prev.filter((id) => id !== video.id) : [...prev, video.id]
    );
  };

  const handleSelectVideo = (video: Video) => {
    setSelectedVideo(video);
    setCurrentView('watch');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectLiveStream = (stream: LiveStream) => {
    setSelectedLiveStream(stream);
    setCurrentView('live_room');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVideoCreated = (newVideo: Video) => {
    setVideos((prev) => [newVideo, ...prev]);
  };

  const handleDeleteVideo = (videoId: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== videoId));
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-neutral-100 flex flex-col font-sans">
      {/* Strict 3-Zone Navigation Header */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenMobileSimulator={() => setShowMobileSimulator(true)}
        onOpenUpload={() => setShowUploadModal(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {/* VIEW 1: Browse Feed */}
        {currentView === 'feed' && (
          <div className="max-w-[1700px] mx-auto px-4 lg:px-8 py-6 space-y-6">
            {/* Category Segmented Filter Buttons (Interactive controls) */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
                    categoryFilter === cat
                      ? 'bg-neutral-100 text-neutral-950 font-bold shadow-md'
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Featured Premiere Spotlight */}
            {!searchQuery && categoryFilter === 'All' && (
              <HeroSpotlight
                video={videos[0]}
                onWatchVideo={handleSelectVideo}
                onWatchLive={handleSelectLiveStream}
              />
            )}

            {/* Video Feed Section Header */}
            <div className="flex items-center justify-between pt-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                {searchQuery ? `Search results for "${searchQuery}"` : categoryFilter === 'All' ? 'Trending Streams & Premieres' : `${categoryFilter} Feeds`}
              </h2>
              <span className="text-xs font-mono text-neutral-400">
                {filteredVideos.length} assets available
              </span>
            </div>

            {/* Video Cards Grid */}
            {filteredVideos.length === 0 ? (
              <div className="py-20 text-center space-y-3 bg-neutral-900/30 border border-neutral-800 rounded-2xl">
                <Search size={32} className="mx-auto text-neutral-600" />
                <h3 className="font-bold text-white text-base">No matching video assets found</h3>
                <p className="text-xs text-neutral-400">
                  Try adjusting your keywords or switch category filter to "All".
                </p>
                <button
                  onClick={() => {
                    setCategoryFilter('All');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white transition"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-8">
                {filteredVideos.map((vid) => (
                  <VideoCard
                    key={vid.id}
                    video={vid}
                    onSelect={handleSelectVideo}
                    onToggleWatchLater={toggleWatchLater}
                    isWatchLater={watchLaterIds.includes(vid.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: Video Watch Page */}
        {currentView === 'watch' && (
          <WatchView
            video={selectedVideo}
            allVideos={videos}
            onSelectVideo={handleSelectVideo}
            onToggleWatchLater={toggleWatchLater}
            isWatchLater={watchLaterIds.includes(selectedVideo.id)}
          />
        )}

        {/* VIEW 3: Vertical Shorts Feed */}
        {currentView === 'shorts' && <VybeoShortsFeed />}

        {/* VIEW 4: Live Streams Directory */}
        {currentView === 'live' && (
          <LiveDirectory
            liveStreams={liveStreams}
            onSelectStream={handleSelectLiveStream}
            onGoLive={() => setCurrentView('broadcaster')}
          />
        )}

        {/* VIEW 5: Live Stream Room */}
        {currentView === 'live_room' && (
          <LiveRoom
            stream={selectedLiveStream}
            onBack={() => setCurrentView('live')}
          />
        )}

        {/* VIEW 6: Broadcaster Studio ("Go Live") */}
        {currentView === 'broadcaster' && (
          <BroadcasterStudio onBack={() => setCurrentView('feed')} />
        )}

        {/* VIEW 7: Creator Studio (Analytics, Content Manager, Monetization) */}
        {currentView === 'studio' && (
          <CreatorStudio
            videos={videos}
            onUploadClick={() => setShowUploadModal(true)}
            onSelectVideo={handleSelectVideo}
            onDeleteVideo={handleDeleteVideo}
            onVideoCreated={handleVideoCreated}
          />
        )}

        {/* VIEW 8: Library (Watch Later, Playlists) */}
        {currentView === 'library' && (
          <LibraryView
            watchLaterVideos={watchLaterVideos}
            onSelectVideo={handleSelectVideo}
            onRemoveWatchLater={(videoId) =>
              setWatchLaterIds((prev) => prev.filter((id) => id !== videoId))
            }
          />
        )}
      </main>

      {/* Global Upload & Transcode Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onVideoCreated={(newVid) => {
            handleVideoCreated(newVid);
            setShowUploadModal(false);
          }}
        />
      )}

      {/* Mobile App Simulator (React Native / Expo simulation) */}
      {showMobileSimulator && (
        <MobileAppSimulator
          videos={videos}
          liveStreams={liveStreams}
          onClose={() => setShowMobileSimulator(false)}
          onOpenDesktopWatch={handleSelectVideo}
        />
      )}
    </div>
  );
}
