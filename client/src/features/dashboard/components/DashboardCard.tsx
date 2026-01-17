import React from 'react';
import { WorkOrder } from '../types/dashboard.types';
import { format } from 'date-fns'; // Recommended for nicer dates

interface DashboardCardProps {
  task: WorkOrder;
  variant: 'urgent' | 'standard' | 'future';
  onPull: () => void; // New Prop
  isPulling: boolean; // New Prop (to disable button)
}

const DashboardCard: React.FC<DashboardCardProps> = ({ task, variant, onPull, isPulling }) => {
  const isFactoryWaiting = task.project.productionStage !== 'PLANNING';

  // DaisyUI Styles based on Variant
  const containerClasses = {
    urgent: 'border-l-8 border-error bg-error/10', // Red tint
    standard: 'border-l-8 border-success bg-base-100', // Clean white
    future: 'border-l-4 border-base-300 bg-base-100/50', // Ghostly
  };

  const scopeBadgeClass = task.project.scope === 'NEW_ASSY' 
    ? 'badge badge-secondary badge-outline' // Purple for New
    : 'badge badge-info badge-outline';     // Blue for Modif

  return (
    <div className={`card w-full shadow-sm hover:shadow-md transition-shadow ${containerClasses[variant]}`}>
      <div className="card-body flex-row justify-between items-center py-4 px-6">
        
        {/* LEFT: INFO */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h2 className="card-title font-mono text-xl">{task.project.assyNumber}</h2>
            
            {/* Scope Badge */}
            <span className={`font-bold ${scopeBadgeClass}`}>
              {task.project.scope === 'NEW_ASSY' ? 'NEW' : 'MODIF'}
            </span>

            {/* Factory Alert */}
            {isFactoryWaiting && (
              <span className="badge badge-error gap-2 font-bold animate-pulse text-white">
                FACTORY WAITING
              </span>
            )}
          </div>

          {/* Row 2: CUSTOMER (New & Improved) */}
          <div className="flex items-center gap-2 mt-1">
            {/* Building Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-base-content/60">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
            </svg>
            {/* The Name */}
            <span className="text-sm font-bold text-base-content/80 uppercase tracking-wide">
              {task.project.customer || <span className="text-error">MISSING DATA</span>}
            </span>
            <span className="text-xs opacity-50">| {task.project.productionStage}</span>
          </div>
        </div>
        

        {/* RIGHT: DATES & ACTION */}
        <div className="flex items-center gap-6 text-right">
          <div>
            <div className="text-sm font-semibold">
              Target: {format(new Date(task.targetDate), 'MMM dd')}
            </div>
            <div className={`text-xs font-bold ${variant === 'urgent' ? 'text-error' : 'opacity-50'}`}>
               Limit: {format(new Date(task.hardDeadline), 'MMM dd')}
            </div>
          </div>

          <button 
                className="btn btn-sm btn-outline mt-2"
                onClick={onPull}
                disabled={isPulling} // Prevent double clicks
             >
                {isPulling ? <span className="loading loading-spinner loading-xs"></span> : 'Pull Job'}
             </button>
        </div>

      </div>
    </div>
  );
};

export default DashboardCard;