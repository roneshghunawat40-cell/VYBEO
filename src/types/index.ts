export type Role = 'USER' | 'VERIFIED_CREATOR' | 'MODERATOR' | 'ADMIN';
export type VideoVisibility = 'PUBLIC' | 'UNLISTED' | 'PRIVATE';
export type VideoStatus = 'UPLOADING' | 'PROCESSING' | 'TRANSCODED' | 'FAILED';
export type StreamStatus = 'IDLE' | 'ACTIVE' | 'CONCLUDED';

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio?: string;
  role: Role;
  isVerified?: boolean;
}

export interface Channel {
  id: string;
  userId: string;
  user: User;
  handle: string;
  name: string;
  bannerUrl?: string;
  description?: string;
  subscriberCount: number;
  totalViews: number;
  isSubscribed?: boolean;
}

export interface VideoChapter {
  title: string;
  timestamp: number; // in seconds
}

export interface Video {
  id: string;
  channelId: string;
  channel: Channel;
  title: string;
  description: string;
  thumbnailUrl: string;
  sourceFileUrl: string;
  hlsMasterUrl?: string;
  duration: number; // in seconds
  viewsCount: number;
  likesCount: number;
  dislikesCount: number;
  isShort: boolean;
  visibility: VideoVisibility;
  status: VideoStatus;
  category: string;
  tags: string[];
  chapters?: VideoChapter[];
  allowComments: boolean;
  createdAt: string;
  isLiked?: boolean;
  isDisliked?: boolean;
  isSavedWatchLater?: boolean;
  transcodeProgress?: number; // 0-100 for simulator
  currentTranscodeStep?: string;
}

export interface Comment {
  id: string;
  videoId: string;
  userId: string;
  user: User;
  parentId?: string;
  content: string;
  likesCount: number;
  isCreatorHeart: boolean;
  isLiked?: boolean;
  createdAt: string;
  replies?: Comment[];
}

export interface LiveChatMessage {
  id: string;
  liveStreamId: string;
  userId: string;
  user: User;
  message: string;
  isSuperChat: boolean;
  amountCents: number; // e.g., 500 = $5.00
  createdAt: string;
  tierColor?: string;
}

export interface LiveStream {
  id: string;
  channelId: string;
  channel: Channel;
  streamKey: string;
  playbackUrl?: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
  category: string;
  status: StreamStatus;
  viewerCount: number;
  startedAt?: string;
  messages: LiveChatMessage[];
}

export interface Playlist {
  id: string;
  userId: string;
  title: string;
  description?: string;
  visibility: VideoVisibility;
  videos: Video[];
  createdAt: string;
}

export interface DailyAnalytics {
  date: string;
  views: number;
  watchTimeHours: number;
  subscribers: number;
  revenue: number;
}

export interface MonetizationAccount {
  stripeAccountId?: string;
  isEligible: boolean;
  isApproved: boolean;
  earningsTotalCents: number;
  payoutPendingCents: number;
}
