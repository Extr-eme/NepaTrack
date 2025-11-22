import { X, MapPin, Calendar, DollarSign, Building2, Users } from 'lucide-react';
import { Project } from '../lib/supabase';

interface ProjectDetailsModalProps {
  project: Project | null;
  onClose: () => void;
}

const formatCurrency = (amount: number | null) => {
  if (!amount) return 'Not specified';
  return new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Not specified';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getStatusColor = (status: Project['status']) => {
  switch (status) {
    case 'Completed':
      return 'bg-emerald-100 text-emerald-800';
    case 'In Progress':
      return 'bg-blue-100 text-blue-800';
    case 'Planning':
      return 'bg-amber-100 text-amber-800';
    case 'On Hold':
      return 'bg-rose-100 text-rose-800';
    default:
      return 'bg-slate-100 text-slate-800';
  }
};

export default function ProjectDetailsModal({ project, onClose }: ProjectDetailsModalProps) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-8 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">{project.title}</h2>
            <div className="flex items-center gap-2 mt-2">
              <MapPin className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-600">{project.location}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wide ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
              <span className="px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wide bg-slate-100 text-slate-800">
                {project.category}
              </span>
            </div>
            <p className="text-slate-700 leading-relaxed text-base">
              {project.description || 'No description available.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-slate-200 rounded p-6">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-slate-700" />
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">Budget</span>
              </div>
              <p className="text-xl font-bold text-slate-900">{formatCurrency(project.budget)}</p>
            </div>

            <div className="border border-slate-200 rounded p-6">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-5 h-5 text-slate-700" />
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">Contractor</span>
              </div>
              <p className="text-xl font-bold text-slate-900">{project.contractor || 'Not assigned'}</p>
            </div>

            <div className="border border-slate-200 rounded p-6">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-slate-700" />
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">Start Date</span>
              </div>
              <p className="text-xl font-bold text-slate-900">{formatDate(project.start_date)}</p>
            </div>

            <div className="border border-slate-200 rounded p-6">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-slate-700" />
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">End Date</span>
              </div>
              <p className="text-xl font-bold text-slate-900">{formatDate(project.end_date)}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-semibold text-gray-600">Funding Source</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {project.funding_source || 'Not specified'}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-gray-600">Hash Value</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {project.id || 'Not specified'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}