import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Project, ProjectApplicant } from '../types';
import { X, Calendar, Users, HeartHandshake, FileText, CheckCircle2, AlertCircle, Eye } from 'lucide-react';

interface ProjectDrawerProps {
  projectId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectApplicant: (applicantId: string) => void;
}

export const ProjectDrawer: React.FC<ProjectDrawerProps> = ({
  projectId,
  isOpen,
  onClose,
  onSelectApplicant,
}) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (projectId && isOpen) {
      const fetchDetails = async () => {
        try {
          setLoading(true);
          const res = await api.get(`/projects/${projectId}`);
          if (res.data?.success) {
            setProject(res.data.project);
          }
        } catch (err) {
          console.error('Error fetching project drawer details:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [projectId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Project Inspector
            </span>
            <h2 className="text-lg font-bold line-clamp-1">{project?.title || 'Loading...'}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="py-20 text-center text-slate-400">Loading project data...</div>
          ) : project ? (
            <>
              {/* Cover & Badges */}
              {project.imageUrl && (
                <div className="h-44 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Status & Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Total Apps</p>
                  <p className="text-xl font-extrabold text-slate-800">
                    {project.stats?.totalApplications || 0}
                  </p>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl">
                  <p className="text-[10px] font-bold text-amber-600 uppercase">Pending</p>
                  <p className="text-xl font-extrabold text-amber-700">
                    {project.stats?.pendingApplications || 0}
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase">Beneficiaries</p>
                  <p className="text-xl font-extrabold text-emerald-700">
                    {project.stats?.beneficiaries || 0}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl">
                  <p className="text-[10px] font-bold text-blue-600 uppercase">Volunteers</p>
                  <p className="text-xl font-extrabold text-blue-700">
                    {project.stats?.volunteers || 0}
                  </p>
                </div>
              </div>

              {/* Info sections */}
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400 mb-1">
                    Description
                  </h4>
                  <p className="text-slate-700 leading-relaxed text-xs">{project.description}</p>
                </div>

                {project.requirements && (
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400 mb-1">
                      Requirements
                    </h4>
                    <p className="text-slate-700 text-xs leading-relaxed">{project.requirements}</p>
                  </div>
                )}

                <div className="flex items-center space-x-6 text-xs text-slate-500 pt-1">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}{' '}
                      to{' '}
                      {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Ongoing'}
                    </span>
                  </span>
                  <span className="font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    Status: {project.status}
                  </span>
                </div>
              </div>

              {/* Applicants Table */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm text-slate-900">
                    Applicants ({project.applicants?.length || 0})
                  </h3>
                  <span className="text-xs text-slate-500">Click to review</span>
                </div>

                {(!project.applicants || project.applicants.length === 0) ? (
                  <p className="text-xs text-slate-400 py-6 text-center bg-slate-50 rounded-xl">
                    No applications received for this project yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3 font-semibold">Applicant</th>
                          <th className="py-2.5 px-3 font-semibold">Role</th>
                          <th className="py-2.5 px-3 font-semibold">Status</th>
                          <th className="py-2.5 px-3 font-semibold">Date</th>
                          <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {project.applicants.map((a: ProjectApplicant) => (
                          <tr
                            key={a.id}
                            onClick={() => onSelectApplicant(a.id)}
                            className="hover:bg-emerald-50/50 cursor-pointer transition"
                          >
                            <td className="py-2.5 px-3">
                              <p className="font-semibold text-slate-800">{a.applicantName}</p>
                              <p className="text-[10px] text-slate-400">{a.applicantEmail}</p>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                {a.applicantRole}
                              </span>
                            </td>
                            <td className="py-2.5 px-3">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  a.status === 'APPROVED'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : a.status === 'REJECTED'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {a.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                              {new Date(a.appliedAt).toLocaleDateString()}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button className="text-emerald-700 hover:text-emerald-900 font-semibold p-1">
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

