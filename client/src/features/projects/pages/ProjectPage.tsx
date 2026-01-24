import { Link } from "react-router-dom";
import { useProjects } from "../hooks/useProjects";
import { ProjectsTable } from "../components/ProjectsTable";
import { ProjectEntity } from "../schemas/project.schemas";

export default function ProjectsPage() {
  const { data: projects, isPending, isError, createProject, isCreating } = useProjects();

  // Handler for the "Details" button inside the table
  const handleDetails = (project: ProjectEntity) => {
    console.log("View details for:", project.assyNumber);
    // You could open a modal here, or navigate to a details page:
    // navigate(`/manager/projects/${project.id}`);
  };

  if (isPending) return <div className="p-8 text-center"><span className="loading loading-spinner loading-lg"></span></div>;
  if (isError) return <div className="alert alert-error">Failed to load projects.</div>;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold">Active Projects</h1>
           <p className="text-sm opacity-60">Manage production schedules and tracking.</p>
        </div>
        <Link to="/manager/projects/new" className="btn btn-primary gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            New Project
        </Link>
      </div>

      {/* TABLE CARD */}
      <div className="card bg-base-100 shadow-xl border border-base-200">
        <ProjectsTable 
            projects={projects || []} 
            onDetails={handleDetails} 
        />
      </div>
    </div>
  );
}