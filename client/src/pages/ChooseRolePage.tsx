import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { HeartHandshake, Users, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';

export const ChooseRolePage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('BENEFICIARY');
  const navigate = useNavigate();

  const handleProceed = () => {
    navigate(`/register?role=${selectedRole}`);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-3xl p-8 sm:p-12 shadow-2xl shadow-slate-900/10 border border-slate-200/80 space-y-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Navigation back to gateway */}
        <button
          onClick={() => navigate('/auth')}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Gateway</span>
        </button>

        {/* Title */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Step 1 of 2: Role Selection
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            How would you like to participate?
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Choose whether you are seeking humanitarian assistance or offering your skills to volunteer with our initiatives.
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          
          {/* Card 1: Beneficiary */}
          <div
            onClick={() => setSelectedRole('BENEFICIARY')}
            className={`cursor-pointer p-6 rounded-3xl border-2 transition-all duration-200 relative flex flex-col justify-between ${
              selectedRole === 'BENEFICIARY'
                ? 'border-emerald-600 bg-emerald-50/40 shadow-lg shadow-emerald-600/10'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            {selectedRole === 'BENEFICIARY' && (
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-sm">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Beneficiary</h3>
                <p className="text-xs text-slate-500 mt-1">
                  A person or family seeking humanitarian support from our active relief programs.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Assistance areas:
                </p>
                <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-600 font-medium">
                  <span className="px-2 py-0.5 rounded-lg bg-slate-100">Food Support</span>
                  <span className="px-2 py-0.5 rounded-lg bg-slate-100">Winter Aid</span>
                  <span className="px-2 py-0.5 rounded-lg bg-slate-100">Water Aid</span>
                  <span className="px-2 py-0.5 rounded-lg bg-slate-100">Medical</span>
                  <span className="px-2 py-0.5 rounded-lg bg-slate-100">Orphan Care</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Volunteer */}
          <div
            onClick={() => setSelectedRole('VOLUNTEER')}
            className={`cursor-pointer p-6 rounded-3xl border-2 transition-all duration-200 relative flex flex-col justify-between ${
              selectedRole === 'VOLUNTEER'
                ? 'border-emerald-600 bg-emerald-50/40 shadow-lg shadow-emerald-600/10'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            {selectedRole === 'VOLUNTEER' && (
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-sm">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Volunteer</h3>
                <p className="text-xs text-slate-500 mt-1">
                  A person willing to contribute their professional skills, time, or field effort.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Volunteer roles:
                </p>
                <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-600 font-medium">
                  <span className="px-2 py-0.5 rounded-lg bg-slate-100">Educator</span>
                  <span className="px-2 py-0.5 rounded-lg bg-slate-100">Developer</span>
                  <span className="px-2 py-0.5 rounded-lg bg-slate-100">Field Worker</span>
                  <span className="px-2 py-0.5 rounded-lg bg-slate-100">Social Worker</span>
                  <span className="px-2 py-0.5 rounded-lg bg-slate-100">Medic</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Proceed Action Button */}
        <div className="pt-4 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Selected: <strong className="text-slate-800">{selectedRole}</strong>
          </span>

          <button
            onClick={handleProceed}
            className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition flex items-center space-x-2"
          >
            <span>Continue to Registration</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

