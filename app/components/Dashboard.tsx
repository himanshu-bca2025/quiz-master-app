'use client';
import React from 'react';

interface DashboardProps {
  user: { id: string; username: string };
  userData: {
    coins: number;
    level: number;
    questionsCompleted: number;
    purchases: string[];
    theme: string;
  };
  onLogout: () => void;
  onStartGame: () => void;
  onOpenStore: () => void;
}

export default function Dashboard({ user, userData, onLogout, onStartGame, onOpenStore }: DashboardProps) {
  const coinsToNextLevel = 100 - (userData.coins % 100);
  const progressPercent = (userData.coins % 100) / 100 * 100;

  const getNextMilestone = () => {
    if (userData.coins < 100) return 100;
    if (userData.coins < 200) return 200;
    if (userData.coins < 300) return 300;
    if (userData.coins < 500) return 500;
    return 1000;
  };

  const getDifficultyLevel = () => {
    if (userData.coins >= 300) return { name: "HARD MODE 🔥", color: "from-red-600 to-orange-600" };
    if (userData.coins >= 100) return { name: "MEDIUM MODE ⚡", color: "from-yellow-600 to-orange-600" };
    return { name: "EASY MODE 🟢", color: "from-green-600 to-emerald-600" };
  };

  const getQuestionCount = () => {
    if (userData.coins >= 300) return 20;
    if (userData.coins >= 200) return 15;
    if (userData.coins >= 100) return 10;
    return 5;
  };

  const difficulty = getDifficultyLevel();
  const nextMilestone = getNextMilestone();

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950 text-white overflow-y-auto">
      <div className="w-full min-h-screen flex flex-col p-4 sm:p-6 md:p-8">
        <div className="flex-1 max-w-6xl w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black">🎮 QUIZ MASTER</h1>
            <p className="text-gray-400 text-sm sm:text-base">Welcome back, <span className="text-purple-400 font-bold">{user.username}</span>!</p>
          </div>
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-xl font-bold transition-all w-full sm:w-auto"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
          {/* Coins Card */}
          <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg border border-yellow-400/30">
            <div className="text-2xl sm:text-4xl mb-1 sm:mb-2">💰</div>
            <p className="text-yellow-100 text-xs sm:text-sm mb-1">Total Coins</p>
            <p className="text-xl sm:text-3xl font-black">{userData.coins}</p>
          </div>

          {/* Level Card */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg border border-purple-400/30">
            <div className="text-2xl sm:text-4xl mb-1 sm:mb-2">⭐</div>
            <p className="text-purple-100 text-xs sm:text-sm mb-1">Level</p>
            <p className="text-xl sm:text-3xl font-black">{userData.level}</p>
          </div>

          {/* Questions Card */}
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg border border-blue-400/30">
            <div className="text-2xl sm:text-4xl mb-1 sm:mb-2">🎯</div>
            <p className="text-blue-100 text-xs sm:text-sm mb-1">Questions</p>
            <p className="text-xl sm:text-3xl font-black">{userData.questionsCompleted}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-slate-900/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-slate-700">
          <div className="flex justify-between mb-2">
            <p className="text-gray-300 font-bold text-sm sm:text-base">Progress to Level {userData.level + 1}</p>
            <p className="text-purple-400 font-bold text-sm sm:text-base">{userData.coins % 100}/100 coins</p>
          </div>
          <div className="w-full bg-slate-800 h-3 sm:h-4 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          {userData.coins >= 100 && (
            <p className="text-green-400 text-xs sm:text-sm mt-2">✅ You unlocked a new difficulty level!</p>
          )}
        </div>

        {/* Main Action Buttons */}
        <div className="space-y-4 mb-8">
          <button
            onClick={onStartGame}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-black py-4 rounded-2xl text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg"
          >
            🚀 START GAME
          </button>

          <button
            onClick={onOpenStore}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-4 rounded-2xl text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg"
          >
            🛍️ VISIT STORE ({userData.coins} coins available)
          </button>
        </div>

        {/* Info Section */}
        <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700">
          <h3 className="font-bold text-lg mb-4">📈 Your Progress</h3>
          <div className="space-y-2 text-sm text-gray-300">
            <p>🎮 Current Difficulty: <span className="text-yellow-400 font-bold">{difficulty.name}</span></p>
            <p>📊 Questions per Game: <span className="text-purple-400 font-bold">{getQuestionCount()}</span></p>
            <p>🎯 Level {userData.level} - {userData.coins % 100}/100 coins to next level</p>
            <p>💡 Next Milestone: {nextMilestone} coins</p>
            <p>🎁 Items Purchased: {userData.purchases.length}</p>
            <p className="pt-2 text-xs">
              💰 Earn coins by playing quizzes!<br/>
              ✅ Each correct answer: +2 coins<br/>
              🏆 Perfect game (all correct): +10 bonus coins
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
