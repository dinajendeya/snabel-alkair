import React from 'react';
import { User, Application } from '../types';
import { X, User as UserIcon, Mail, Phone, MapPin, Calendar, FileText, CheckCircle2 } from 'lucide-react';

interface UserDetailModalProps {
  user: (User & { applications?: Application[]; status?: string }) | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, isOpen, onClose }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-lg shadow-md">
              {user.firstName?.[0]}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold">{user.firstName} {user.lastName}</h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 uppercase tracking-wider">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Personal Info Grid */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs">
            <div className="flex items-center space-x-2 text-slate-600">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>{user.phone || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>{user.governorate || 'Gaza Governorate'}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Status: <strong className="text-slate-800">{user.status || 'Active'}</strong></span>
            </div>
          </div>

          {/* Biography */}
          {user.bio && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Background & Biography
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed p-3 bg-slate-50 rounded-xl border border-slate-200">
                {user.bio}
              </p>
            </div>
          )}

          {/* Detailed Applications & Project Participation */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Project Participation & History ({user.applications?.length || 0})
            </h4>

            {(!user.applications || user.applications.length === 0) ? (
              <p className="text-xs text-slate-400 p-4 text-center bg-slate-50 rounded-xl">
                No project applications recorded yet.
              </p>
            ) : (
              <div className="space-y-2">
                {user.applications.map((app: any) => (
                  <div
                    key={app.id}
                    className="p-3 bg-white border border-slate-200 rounded-xl text-xs flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-slate-800">{app.project?.title || 'Relief Project'}</p>
                      <p className="text-[10px] text-slate-400">
                        Applied: {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        app.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

