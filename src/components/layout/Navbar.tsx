import React from 'react';
import { Search, Upload, Smartphone, Radio, X } from 'lucide-react';
import { VybeoLogo } from '../brand/VybeoLogo';
import { currentUser } from '../../data/mockData';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: any) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenMobileSimulator: () => void;
  onOpenUpload: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  searchQuery,
  onSearchChange,
  onOpenMobileSimulator,
  onOpenUpload,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#09090b]/90 backdrop-blur-xl border-b border-neutral-800/80 px-4 lg:px-8 py-3">
      {/* 3-Zone Contract: Brand — Nav Links — Primary Action */}
      <div className="max-w-[1700px] mx-auto flex items-center justify-between gap-6 lg:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div
          onClick={() => onNavigate('feed')}
          className="cursor-pointer shrink-0"
        >
          <VybeoLogo size={32} showText={true} />
        </div>

        {/* Zone 2: Concise Nav Links (Single-Line, 1-2 words) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium shrink-0">
          <button
            onClick={() => onNavigate('feed')}
            className={`whitespace-nowrap transition-colors ${
              currentView === 'feed'
                ? 'text-[#FF1E46] font-bold'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            Explore
          </button>

          <button
            onClick={() => onNavigate('shorts')}
            className={`whitespace-nowrap transition-colors ${
              currentView === 'shorts'
                ? 'text-[#FF1E46] font-bold'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            Shorts
          </button>

          <button
            onClick={() => onNavigate('live')}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              currentView === 'live'
                ? 'text-[#FF1E46] font-bold'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#FF003F] animate-ping" />
            Live Streams
          </button>

          <button
            onClick={() => onNavigate('studio')}
            className={`whitespace-nowrap transition-colors ${
              currentView === 'studio'
                ? 'text-[#FF1E46] font-bold'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            Creator Studio
          </button>

          <button
            onClick={() => onNavigate('broadcaster')}
            className={`whitespace-nowrap transition-colors ${
              currentView === 'broadcaster'
                ? 'text-[#FF1E46] font-bold'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            Go Live
          </button>

          <button
            onClick={() => onNavigate('library')}
            className={`whitespace-nowrap transition-colors ${
              currentView === 'library'
                ? 'text-[#FF1E46] font-bold'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            Library
          </button>
        </nav>

        {/* Zone 3: Search & Primary Action */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Integrated Search Input */}
          <div className="relative w-44 sm:w-64 md:w-72">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search videos, creators..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-neutral-900/90 border border-neutral-800 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF003F] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Mobile Client Simulator Toggle */}
          <button
            onClick={onOpenMobileSimulator}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white hover:border-neutral-700 transition"
            title="Experience React Native Mobile View"
          >
            <Smartphone size={15} className="text-[#FF1E46]" />
            <span className="whitespace-nowrap">App Simulator</span>
          </button>

          {/* Primary Action Button: Upload */}
          <button
            onClick={onOpenUpload}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-[#FF003F] text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 hover:brightness-110 transition shadow-md shadow-red-600/20 whitespace-nowrap"
          >
            <Upload size={16} />
            <span className="hidden sm:inline">Upload</span>
          </button>

          {/* User Avatar */}
          <div
            onClick={() => onNavigate('studio')}
            className="cursor-pointer shrink-0"
            title="Open Creator Studio"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.displayName}
              className="w-8 h-8 rounded-full border border-neutral-700 object-cover hover:border-[#FF003F] transition"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
