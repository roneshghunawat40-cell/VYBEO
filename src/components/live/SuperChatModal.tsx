import React, { useState } from 'react';
import { X, DollarSign, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { currentUser } from '../../data/mockData';
import { LiveChatMessage } from '../../types';

interface SuperChatModalProps {
  streamId: string;
  onClose: () => void;
  onSend: (message: LiveChatMessage) => void;
}

interface Tier {
  amount: number; // in dollars
  color: string;
  badge: string;
  charLimit: number;
  duration: string;
}

const TIERS: Tier[] = [
  { amount: 2, color: '#1E88E5', badge: 'Supporter', charLimit: 50, duration: '2 min' },
  { amount: 5, color: '#00ACC1', badge: 'Bronze', charLimit: 100, duration: '5 min' },
  { amount: 10, color: '#FDD835', badge: 'Silver', charLimit: 150, duration: '10 min' },
  { amount: 20, color: '#FB8C00', badge: 'Gold', charLimit: 200, duration: '30 min' },
  { amount: 50, color: '#FF003F', badge: 'Diamond', charLimit: 250, duration: '1 hour' },
  { amount: 100, color: '#9C27B0', badge: 'Obsidian Elite', charLimit: 300, duration: '2 hours' },
];

export const SuperChatModal: React.FC<SuperChatModalProps> = ({ streamId, onClose, onSend }) => {
  const [selectedTier, setSelectedTier] = useState<Tier>(TIERS[1]);
  const [messageText, setMessageText] = useState('');

  const handleSend = () => {
    if (!messageText.trim()) return;

    // Trigger celebratory confetti
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#FF003F', '#FF1E46', '#FFD700', '#00D1FF', '#FFFFFF'],
    });

    const newSuperChat: LiveChatMessage = {
      id: `sc_${Date.now()}`,
      liveStreamId: streamId,
      userId: currentUser.id,
      user: currentUser,
      message: messageText.trim(),
      isSuperChat: true,
      amountCents: selectedTier.amount * 100,
      tierColor: selectedTier.color,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    onSend(newSuperChat);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#FF003F]/20 text-[#FF1E46]">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Send Super Chat</h3>
              <p className="text-xs text-neutral-400">Highlight your message and support the creator</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tier Grid */}
        <div className="p-5 space-y-4">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Select Amount
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {TIERS.map((tier) => {
              const isSelected = selectedTier.amount === tier.amount;
              return (
                <button
                  key={tier.amount}
                  onClick={() => setSelectedTier(tier)}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all text-left ${
                    isSelected
                      ? 'border-white bg-neutral-800 shadow-md scale-102'
                      : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center text-sm font-bold text-white font-mono">
                    ${tier.amount}
                  </div>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded font-semibold text-white truncate max-w-full"
                    style={{ backgroundColor: tier.color }}
                  >
                    {tier.badge}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">{tier.duration} pin</span>
                </button>
              );
            })}
          </div>

          {/* Live Preview Card */}
          <div>
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 block">
              Message Preview
            </label>
            <div
              className="rounded-xl overflow-hidden text-white shadow-lg border border-neutral-800"
              style={{ backgroundColor: selectedTier.color }}
            >
              <div className="px-4 py-2 bg-black/20 flex items-center justify-between text-xs">
                <span className="font-bold">{currentUser.displayName}</span>
                <span className="font-mono font-bold">${selectedTier.amount}.00</span>
              </div>
              <div className="p-3 text-sm bg-black/40 min-h-[48px] break-words">
                {messageText || 'Your message will appear highlighted right here in chat!'}
              </div>
            </div>
          </div>

          {/* Message Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Your Message
              </label>
              <span className="text-[11px] font-mono text-neutral-500">
                {messageText.length} / {selectedTier.charLimit}
              </span>
            </div>
            <textarea
              rows={2}
              maxLength={selectedTier.charLimit}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Cheer on the broadcaster..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF003F] resize-none"
            />
          </div>

          {/* Action Button */}
          <button
            onClick={handleSend}
            disabled={!messageText.trim()}
            className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:brightness-110"
            style={{ backgroundColor: selectedTier.color }}
          >
            <DollarSign size={18} />
            <span>Send ${selectedTier.amount}.00 Super Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
