export type ProjectScope = 'NEW_ASSY' | 'MODIF_MAJOR' | 'MODIF_MINOR' ;

export interface Project {
    assyNumber: string;
    customer: string;
    totalPo: string;
    scope: ProjectScope;
    productionStage: string;
}

export interface WorkOrder {
    id: string;
    processName: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'LOCKED';

    // The Smart Dates
    targetDate: string;
    hardDeadline: string;
    dueDate: string;

    assignedUserId: string | null;
    project: Project;
}

export interface PoolResponse {
    metadata: {
        totalPoints: number;
        isOverloaded: boolean;
        count: number;
    };
    pool: WorkOrder[];
}