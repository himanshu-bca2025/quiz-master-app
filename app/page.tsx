"use client";
import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import QuizGame from './components/QuizGame';
import Store from './components/Store';
import ForgotPassword from './components/ForgotPassword';

interface User {
  id: string;
  username: string;
}

interface UserData {
  username: string;
  password: string;
  dateOfBirth: string;
  coins: number;
  level: number;
  questionsCompleted: number;
  purchases: string[];
  theme: string;
}

export default function QuizApp() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<'login' | 'dashboard' | 'game' | 'store' | 'forgot-password'>('login');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user data on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser) as User;
      setCurrentUser(user);
      loadUserData(user.id);
      setCurrentPage('dashboard');
    }
    setLoading(false);
  }, []);

  const loadUserData = (userId: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[userId]) {
      setUserData(users[userId]);
    }
  };

  const handleLogin = (userId: string, username: string) => {
    setCurrentUser({ id: userId, username });
    localStorage.setItem('currentUser', JSON.stringify({ id: userId, username }));
    loadUserData(userId);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserData(null);
    localStorage.removeItem('currentUser');
    setCurrentPage('login');
  };

  const handleUpdateCoins = (newCoins: number, newLevel?: number) => {
    if (userData && currentUser) {
      const updated: UserData = { ...userData, coins: newCoins };
      if (newLevel) updated.level = newLevel;
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      users[currentUser.id] = updated;
      localStorage.setItem('users', JSON.stringify(users));
      setUserData(updated);
    }
  };

  if (loading) {
    return <div className="w-screen h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950 flex items-center justify-center text-white text-2xl">🎮 Loading...</div>;
  }

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950 overflow-hidden">
      {currentPage === 'login' && <LoginPage onLogin={handleLogin} onForgotPassword={() => setCurrentPage('forgot-password')} />}
      {currentPage === 'forgot-password' && <ForgotPassword onBack={() => setCurrentPage('login')} />}
      {currentPage === 'dashboard' && currentUser && userData && (
        <Dashboard 
          user={currentUser} 
          userData={userData}
          onLogout={handleLogout}
          onStartGame={() => setCurrentPage('game')}
          onOpenStore={() => setCurrentPage('store')}
        />
      )}
      {currentPage === 'game' && currentUser && userData && (
        <QuizGame 
          user={currentUser}
          userData={userData}
          onUpdateCoins={handleUpdateCoins}
          onBackToDashboard={() => {
            loadUserData(currentUser.id);
            setCurrentPage('dashboard');
          }}
        />
      )}
      {currentPage === 'store' && currentUser && userData && (
        <Store 
          userData={userData}
          onBuyItem={(itemId: string) => {
            const updated = { ...userData };
            if (!updated.purchases) updated.purchases = [];
            updated.purchases.push(itemId);
            const users = JSON.parse(localStorage.getItem('users') || '{}');
            users[currentUser.id] = updated;
            localStorage.setItem('users', JSON.stringify(users));
            setUserData(updated);
          }}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
    </div>
  );
}
