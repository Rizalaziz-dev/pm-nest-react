import React, { useMemo } from 'react';
import { useSmartQueue } from '../hooks/useDashboard';
import { WorkOrder } from '../types/dashboard.types';
import DashboardCard from '../components/DashboardCard'; // We'll make this next
import { getMyUserId } from '../../../utils/auth';

interface SmartQueueProps {
  processName: string; // e.g., 'JIG_DRAWING'
}



export const SmartQueue: React.FC<SmartQueueProps> = ({ processName }) => {
  const { data, isLoading, isError, pullJob, isPulling, completeJob, isCompleting } = useSmartQueue(processName);
  // Get current user ID from Auth util
  const myId = getMyUserId();

  // Guard Clause: Don't render if user isn't loaded yet
  if (!myId) return <div>Loading user...</div>;

  // --- 1. SPLIT THE DATA ---
  const { myActiveJobs, availablePool } = useMemo(() => {
    if (!data?.pool) return { myActiveJobs: [], availablePool: [] };

    // Zone A: Things I am currently working on
    const myActive = data.pool.filter(t => 
      t.status === 'IN_PROGRESS' && 
      t.assignedUserId === myId
    );

    // Zone B: Things available to be picked (ignore other people's in-progress work)
    const pool = data.pool.filter(t => 
      t.status === 'PENDING'
    );

    return { myActiveJobs: myActive, availablePool: pool };
  }, [data]);


  // --- 2. SORT THE POOL (Only sort the available stuff) ---
  const { urgentTasks, standardTasks, futureTasks } = useMemo(() => {
    // IMPORTANT: We now map over 'availablePool', not 'data.pool'
    if (!availablePool) return { urgentTasks: [], standardTasks: [], futureTasks: [] };
    
    const today = new Date().toISOString();

    const urgent = availablePool.filter(t => 
      t.hardDeadline <= today || t.project.productionStage !== 'PLANNING'
    );
    
    const standard = availablePool.filter(t => 
      !urgent.includes(t) && t.targetDate <= today
    );

    const future = availablePool.filter(t => 
      !urgent.includes(t) && !standard.includes(t)
    );

    return { urgentTasks: urgent, standardTasks: standard, futureTasks: future };
  }, [availablePool]);

  if (isLoading) return <div className="loading loading-spinner loading-lg"></div>;
  if (isError) return <div role="alert" className="alert alert-error"><span>Error loading queue.</span></div>;
  
  const handlePullJob = (workOrderId: string) => {
      // Hardcoded User ID for now (or get from Auth Context)
      
      pullJob({ workOrderId, userId: myId });
  };

  return (
    <div className="p-6 space-y-8 bg-base-200 min-h-screen">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-base-content">
          Dashboard |<span className="opacity-50 text-lg"> {processName} </span>
        </h1>
        {/* Overload Warning could go here */}
      </div>

      {/* --- ZONE A: MY ACTIVE WORKSPACE --- */}
      {myActiveJobs.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
             <div className="badge badge-primary badge-lg gap-2">🛠️ MY ACTIVE JOBS</div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {myActiveJobs.map(task => (
               <div key={task.id} className="card bg-base-100 shadow-xl border-l-4 border-primary">
                 <div className="card-body">
                   <div className="flex justify-between items-start">
                     <div>
                       <h3 className="text-2xl font-mono font-bold">{task.project.assyNumber}</h3>
                       <p className="text-sm opacity-70">{task.project.customer}</p>
                     </div>
                     <div className="badge badge-ghost">In Progress</div>
                   </div>

                   {/* PROGRESS BAR (Visual Flair) */}
                   <progress className="progress progress-primary w-full mt-4" value="50" max="100"></progress>

                   <div className="card-actions justify-end mt-4">
                    <button 
                      className="btn btn-success btn-sm text-white"
                      onClick={() => completeJob(task.id)}
                      disabled={isCompleting} // Prevent double clicks
                    >
                      {isCompleting ? <span className="loading loading-spinner loading-xs"></span> : '✅ Mark Complete'}
                    </button>
                   </div>
                 </div>
               </div>
            ))}
          </div>
          <div className="divider"></div>
        </section>
      )}


      {/* --- ZONE B: THE POOL (Available to Pick) --- */}
      
      {/* 1. THE DANGER SHELF (Urgent/Factory Waiting) */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="badge badge-error badge-lg gap-2 animate-bounce text-white">
            🔥 DANGER ZONE
          </div>
          <span className="text-sm font-bold text-error uppercase tracking-widest">
            Do Immediately
          </span>
        </div>
        
        <div className="grid gap-4">
          {urgentTasks.length > 0 ? (
            urgentTasks.map(task => (
              <DashboardCard 
                key={task.id} 
                task={task} 
                variant="urgent"
                onPull={() => pullJob({ workOrderId: task.id, userId: myId })}
                isPulling={isPulling}
              />
            ))
          ) : (
            // Empty State for Danger Zone (A good thing!)
            <div className="alert alert-success opacity-70 bg-transparent border-dashed border-2 text-success-content">
              <span>✅ No critical emergencies. You are safe.</span>
            </div>
          )}
        </div>
      </section>

      {/* 2. THE TODAY SHELF (Standard Target) */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
           <div className="badge badge-success badge-lg gap-2 text-white">
             🟢 TARGET: TODAY
           </div>
           <span className="text-sm font-bold opacity-60">
             Keep the flow moving
           </span>
        </div>
        
        <div className="grid gap-4">
          {standardTasks.length > 0 ? (
            standardTasks.map(task => (
              <DashboardCard 
                key={task.id} 
                task={task} 
                variant="standard"
                onPull={() => pullJob({ workOrderId: task.id, userId: myId })}
                isPulling={isPulling}
              />
            ))
          ) : (
            <div className="p-4 border border-base-300 rounded-lg text-center opacity-50">
              Daily target cleared. Check the bank below.
            </div>
          )}
        </div>
      </section>

      {/* 3. THE FUTURE SHELF (The Freezer) */}
        
      {/* We set opacity-60 so it looks "frozen" or inactive until hovered */}
      <section className="mt-12 opacity-60 hover:opacity-100 transition-opacity duration-300">
        
        <div className="flex items-center gap-2 mb-4">
           <div className="badge badge-ghost badge-lg gap-2 text-base-content/70">
             🧊 FUTURE BANK
           </div>
           <span className="text-xs opacity-50 font-bold uppercase tracking-widest">
             (Pull only if top shelves are empty)
           </span>
        </div>

        <div className="grid gap-4 max-h-125 overflow-y-auto pr-2 custom-scrollbar">

        <div className="grid gap-4">
          {futureTasks.length > 0 ? (
            futureTasks.map(task => (
              <DashboardCard 
              key={task.id} 
              task={task} 
              variant="future" // Make sure DashboardCard handles this variant!
              onPull={() => pullJob({ workOrderId: task.id, userId: myId })}
              isPulling={isPulling}
              />
            ))
          ) : (
            // Optional: Empty State for Future
            <div className="p-6 border-2 border-dashed border-base-300 rounded-lg text-center opacity-50">
              <span>No future work scheduled.</span>
            </div>
          )}
        </div>
          </div>
      </section>
    </div>
  );
};