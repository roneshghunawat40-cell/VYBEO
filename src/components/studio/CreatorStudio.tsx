import React, { useState } from 'react';
import {
  TrendingUp,
  Eye,
  Clock,
  Users,
  DollarSign,
  Upload,
  Plus,
  Play,
  Film,
  Trash2,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Layers,
  CreditCard,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { currentChannel, sampleAnalyticsData, monetizationAccount } from '../../data/mockData';
import { Video } from '../../types';
import { UploadModal } from './UploadModal';

interface CreatorStudioProps {
  videos: Video[];
  onUploadClick: () => void;
  onSelectVideo: (video: Video) => void;
  onDeleteVideo: (videoId: string) => void;
  onVideoCreated: (video: Video) => void;
}

export const CreatorStudio: React.FC<CreatorStudioProps> = ({
  videos,
  onSelectVideo,
  onDeleteVideo,
  onVideoCreated,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'content' | 'monetization'>('analytics');
  const [timeRange, setTimeRange] = useState<'7d' | '28d' | '90d'>('7d');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<'views' | 'watchTimeHours' | 'subscribers' | 'revenue'>('views');

  // Filter channel videos
  const channelVideos = videos.filter((v) => v.channelId === currentChannel.id || v.channel.handle === currentChannel.handle);

  // Compute aggregate metrics
  const totalViews = sampleAnalyticsData.reduce((acc, d) => acc + d.views, 0);
  const totalWatchHours = sampleAnalyticsData.reduce((acc, d) => acc + d.watchTimeHours, 0);
  const totalSubscribersGained = sampleAnalyticsData.reduce((acc, d) => acc + d.subscribers, 0);
  const totalRevenue = sampleAnalyticsData.reduce((acc, d) => acc + d.revenue, 0);

  // Chart data calculations
  const maxVal = Math.max(...sampleAnalyticsData.map((d) => d[selectedMetric])) || 1;
  const chartHeight = 180;
  const chartWidth = 720;
  const points = sampleAnalyticsData.map((d, i) => {
    const x = (i / (sampleAnalyticsData.length - 1)) * chartWidth;
    const y = chartHeight - (d[selectedMetric] / maxVal) * (chartHeight - 20) - 10;
    return `${x},${y}`;
  });
  const pathD = `M ${points.join(' L ')}`;
  const areaD = `M ${points[0]} L ${points.join(' L ')} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`;

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6">
      {/* Studio Header & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <img
            src={currentChannel.user.avatarUrl}
            alt={currentChannel.name}
            className="w-12 h-12 rounded-full border-2 border-[#FF003F] object-cover"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">{currentChannel.name}</h1>
              <span className="text-xs px-2 py-0.5 rounded bg-[#FF003F]/15 text-[#FF1E46] font-mono font-semibold">
                Creator Studio
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-mono mt-0.5">
              @{currentChannel.handle} · {currentChannel.subscriberCount.toLocaleString()} Subscribers · {currentChannel.totalViews.toLocaleString()} Lifetime Views
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-[#FF003F] text-white hover:brightness-110 transition shadow-lg shadow-red-600/20 flex items-center gap-2"
          >
            <Upload size={16} />
            <span>Upload & Transcode</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'bg-neutral-800 text-white shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <TrendingUp size={15} className={activeTab === 'analytics' ? 'text-[#FF1E46]' : ''} />
          <span>Channel Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'content'
              ? 'bg-neutral-800 text-white shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Layers size={15} className={activeTab === 'content' ? 'text-[#FF1E46]' : ''} />
          <span>Content Manager ({channelVideos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('monetization')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'monetization'
              ? 'bg-neutral-800 text-white shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <DollarSign size={15} className={activeTab === 'monetization' ? 'text-[#FF1E46]' : ''} />
          <span>Earn & Stripe Connect</span>
        </button>
      </div>

      {/* Tab 1: Analytics Overview */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Views KPI */}
            <div
              onClick={() => setSelectedMetric('views')}
              className={`p-5 rounded-2xl border cursor-pointer transition ${
                selectedMetric === 'views'
                  ? 'border-[#FF003F] bg-neutral-900 shadow-lg'
                  : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between text-neutral-400 text-xs">
                <span>Views</span>
                <Eye size={16} className="text-[#FF1E46]" />
              </div>
              <div className="text-2xl font-black text-white font-mono mt-2 tabular-nums">
                {totalViews.toLocaleString()}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono mt-1">
                <span>↑ 24.8%</span>
                <span className="text-neutral-500">vs previous period</span>
              </div>
            </div>

            {/* Watch Time KPI */}
            <div
              onClick={() => setSelectedMetric('watchTimeHours')}
              className={`p-5 rounded-2xl border cursor-pointer transition ${
                selectedMetric === 'watchTimeHours'
                  ? 'border-[#FF003F] bg-neutral-900 shadow-lg'
                  : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between text-neutral-400 text-xs">
                <span>Watch Time (Hours)</span>
                <Clock size={16} className="text-[#FF1E46]" />
              </div>
              <div className="text-2xl font-black text-white font-mono mt-2 tabular-nums">
                {totalWatchHours.toLocaleString()}h
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono mt-1">
                <span>↑ 18.2%</span>
                <span className="text-neutral-500">vs previous period</span>
              </div>
            </div>

            {/* Subscribers KPI */}
            <div
              onClick={() => setSelectedMetric('subscribers')}
              className={`p-5 rounded-2xl border cursor-pointer transition ${
                selectedMetric === 'subscribers'
                  ? 'border-[#FF003F] bg-neutral-900 shadow-lg'
                  : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between text-neutral-400 text-xs">
                <span>Subscribers</span>
                <Users size={16} className="text-[#FF1E46]" />
              </div>
              <div className="text-2xl font-black text-white font-mono mt-2 tabular-nums">
                +{totalSubscribersGained.toLocaleString()}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono mt-1">
                <span>↑ 31.4%</span>
                <span className="text-neutral-500">vs previous period</span>
              </div>
            </div>

            {/* Estimated Revenue KPI */}
            <div
              onClick={() => setSelectedMetric('revenue')}
              className={`p-5 rounded-2xl border cursor-pointer transition ${
                selectedMetric === 'revenue'
                  ? 'border-[#FF003F] bg-neutral-900 shadow-lg'
                  : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between text-neutral-400 text-xs">
                <span>Estimated Revenue</span>
                <DollarSign size={16} className="text-[#FF1E46]" />
              </div>
              <div className="text-2xl font-black text-white font-mono mt-2 tabular-nums">
                ${totalRevenue.toFixed(2)}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono mt-1">
                <span>↑ 42.1%</span>
                <span className="text-neutral-500">vs previous period</span>
              </div>
            </div>
          </div>

          {/* Interactive Trend Chart */}
          <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-white text-base capitalize">
                  {selectedMetric.replace(/([A-Z])/g, ' $1')} Trend
                </h3>
                <p className="text-xs text-neutral-400">Daily velocity and engagement curve</p>
              </div>

              {/* Time Range Selector */}
              <div className="flex items-center gap-1 p-1 bg-neutral-950 rounded-xl border border-neutral-800">
                {(['7d', '28d', '90d'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setTimeRange(r)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                      timeRange === r ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Visualizer */}
            <div className="w-full overflow-x-auto no-scrollbar pt-4">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-48 overflow-visible"
              >
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF003F" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#FF003F" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Guide Lines */}
                <line x1="0" y1="40" x2={chartWidth} y2="40" stroke="#27272a" strokeDasharray="3 3" />
                <line x1="0" y1="90" x2={chartWidth} y2="90" stroke="#27272a" strokeDasharray="3 3" />
                <line x1="0" y1="140" x2={chartWidth} y2="140" stroke="#27272a" strokeDasharray="3 3" />

                {/* Shaded Area */}
                <path d={areaD} fill="url(#chartGradient)" />

                {/* Primary Trend Line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#FF003F"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points */}
                {sampleAnalyticsData.map((d, i) => {
                  const x = (i / (sampleAnalyticsData.length - 1)) * chartWidth;
                  const y = chartHeight - (d[selectedMetric] / maxVal) * (chartHeight - 20) - 10;
                  return (
                    <g key={i} className="group/point">
                      <circle
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#FF003F"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        className="cursor-pointer group-hover/point:scale-150 transition-transform"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* X-Axis Dates */}
              <div className="flex justify-between text-[11px] font-mono text-neutral-500 pt-2 border-t border-neutral-800">
                {sampleAnalyticsData.map((d) => (
                  <span key={d.date}>{d.date}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Content Manager */}
      {activeTab === 'content' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">Channel Videos</h3>
              <p className="text-xs text-neutral-400">Manage visibility, transcoding status and metadata</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#FF003F] text-white hover:bg-red-600 transition flex items-center gap-1.5"
            >
              <Plus size={15} /> New Video
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-neutral-950/60 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
                <tr>
                  <th className="px-6 py-3.5">Video</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Visibility</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5 text-right">Views</th>
                  <th className="px-4 py-3.5 text-right">Likes</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {channelVideos.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-neutral-500">
                      No videos uploaded yet. Click "Upload & Transcode" to publish your first video.
                    </td>
                  </tr>
                ) : (
                  channelVideos.map((vid) => (
                    <tr key={vid.id} className="hover:bg-neutral-800/40 transition">
                      <td className="px-6 py-3.5">
                        <div
                          onClick={() => onSelectVideo(vid)}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <div className="relative w-24 aspect-video rounded-lg overflow-hidden bg-neutral-950 shrink-0 border border-neutral-800">
                            <img
                              src={vid.thumbnailUrl}
                              alt={vid.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                              <Play size={16} className="text-white fill-white" />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold text-white group-hover:text-[#FF1E46] transition line-clamp-1 max-w-sm">
                              {vid.title}
                            </div>
                            <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                              {vid.category} {vid.isShort ? '· Short' : ''}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Transcode Status Badge */}
                      <td className="px-4 py-3.5 font-mono">
                        {vid.status === 'TRANSCODED' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 size={12} /> TRANSCODED
                          </span>
                        ) : vid.status === 'PROCESSING' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
                            <Clock3 size={12} /> PROCESSING
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                            <AlertTriangle size={12} /> {vid.status}
                          </span>
                        )}
                      </td>

                      {/* Visibility */}
                      <td className="px-4 py-3.5 font-mono font-medium">
                        <span className="text-neutral-300 capitalize">{vid.visibility.toLowerCase()}</span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3.5 font-mono text-neutral-400 whitespace-nowrap">
                        {vid.createdAt}
                      </td>

                      {/* Views */}
                      <td className="px-4 py-3.5 text-right font-mono text-white tabular-nums">
                        {vid.viewsCount.toLocaleString()}
                      </td>

                      {/* Likes */}
                      <td className="px-4 py-3.5 text-right font-mono text-neutral-300 tabular-nums">
                        {vid.likesCount.toLocaleString()}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-3.5 text-right">
                        <button
                          onClick={() => onDeleteVideo(vid.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition"
                          title="Delete Video"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Monetization & Stripe Connect */}
      {activeTab === 'monetization' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stripe Connect Account Card */}
            <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Stripe Connect Account</h3>
                    <p className="text-xs text-neutral-400 font-mono">
                      {monetizationAccount.stripeAccountId}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Active & Verified
                </span>
              </div>

              <div className="divide-y divide-neutral-800 text-xs">
                <div className="py-2.5 flex justify-between">
                  <span className="text-neutral-400">Lifetime Earnings</span>
                  <span className="font-mono font-bold text-white text-sm">
                    ${(monetizationAccount.earningsTotalCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-neutral-400">Pending Payout Balance</span>
                  <span className="font-mono font-bold text-[#FF1E46] text-sm">
                    ${(monetizationAccount.payoutPendingCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-neutral-400">Next Scheduled Payout</span>
                  <span className="font-mono text-neutral-300">Nov 15, 2026 (Direct ACH)</span>
                </div>
              </div>

              <button
                onClick={() => alert('Opening Stripe Connect Dashboard in test mode...')}
                className="w-full py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <span>View Stripe Express Dashboard</span>
                <ExternalLink size={14} />
              </button>
            </div>

            {/* Revenue Streams Breakdown */}
            <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Sparkles size={18} className="text-[#FF1E46]" />
                Revenue Streams Breakdown
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-300">Super Chats & Live Tipping</span>
                    <span className="font-mono font-bold text-white">58% ($8,637)</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden">
                    <div className="h-full bg-[#FF003F] rounded-full" style={{ width: '58%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-300">Creator Channel Memberships</span>
                    <span className="font-mono font-bold text-white">28% ($4,170)</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '28%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-300">Programmatic Premium Ad Revenue</span>
                    <span className="font-mono font-bold text-white">14% ($2,085)</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: '14%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onVideoCreated={(newVid) => {
            onVideoCreated(newVid);
            setShowUploadModal(false);
          }}
        />
      )}
    </div>
  );
};
