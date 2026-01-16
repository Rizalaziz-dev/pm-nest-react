import React, { useMemo } from 'react';
import { useSmartQueue } from '../hooks/useDashboard';
import { WorkOrder } from '../types/dashboard.types';
import DashboardCard from '../components/DashboardCard'; // We'll make this next

interface SmartQueueProps {
  processName: string; // e.g., 'JIG_DRAWING'
}

const CURRENT_USER_ID = "szqxbxtbmbl172a84aqqz23s";

export const SmartQueue: React.FC<SmartQueueProps> = ({ processName }) => {
  const { data, isLoading, isError, pullJob, isPulling } = useSmartQueue(processName);
 
  // --- 1. SPLIT THE DATA ---
  const { myActiveJobs, availablePool } = useMemo(() => {
    if (!data?.pool) return { myActiveJobs: [], availablePool: [] };

    // Zone A: Things I am currently working on
    const myActive = data.pool.filter(t => 
      t.status === 'IN_PROGRESS' && t.assignedUserId === CURRENT_USER_ID
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
      
      pullJob({ workOrderId, userId: CURRENT_USER_ID });
  };

  return (
    <div className="p-6 space-y-8 bg-base-200 min-h-screen">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-base-content">
           {processName} <span className="opacity-50 text-lg">/ Dashboard</span>
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
                     {/* We will wire this button up next! */}
                     <button className="btn btn-success btn-sm text-white">
                       ✅ Mark Complete
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
      <section>
        <h2 className="text-xl font-bold mb-4 opacity-80">Available Pool</h2>
        
        {/* Urgent Shelf */}
        <div className="space-y-4 mb-8">
            {urgentTasks.map(task => (
              <DashboardCard 
                key={task.id} 
                task={task} 
                variant="urgent"
                onPull={() => pullJob({ workOrderId: task.id, userId: CURRENT_USER_ID })}
                isPulling={isPulling}
              />
            ))}
        </div>

        {/* Standard Shelf */}
        <div className="space-y-4">
            {standardTasks.map(task => (
              <DashboardCard 
                key={task.id} 
                task={task} 
                variant="standard"
                onPull={() => pullJob({ workOrderId: task.id, userId: CURRENT_USER_ID })}
                isPulling={isPulling}
              />
            ))}
        </div>
        
        
      {/* --- ZONE C: FUTURE BANK (The Freezer) --- */}
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

        <div className="grid gap-4">
          {futureTasks.length > 0 ? (
            futureTasks.map(task => (
              <DashboardCard 
                key={task.id} 
                task={task} 
                variant="future" // Make sure DashboardCard handles this variant!
                onPull={() => pullJob({ workOrderId: task.id, userId: CURRENT_USER_ID })}
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
      </section>
      </section>

    </div>
  );
};