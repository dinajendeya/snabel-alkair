import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, ArrowLeft, HeartHandshake, AlertCircle, ShieldAlert, Sparkles, Key } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, returnUrl } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const res = await login(email.trim(), password);
      if (res.success) {
        navigate(returnUrl || '/profile', { replace: true });
      } else {
        setError(res.message || 'Login failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl shadow-slate-900/10 border border-slate-200/80 space-y-7 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            to="/auth"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Gateway</span>
          </Link>
        </div>

        {/* Title */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2 shadow-md shadow-emerald-600/20">
            <HeartHandshake className="w-7 h-7 stroke-[2]" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Account Login
          </h1>
          <p className="text-xs text-slate-500">
            Sign in to access your applications, notifications, and dashboard.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 text-red-700 rounded-xl text-xs flex items-center space-x-2 border border-red-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. name@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <Link
                to="/forgot-password"
                className="text-xs text-emerald-700 hover:underline font-medium"
              >
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xl shadow-emerald-600/25 transition flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Quick Demo Credentials for Reviewers */}
        <div className="pt-3 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center flex items-center justify-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>1-Click Demo Evaluation Accounts</span>
          </p>

          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => handleDemoFill('admin@senabil.org', 'admin123')}
              className="p-2 rounded-xl border border-slate-200 hover:border-slate-800 hover:bg-slate-900 hover:text-white transition text-center font-bold"
            >
              👑 Admin
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('tariq.volunteer@senabil.org', 'volunteer123')}
              className="p-2 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-800 transition text-center font-bold"
            >
              🤝 Volunteer
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('ahmed.beneficiary@gmail.com', 'beneficiary123')}
              className="p-2 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800 transition text-center font-bold"
            >
              🤲 Beneficiary
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <span className="text-xs text-slate-500">Don't have an account yet? </span>
          <Link to="/choose-role" className="text-xs font-bold text-emerald-700 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

