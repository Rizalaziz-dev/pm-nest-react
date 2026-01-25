import { useState } from "react";
import { useProjects } from "../hooks/useProjects";
import { useUsers } from "../../users/hooks/useUsers";
import { ProjectEntity } from "../schemas/project.schemas";
import toast from "react-hot-toast";


const ENGINEERING_ROLES = [
'ENGINEER_JOINT',
'ENGINEER_HOUSING',
'ENGINEER_JIG',
'ENGINEER_VISUAL',
'ENGINEER_JS_ACC',
'ENGINEER_JS_FIN'
];

export default function BreakdownLeadDashboard() {
  const { data: projects, isPending: projectsPending, distributeToEngineers } = useProjects();
  const [selectedProject, setSelectedProject] = useState<ProjectEntity | null>(null);
  const { data: users, isPending: usersPending } = useUsers();
  



  // FILTER: Only show projects that are PLANNING and LOCKED
  const lockedProjects = projects?.filter(p => 
    p.productionStage === 'PLANNING' && p.engineeringStatus === 'LOCKED'
  ) || [];

  // ⚡ THE NEW ONE-CLICK AUTOMATION FUNCTION
  const handleAutoDistribute = async (project: ProjectEntity) => {
      // 1. Check if we have enough operators
      
      // 2. Find one user for each specific engineering role
      const assignedEngineers = ENGINEERING_ROLES.map(role => {
          return users?.find(user => user.role === role);
      });

      // 3. Safety Check: Did we find all 6?
      const missingRoles = ENGINEERING_ROLES.filter((role, index) => !assignedEngineers[index]);

      if (missingRoles.length > 0) {
          toast.error(`Missing staff! You need to hire/create users for: ${missingRoles.join(', ')}`);
          return;
      }

      // If we pass the check, TypeScript knows `assignedEngineers` has no null values.
      const engineerIds = assignedEngineers.map(engineer => engineer!.id);

      const loadingToast = toast.loading("Assigning to Engineering Team...");

      // 4. Create the payload for the API
      const payload = {
          projectId: project.id,
          operatorIds: engineerIds, 
           // All 6 engineers get assigned to the FULL project.
      };

      // 5. Call the API to generate workorders
      try {
          await distributeToEngineers(payload);
          toast.success("Done! Workorders generated.", { id: loadingToast });
      } catch (error) {
          toast.error("Failed to distribute project. Please try again.", { id: loadingToast });
          return;
      }
      

      console.log("Ready to send to backend:", payload);
      console.log("Assigned Team:", assignedEngineers.map(e => `${e!.role}: ${e!.name}`));
      
      // TODO: Call your API here to unlock project and create the 6 specific WorkOrders!
      
      toast.success("Done! Project distributed to 6 Engineers.", { id: loadingToast });
  };

  if (projectsPending || usersPending) return <div className="p-8 text-center"><span className="loading loading-spinner"></span></div>;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-primary">Master Breakdown Station</h1>
        <p className="opacity-60">One-click distribution to the breakdown team.</p>
      </header>

      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body">
          <h2 className="card-title text-error mb-4">🔒 Locked Queue</h2>
          
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Assy Number</th>
                  <th>Customer</th>
                  <th>Total PO</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {lockedProjects.map(project => (
                  <tr key={project.id}>
                    <td className="font-bold font-mono">{project.assyNumber}</td>
                    <td>{project.customer}</td>
                    <td>{project.totalPo} units</td>
                    <td>
                      {/* 👇 THE ONE-CLICK BUTTON */}
                      <button 
                        className="btn btn-sm btn-success"
                        onClick={() => handleAutoDistribute(project)}
                      >
                        ⚡ Distribute to Team
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}