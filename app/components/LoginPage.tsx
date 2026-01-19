'use client';
import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (userId: string, username: string) => void;
  onForgotPassword: () => void;
}

export default function LoginPage({ onLogin, onForgotPassword }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 6) strength++;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[!@#$%^&*]/.test(pass)) strength++;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pass = e.target.value;
    setPassword(pass);
    checkPasswordStrength(pass);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 2) return 'bg-orange-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 2) return 'Fair';
    if (passwordStrength <= 3) return 'Good';
    return 'Strong';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }

    if (isSignup && !dateOfBirth) {
      setError('Please enter your date of birth');
      return;
    }

    if (isSignup && passwordStrength < 2) {
      setError('Password is too weak! Use at least 6 characters');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const userId = username.toLowerCase().replace(/\s+/g, '');

    if (isSignup) {
      if (users[userId]) {
        setError('Username already exists!');
        return;
      }
      users[userId] = {
        username,
        password,
        dateOfBirth,
        coins: 0,
        level: 1,
        questionsCompleted: 0,
        purchases: [],
        theme: 'dark'
      };
      localStorage.setItem('users', JSON.stringify(users));
      setError('');
    } else {
      if (!users[userId]) {
        setError('User not found! Please sign up first.');
        return;
      }
      if (users[userId].password !== password) {
        setError('Incorrect password!');
        return;
      }
    }

    onLogin(userId, username);
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto">
      <div className="w-full max-w-md">
        <div className="bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-purple-500/30 p-6 sm:p-8 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="text-5xl sm:text-6xl mb-3">🎮</div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">QUIZ MASTER</h1>
            <p className="text-gray-400 text-xs sm:text-sm">Learn, Play & Earn Coins!</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
              />
              {isSignup && password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-400">Password Strength:</span>
                    <span className={`text-xs font-bold ${
                      passwordStrength <= 1 ? 'text-red-400' :
                      passwordStrength <= 2 ? 'text-orange-400' :
                      passwordStrength <= 3 ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${getPasswordStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Date of Birth (Signup only) */}
            {isSignup && (
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black py-4 sm:py-5 text-lg sm:text-xl rounded-xl sm:rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
            >
              {isSignup ? '✨ Create Account' : '🚀 Login'}
            </button>
          </form>

          {/* Toggle & Forgot Password */}
          <div className="mt-6 space-y-3">
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                {isSignup ? 'Already have an account? ' : "Don't have an account? "}
                <button
                  onClick={() => {
                    setIsSignup(!isSignup);
                    setError('');
                    setPassword('');
                    setDateOfBirth('');
                  }}
                  className="text-purple-400 hover:text-purple-300 font-bold transition-colors"
                >
                  {isSignup ? 'Login' : 'Sign Up'}
                </button>
              </p>
            </div>

            {!isSignup && (
              <div className="text-center">
                <button
                  onClick={onForgotPassword}
                  className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors text-sm"
                >
                  🔑 Forgot Password?
                </button>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="mt-8 bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <p className="text-xs text-gray-400 text-center">
              🎯 Start with Level 1 and earn coins to unlock new levels and themes!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
