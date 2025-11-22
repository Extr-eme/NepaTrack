import { MapPin, Calendar, DollarSign } from 'lucide-react';
import { Project } from '../lib/supabase';

interface ProjectListProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
  searchTerm: string;
  selectedStatus: string;
  selectedCategory: string;
}

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

const formatCurrency = (amount: number | null) => {
  if (!amount) return 'Budget not specified';
  return new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'TBD';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
};

export default function ProjectList({
  projects,
  onProjectClick,
  searchTerm,
  selectedStatus,
  selectedCategory
}: ProjectListProps) {
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-4">
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-500 text-lg font-medium">No projects found matching your criteria.</p>
        </div>
      ) : (
        filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => onProjectClick(project)}
            className="bg-white rounded shadow-sm hover:shadow-lg transition-all cursor-pointer p-6 border border-slate-200 hover:border-slate-300"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-slate-900">{project.title}</h3>
              <span className={`px-3 py-1 rounded text-xs font-semibold uppercase tracking-wide ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-600 mb-3">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{project.location}</span>
            </div>

            <p className="text-slate-700 text-sm mb-5 line-clamp-2 leading-relaxed">
              {project.description || 'No description available.'}
            </p>

            <div className="flex flex-wrap gap-5 text-sm">
              <div className="flex items-center gap-1.5 text-slate-700">
                <DollarSign className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">{formatCurrency(project.budget)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">{formatDate(project.start_date)} - {formatDate(project.end_date)}</span>
              </div>
              <span className="px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wide bg-slate-100 text-slate-800">
                {project.category}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}