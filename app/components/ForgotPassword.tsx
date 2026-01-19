'use client';
import React, { useState } from 'react';

interface ForgotPasswordProps {
  onBack: () => void;
}

export default function ForgotPassword({ onBack }: ForgotPasswordProps) {
  const [step, setStep] = useState<'verify' | 'reset'>('verify');
  const [username, setUsername] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [foundUser, setFoundUser] = useState<any>(null);
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
    setNewPassword(pass);
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

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim()) {
      setError('Please enter your username');
      return;
    }

    if (!dateOfBirth) {
      setError('Please enter your date of birth');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const userId = username.toLowerCase().replace(/\s+/g, '');

    if (!users[userId]) {
      setError('Username not found!');
      return;
    }

    if (users[userId].dateOfBirth !== dateOfBirth) {
      setError('Date of birth does not match!');
      return;
    }

    // Verification successful
    setFoundUser(users[userId]);
    setStep('reset');
    setSuccess('✅ Identity verified! Please set a new password.');
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newPassword.trim()) {
      setError('Please enter a new password');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (passwordStrength < 2) {
      setError('Password is too weak! Use at least 6 characters.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const userId = username.toLowerCase().replace(/\s+/g, '');

    // Update password
    users[userId].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));

    setSuccess('✅ Password reset successfully! You can now login with your new password.');
    setTimeout(() => {
      onBack();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-900 rounded-3xl shadow-2xl border border-purple-500/30 p-8 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-3">🔑</div>
            <h1 className="text-3xl font-black text-white mb-2">RESET PASSWORD</h1>
            <p className="text-gray-400 text-sm">Verify your identity to reset password</p>
          </div>

          {/* Step 1: Verify */}
          {step === 'verify' && (
            <form onSubmit={handleVerify} className="space-y-4">
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

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>

              {error && (
                <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-105 active:scale-95"
              >
                ✓ Verify Identity
              </button>
            </form>
          )}

          {/* Step 2: Reset */}
          {step === 'reset' && (
            <form onSubmit={handleReset} className="space-y-4">
              <div className="bg-green-900/20 border border-green-500 text-green-200 px-4 py-3 rounded-lg text-sm">
                ✅ Identity verified! Now set your new password.
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
                />
                {newPassword && (
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

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
                />
                {confirmPassword && newPassword === confirmPassword && (
                  <p className="text-green-400 text-xs mt-1">✓ Passwords match!</p>
                )}
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">✗ Passwords do not match!</p>
                )}
              </div>

              {error && (
                <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-900/30 border border-green-500 text-green-200 px-4 py-3 rounded-lg text-sm">
                  {success}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-105 active:scale-95"
              >
                🔒 Reset Password
              </button>
            </form>
          )}

          {/* Back Button */}
          <div className="mt-6 text-center">
            <button
              onClick={onBack}
              className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors text-sm"
            >
              ← Back to Login
            </button>
          </div>

          {/* Info */}
          <div className="mt-8 bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <p className="text-xs text-gray-400 text-center">
              🔐 Your security is important to us. Use a strong password with numbers and special characters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
