import { Link, useNavigate } from "react-router-dom";
import { useProjects } from "../hooks/useProjects";
import { ProjectsTable } from "../components/ProjectsTable";
import { CreateProjectFormData, ProjectEntity } from "../schemas/project.schemas";
import { useRef, useState } from "react";
import CreateForm from "../components/CreateForm";
import toast from "react-hot-toast";
import BulkUploadForm from "../components/BulkUploadForm";



export default function ProjectsPage() {
  const navigate = useNavigate();
  const { data: projects, isPending, isError, createProject, updateProject, isCreating, createBulkProjects, isCreatingBulk } = useProjects();
  const [selectedProject, setSelectedProject] = useState<ProjectEntity | null>(null);
    
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'SINGLE' | 'BULK'>('SINGLE');
  
  const modalRef=useRef<HTMLDialogElement>(null);

  const openCreateModal = () => {
      setSelectedProject(null); // Clear data
      modalRef.current?.showModal();
  };

  const openEditModal = (project: ProjectEntity) => {
      setSelectedProject(project); // Fill data
      modalRef.current?.showModal();
  };

  const handleCreateSubmit = async (formData: CreateProjectFormData) => {
    const loadingToast = toast.loading(selectedProject ? "Updating..." : "Creating...");
    if (selectedProject) {
      // Update existing project
      const updatePayload = {
        ...formData,
        id: selectedProject.id,
        productionStage: selectedProject.productionStage,
        engineeringStatus: selectedProject.engineeringStatus
      }
      await updateProject(updatePayload, {
        onSuccess: () => {
          toast.success("Project updated!", { id: loadingToast });
          modalRef.current?.close();
          setSelectedProject(null);
        },
        onError: (err: any) => {
          toast.error(err.message || "Update failed");
        }
      });
    } else {
      // Create new project
      createProject(formData, {
        onSuccess: () => {
          toast.success('Project created successfully', {id: loadingToast} );
          modalRef.current?.close();
        },
        onError: (err: any) => {
          toast.error(err.message || "Creation failed", { id: loadingToast });
        }
      });
    }
    modalRef.current?.close();
  };

  const handleBulkSubmit = (data: any[]) => {
        if (!data || data.length === 0) return;

        createBulkProjects(data, {
            onSuccess: (result) => {
                toast.success(`Success! ${result.length} projects launched.`);
                setIsModalOpen(false);
                setActiveTab('SINGLE');
            },
            onError: (error: any) => {
                toast.error(`Upload Failed: ${error.message}`);
            }
        });
    };
    
    // Handler for the "Details" button inside the table
  const handleDetails = (project: ProjectEntity) => {
    console.log("View details for:", project.assyNumber);
    // You could open a modal here, or navigate to a details page:
    navigate(`/manager/projects/${project.id}`);
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
          <button 
            className="btn btn-primary"
            onClick={openCreateModal}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                New Project
          </button>
      </div>

      {/* Modals */}
      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">
              {selectedProject ? 'Edit Project' : 'Launch Projects'}
            </h3>

            {/* THE TABS */}
            {!selectedProject && (
            <div className="tabs tabs-boxed mb-6">
                <button 
                    className={`tab ${activeTab === 'SINGLE' ? 'tab-active' : ''}`} 
                    onClick={() => setActiveTab('SINGLE')}
                >
                    ✍️ Single Entry
                </button>
                <button 
                    className={`tab ${activeTab === 'BULK' ? 'tab-active' : ''}`} 
                    onClick={() => setActiveTab('BULK')}
                >
                    📂 Excel / CSV Upload
                </button>
            </div>
            )}

            {/* RENDER THE CORRECT FORM */}
            <div className="mt-4">
              {activeTab === 'SINGLE' ? (
                <>
                  <CreateForm
                    key={selectedProject?.id || 'new'}
                    onSubmit={handleCreateSubmit}
                    initialData={selectedProject}
                    />
                  <div className="modal-action">
                      <button
                      className="btn btn-ghost btn-primary"
                      type="submit"
                      form="create-project-form"
                      disabled={isCreating}
                      >
                          {isCreating && <span className="loading loading-spinner"></span>}
                          {selectedProject ? "Update" : "Add"}</button>
                      <form method="dialog">
                          <button 
                          type="button" 
                          className="btn btn-ghost" 
                          onClick={() => modalRef.current?.close()}>
                          Cancel</button>
                      </form>
                  </div>
                </>
              ) : (
                <>
                <BulkUploadForm 
                    onBulkSubmit={handleBulkSubmit} 
                    isLoading={isCreatingBulk} // 👈 Use the loading state from hook
                    />
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-ghost" onClick={() => modalRef.current?.close()}>
                                Close
                            </button>
                        </form>
                    </div>
                </>
              )}
            </div>
        </div>
      </dialog>
               

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
