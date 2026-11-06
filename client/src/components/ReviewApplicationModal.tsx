import React, { useState } from 'react';
import api from '../services/api';
import { Application } from '../types';
import { X, Check, Ban, AlertCircle, Clock, User, HeartHandshake, Phone, Mail, MapPin } from 'lucide-react';

interface ReviewApplicationModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReviewApplicationModal: React.FC<ReviewApplicationModalProps> = ({
  application,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [adminNotes, setAdminNotes] = useState(application?.adminNotes || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !application) return null;

  const handleDecision = async (status: 'APPROVED' | 'REJECTED') => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.patch(`/applications/${application.id}/review`, {
        status,
        adminNotes: adminNotes.trim() || undefined,
      });

      if (res.data?.success) {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update application review.');
    } finally {
      setLoading(false);
    }
  };

  const isPending = application.status === 'PENDING';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Clock className="w-4 h-4" />
              <span>Application Review Workflow</span>
            </div>
            <h2 className="text-lg font-bold">Review Application</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center space-x-2 border border-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Applicant & Project Banner */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Project</p>
                <h4 className="font-bold text-slate-900 text-sm">{application.project?.title}</h4>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                  application.status === 'APPROVED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : application.status === 'REJECTED'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {application.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-xs text-slate-600">
              <div className="flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-800">
                  {application.user?.firstName} {application.user?.lastName}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 rounded font-bold">
                  {application.user?.role}
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{application.user?.email}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{application.user?.phone || 'No phone'}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{application.user?.governorate || 'Gaza'}</span>
              </div>
            </div>
          </div>

          {/* Motivation Letter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Motivation Statement
            </label>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed max-h-36 overflow-y-auto">
              {application.motivation}
            </div>
          </div>

          {/* Notes if provided */}
          {application.notes && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Applicant Additional Notes
              </label>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
                {application.notes}
              </div>
            </div>
          )}

          {/* Internal Admin Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Internal Admin Notes / Committee Feedback
            </label>
            <textarea
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Record verification details, assigned distribution center, or rationale for decision..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 text-xs text-slate-800 resize-none"
            />
          </div>

          {/* Review Actions */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Decision will notify applicant automatically.
            </span>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleDecision('REJECTED')}
                className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold text-xs transition flex items-center space-x-1.5 disabled:opacity-50"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleDecision('APPROVED')}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/30 transition flex items-center space-x-1.5 disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

