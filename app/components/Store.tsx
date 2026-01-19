'use client';
import React, { useState } from 'react';

interface StoreProps {
  userData: {
    coins: number;
    level: number;
    questionsCompleted: number;
    purchases: string[];
    theme: string;
  };
  onBuyItem: (itemId: string) => void;
  onBack: () => void;
}

interface StoreItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  emoji: string;
  type: 'theme' | 'power-up' | 'unlock';
  benefit: string;
}

const STORE_ITEMS: StoreItem[] = [
  {
    id: 'dark-mode',
    name: 'Dark Mode Theme',
    description: 'Smooth dark theme for late-night studying',
    cost: 50,
    emoji: '🌙',
    type: 'theme',
    benefit: 'Makes it easy on your eyes'
  },
  {
    id: 'light-mode',
    name: 'Light Mode Theme',
    description: 'Bright and clean white theme',
    cost: 50,
    emoji: '☀️',
    type: 'theme',
    benefit: 'Perfect for daytime'
  },
  {
    id: 'cyberpunk-theme',
    name: 'Cyberpunk Theme',
    description: 'Futuristic neon theme with cyan and magenta',
    cost: 100,
    emoji: '🎮',
    type: 'theme',
    benefit: 'Ultra cool vibes'
  },
  {
    id: 'skip-one',
    name: 'Skip Question Card',
    description: 'Skip one difficult question without penalty',
    cost: 25,
    emoji: '⏭️',
    type: 'power-up',
    benefit: 'Use when you need a break'
  },
  {
    id: 'double-coins',
    name: 'Double Coins Booster',
    description: 'Get 4 coins instead of 2 for correct answers in next game',
    cost: 75,
    emoji: '💸',
    type: 'power-up',
    benefit: 'Perfect for coin farming'
  },
  {
    id: 'hint-system',
    name: 'Hint System Unlock',
    description: 'Get hints for difficult questions',
    cost: 40,
    emoji: '💡',
    type: 'unlock',
    benefit: 'Shows 2 wrong options'
  },
  {
    id: 'leaderboard',
    name: 'Leaderboard Access',
    description: 'Compete with other players globally',
    cost: 100,
    emoji: '🏅',
    type: 'unlock',
    benefit: 'See how you rank worldwide'
  },
  {
    id: 'daily-challenge',
    name: 'Daily Challenge Pass',
    description: 'Get special daily quests with bonus coins',
    cost: 50,
    emoji: '📅',
    type: 'unlock',
    benefit: 'Extra coins every day'
  },
  {
    id: 'practice-mode',
    name: 'Unlimited Practice Mode',
    description: 'Practice unlimited questions without coin limit',
    cost: 150,
    emoji: '🎯',
    type: 'unlock',
    benefit: 'Learn without pressure'
  },
  {
    id: 'vip-pass',
    name: 'VIP Pass (1 Month)',
    description: 'Become VIP! Get 3x coins, early access to new levels',
    cost: 250,
    emoji: '👑',
    type: 'unlock',
    benefit: 'Premium experience'
  },
];

export default function Store({ userData, onBuyItem, onBack }: StoreProps) {
  const [notification, setNotification] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'theme' | 'power-up' | 'unlock'>('all');

  const handlePurchase = (item: StoreItem) => {
    if (userData.coins < item.cost) {
      setNotification('❌ Not enough coins!');
      setTimeout(() => setNotification(null), 2000);
      return;
    }

    if (userData.purchases.includes(item.id)) {
      setNotification('✅ Already owned!');
      setTimeout(() => setNotification(null), 2000);
      return;
    }

    onBuyItem(item.id);
    setNotification(`✅ ${item.name} purchased!`);
    setTimeout(() => setNotification(null), 2000);
  };

  const filteredItems = filter === 'all' ? STORE_ITEMS : STORE_ITEMS.filter(item => item.type === filter);

  const isOwned = (itemId: string) => userData.purchases.includes(itemId);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950 text-white p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black">🛍️ IN-GAME STORE</h1>
            <p className="text-gray-400 text-sm sm:text-base">Spend your coins wisely!</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            <div className="bg-yellow-600/30 border border-yellow-500 rounded-xl px-4 sm:px-6 py-2 sm:py-3 w-full sm:w-auto">
              <p className="text-xs text-gray-300">Available Coins</p>
              <p className="text-2xl sm:text-3xl font-black text-yellow-400">💰 {userData.coins}</p>
            </div>
            <button
              onClick={onBack}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 sm:py-3 rounded-xl font-bold transition-all w-full sm:w-auto"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className="fixed top-4 right-4 bg-slate-900 border-2 border-purple-500 rounded-xl px-6 py-3 text-lg font-bold animate-in fade-in slide-in-from-top-4 duration-300">
            {notification}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {(['all', 'theme', 'power-up', 'unlock'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-6 py-2 rounded-xl font-bold transition-all ${
                filter === type
                  ? 'bg-purple-600 text-white scale-105'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              {type === 'all' ? '⭐ All Items' : type === 'theme' ? '🎨 Themes' : type === 'power-up' ? '⚡ Power-ups' : '🔓 Unlocks'}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {filteredItems.map((item) => {
            const owned = isOwned(item.id);
            const canAfford = userData.coins >= item.cost;

            return (
              <div
                key={item.id}
                className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border transition-all transform hover:scale-105 ${
                  owned
                    ? 'bg-green-900/30 border-green-500/50'
                    : 'bg-slate-900/80 border-purple-500/30 backdrop-blur-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-3 sm:mb-4">
                  <div className="text-4xl sm:text-5xl">{item.emoji}</div>
                  {owned && (
                    <div className="bg-green-600 px-2 sm:px-3 py-1 rounded-lg text-xs font-bold">
                      ✅ OWNED
                    </div>
                  )}
                </div>

                <h3 className="text-lg sm:text-xl font-bold mb-2">{item.name}</h3>
                <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">{item.description}</p>

                <div className="bg-slate-800/50 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4 border border-slate-700">
                  <p className="text-xs text-gray-300 mb-1">Benefit:</p>
                  <p className="text-xs sm:text-sm font-bold text-cyan-300">{item.benefit}</p>
                </div>

                <div className="flex items-center justify-between gap-2 sm:gap-3">
                  <div className="text-xl sm:text-2xl font-black text-yellow-400">
                    💰 {item.cost}
                  </div>
                  <button
                    onClick={() => handlePurchase(item)}
                    disabled={owned || !canAfford}
                    className={`px-4 sm:px-6 py-2 rounded-xl font-bold transition-all transform text-sm sm:text-base ${
                      owned
                        ? 'bg-green-600/50 text-gray-400 cursor-not-allowed'
                        : canAfford
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white hover:scale-110 active:scale-95'
                        : 'bg-red-600/50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {owned ? 'Owned' : canAfford ? 'Buy' : 'Lock'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Info */}
        <div className="mt-8 sm:mt-12 bg-slate-900/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700">
          <h3 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4">💡 Store Tips</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-300">
            <li>✨ Themes personalize your experience</li>
            <li>⚡ Power-ups give you advantages</li>
            <li>🔓 Unlocks access new features</li>
            <li>📈 VIP Pass gives 3x coin multiplier!</li>
            <li>🎯 Some items are permanent, some are one-time use</li>
            <li>💰 Earn coins by playing and winning quizzes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
