import { ProjectEntity } from "../schemas/project.schemas"; // Adjust import based on your types

interface Props {
    projects: ProjectEntity[];
    onDetails: (project: ProjectEntity) => void;
    // We can add onEdit and onDelete here later just like UsersTable!
}

export function ProjectsTable({ projects, onDetails }: Props) {
    return (
        <div className="overflow-x-auto">
            <table className="table table-zebra table-sm" style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th style={{ width: '20%' }}>Assy Number</th>
                        <th style={{ width: '20%' }}>Customer</th>
                        <th style={{ width: '15%' }}>Stage</th>
                        <th style={{ width: '15%' }}>ETD</th>
                        <th style={{ width: '15%' }}>Scope</th>
                        <th style={{ width: '15%' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {projects?.map((project) => (
                        <tr key={project.id} className="hover">
                            {/* 1. Identity */}
                            <td>
                                <div className="font-bold">{project.assyNumber}</div>
                                <div className="text-xs opacity-50">{project.totalPo}</div>
                            </td>

                            {/* 2. Customer */}
                            <td>{project.customer}</td>

                            {/* 3. Stage Badge */}
                            <td>
                                <StageBadge stage={project.productionStage} />
                            </td>

                            {/* 4. Deadline */}
                            <td>
                                <div className="font-mono text-sm">
                                    {new Date(project.etd).toLocaleDateString()}
                                </div>
                            </td>

                            {/* 5. Scope */}
                            <td>
                                <span className={`badge badge-sm ${project.scope === 'NEW_ASSY' ? 'badge-secondary' : 'badge-ghost'}`}>
                                    {project.scope.replace('_', ' ')}
                                </span>
                            </td>

                            {/* 6. Actions */}
                            <td>
                                <button 
                                    className="btn btn-xs btn-primary"
                                    onClick={() => onDetails(project)}
                                >
                                    Details
                                </button>
                            </td>
                        </tr>
                    ))}

                    {projects?.length === 0 && (
                        <tr>
                            <td colSpan={6} className="text-center py-8 text-opacity-50">
                                No active projects found. Start one!
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

// Helper Component kept locally
function StageBadge({ stage }: { stage: string }) {
    let color = 'badge-ghost';
    if (stage === 'PLANNING') color = 'badge-info';
    if (stage === 'PP' || stage === 'HOUSING') color = 'badge-warning';
    if (stage === 'PREDEL') color = 'badge-success';

    return <div className={`badge badge-sm ${color} gap-1 font-bold`}>{stage}</div>;
}