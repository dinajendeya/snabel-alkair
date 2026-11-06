import React, { useState } from 'react';
import { Project } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import api from '../services/api';
import { X, Send, HeartHandshake, Users, CheckCircle2, AlertCircle } from 'lucide-react';

interface ApplicationModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  project,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { fetchNotifications } = useNotifications();

  const [motivation, setMotivation] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen || !project) return null;

  const isBeneficiary = user?.role === 'BENEFICIARY';
  const isVolunteer = user?.role === 'VOLUNTEER';

  const motivationLabel = isBeneficiary
    ? 'Why do you need this support? (Explain family situation or urgent needs)'
    : isVolunteer
    ? 'Why do you want to participate? (Explain your skills and availability)'
    : 'Statement of Motivation';

  const motivationPlaceholder = isBeneficiary
    ? 'e.g. We are displaced from northern Gaza with five family members and urgently need winter supplies and food parcels...'
    : 'e.g. I am an experienced teacher ready to commit 8 hours weekly to math and literacy circles in the learning tents...';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (motivation.trim().length < 10) {
      setError('Please provide at least 10 characters for your motivation statement.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const res = await api.post('/applications', {
        projectId: project.id,
        motivation: motivation.trim(),
        notes: notes.trim() || undefined,
      });

      if (res.data?.success) {
        setSubmittedSuccess(true);
        await fetchNotifications();
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setMotivation('');
    setNotes('');
    setError(null);
    setSubmittedSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white relative">
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-1.5 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-emerald-100 text-xs font-semibold uppercase tracking-wider mb-2">
            {isBeneficiary ? <HeartHandshake className="w-4 h-4" /> : <Users className="w-4 h-4" />}
            <span>{user?.role} Application</span>
          </div>

          <h2 className="text-xl font-bold leading-tight line-clamp-1">{project.title}</h2>
          <p className="text-emerald-100/90 text-xs mt-1">
            Applying as <strong className="text-white">{user?.firstName} {user?.lastName}</strong> ({user?.email})
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {submittedSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Application Submitted!</h3>
              <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                Thank you! Your application has been logged into the system and is now awaiting administrative committee review. You will receive real-time notifications on updates.
              </p>
              <div className="pt-2">
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition"
                >
                  Return to Projects
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 bg-red-50 text-red-700 rounded-xl text-xs flex items-start space-x-2 border border-red-200">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {motivationLabel} <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  placeholder={motivationPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-800 placeholder-slate-400 resize-none transition"
                />
                <span className="text-[11px] text-slate-400">Minimum 10 characters</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any extra details, special family needs, or available schedule..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-800 placeholder-slate-400 resize-none transition"
                />
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-[11px] text-emerald-800">
                🔒 <strong>Automatic Workflow:</strong> Upon submission, a confirmation record and audit log are created, and our coordinators in Gaza are immediately notified.
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/30 transition flex items-center space-x-1.5 disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Submit Application'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

