import { Activity, Mail, Lock, UserCircle, Heart, Zap } from 'lucide-react';
import { useState } from 'react';

interface BurnoutLoginProps {
  onLogin: () => void;
}

const roles = ['Nurse', 'Doctor', 'Resident', 'Supervisor'];

export function BurnoutLogin({ onLogin }: BurnoutLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password && role) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'linear-gradient(to bottom right, #6FAFB5, #5A9BA1, #4A868C)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <div className="relative">
              <Heart className="w-10 h-10" style={{ color: '#6FAFB5' }} fill="#6FAFB5" />
              <Zap className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" fill="white" />
            </div>
          </div>
          <h1 className="text-white text-3xl mb-2">Sign in to <span className="italic">BurnoutWatch</span></h1>
          <p className="text-white/80">We're here to support you</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-gray-700 text-sm mb-2 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                  style={{ '--tw-ring-color': '#6FAFB5' } as React.CSSProperties}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-gray-700 text-sm mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                  style={{ '--tw-ring-color': '#6FAFB5' } as React.CSSProperties}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-gray-700 text-sm mb-2 block">Role</label>
              <div className="relative">
                <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all appearance-none cursor-pointer"
                  style={{ '--tw-ring-color': '#6FAFB5' } as React.CSSProperties}
                  required
                >
                  <option value="">Select your role</option>
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full text-white py-4 rounded-xl transition-all shadow-lg mt-6 hover:opacity-90 flex items-center justify-center gap-2"
              style={{ backgroundColor: '#6FAFB5', boxShadow: '0 10px 40px rgba(111, 175, 181, 0.3)' }}
            >
              Start Burnout Check-In
              <Heart className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-sm hover:underline" style={{ color: '#6FAFB5' }}>
              Forgot your password?
            </a>
          </div>
        </div>

        <p className="text-center text-white/80 text-sm mt-6">© 2026 BurnoutWatch. All rights reserved.</p>
      </div>
    </div>
  );
}
