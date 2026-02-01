import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "../../../api/project.api"; // Adjust path
import { format } from "date-fns"; // Recommended for date formatting

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: project, isLoading, isError } = useQuery({
    queryKey: ['project', id],
    queryFn: () => getProjectById(id!),
    enabled: !!id
  });

  if (isLoading) return <div className="p-10 text-center"><span className="loading loading-spinner loading-lg"></span></div>;
  if (isError || !project) return <div className="alert alert-error">Project not found</div>;

  // Helper to color-code the cards
  const getStatusColor = (status: string) => {
    switch (status) {
        case 'COMPLETED': return 'border-success bg-success/10';
        case 'IN_PROGRESS': return 'border-warning bg-warning/10';
        case 'LOCKED': return 'border-base-200 opacity-50';
        case 'PENDING': return 'border-primary bg-base-100'; // Waiting to be picked
        default: return 'border-base-200';
    }
  };

  return (
    <div className="space-y-8 fade-in">
      {/* 1. HEADER & ACTIONS */}
      <div className="flex justify-between items-start">
        <div>
            <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm gap-2 mb-2 pl-0">
                ← Back to List
            </button>
            <h1 className="text-4xl font-black text-primary">{project.assyNumber}</h1>
            <p className="text-xl font-medium opacity-60">{project.customer}</p>
        </div>
        <div className="flex gap-2">
            <div className="stats shadow bg-base-100 border">
                <div className="stat place-items-center">
                    <div className="stat-title">Scope</div>
                    <div className="stat-value text-lg">{project.scope}</div>
                </div>
                <div className="stat place-items-center">
                    <div className="stat-title">Total PO</div>
                    <div className="stat-value text-lg">{project.totalPo.toLocaleString()}</div>
                </div>
                <div className="stat place-items-center">
                    <div className="stat-title">Deadline</div>
                    <div className="stat-value text-lg text-error">
                        {format(new Date(project.etd), 'MMM dd')}
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="divider"></div>

      {/* 2. THE ENGINEERING MONITOR (Smart Queue Visualized) */}
      <div>
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            🏗️ Engineering Status 
            <span className={`badge badge-lg ${project.engineeringStatus === 'COMPLETED' ? 'badge-success' : 'badge-warning'}`}>
                {project.engineeringStatus}
            </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* We map through the 6 Work Orders here */}
            {project.workOrders?.map((wo: any) => (
                <div key={wo.id} className={`card border-l-4 shadow-sm ${getStatusColor(wo.status)}`}>
                    <div className="card-body p-5">
                        <div className="flex justify-between items-start">
                            <h4 className="font-bold text-sm uppercase tracking-wider opacity-70">
                                {wo.processName.replace('_', ' ')}
                            </h4>
                            {wo.status === 'COMPLETED' && <span>✅</span>}
                            {wo.status === 'IN_PROGRESS' && <span className="loading loading-spinner loading-xs"></span>}
                        </div>
                        
                        {/* Who is responsible? */}
                        <div className="mt-2 flex items-center gap-3">
                            <div className="avatar placeholder">
                                <div className="bg-neutral text-neutral-content rounded-full w-8">
                                    <span className="text-xs">{wo.assignedUser?.name.charAt(0) || '?'}</span>
                                </div>
                            </div>
                            <div>
                                <p className="font-bold text-sm">
                                    {wo.assignedUser?.name || <span className="italic opacity-50">Unassigned</span>}
                                </p>
                                <p className="text-xs opacity-60">Target: {format(new Date(wo.targetDate), 'MMM dd')}</p>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className="mt-4 flex justify-between items-center text-xs">
                             <span className="font-mono opacity-50">{wo.status}</span>
                             {wo.completedAt && (
                                <span className="text-success">Done: {format(new Date(wo.completedAt), 'MM/dd')}</span>
                             )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* 3. BREAKDOWN LEAD ACTIONS */}
      {/* If the project is LOCKED, show the Distribute Button here too! */}
      {project.engineeringStatus === 'LOCKED' && (
          <div className="alert alert-warning shadow-lg mt-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <div>
                  <h3 className="font-bold">Waiting for Breakdown!</h3>
                  <div className="text-xs">This project has not been distributed to engineers yet.</div>
              </div>
          </div>
      )}
    </div>
  );
}