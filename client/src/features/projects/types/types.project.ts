export type ProjectScope = 'NEW_ASSY' | 'MODIF_MAJOR' | 'MODIF_MINOR';
export type ProjectType = 'REGULAR' | 'PROTOTYPE';

export interface Project {
  id: string;
  assyNumber: string;
  customer: string;
  totalPo: string;
  
  // Status
  productionStage: string;    // e.g. "PLANNING", "PP", "HOUSING"
  engineeringStatus: string;  // "IN_PROGRESS"
  
  // Dates
  orderDate: string;
  etd: string;
  breakdownFinishDate?: string;

  // Config
  scope: ProjectScope;
  plotting: ProjectType;

  // Relations (Optional, depending on if you fetch them)
  pm?: { name: string };
  workOrders?: any[]; 
}