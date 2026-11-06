import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartHandshake, LogIn, UserPlus, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const AuthGatewayPage: React.FC = () => {
  const { isAuthenticated, returnUrl } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(returnUrl || '/profile', { replace: true });
    }
  }, [isAuthenticated, returnUrl, navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl shadow-slate-900/10 border border-slate-200/80 text-center space-y-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Brand Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25">
          <HeartHandshake className="w-9 h-9 stroke-[2]" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Authentication Gateway
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome to Senabil
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Please choose how you would like to proceed into the humanitarian platform.
          </p>
        </div>

        {/* Return destination notice if present */}
        {returnUrl && (
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-800 text-left flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 mt-0.5 text-emerald-600 flex-shrink-0" />
            <span>
              You will automatically return to your selected project application after signing in or registering.
            </span>
          </div>
        )}

        {/* Action Choice Buttons */}
        <div className="space-y-4">
          <Link
            to="/login"
            className="w-full py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition shadow-md flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <LogIn className="w-5 h-5 text-emerald-400" />
              <span>Already Have Account</span>
            </div>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/choose-role"
            className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/25 flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <UserPlus className="w-5 h-5" />
              <span>Create New Account</span>
            </div>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Micro-policy notice */}
        <p className="text-[11px] text-slate-400">
          By signing in or registering, you agree to Senabil's Humanitarian Data Protection Policy and Community Code of Conduct.
        </p>
      </div>
    </div>
  );
};

