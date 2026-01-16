import { aptFetch } from "./client";
import { PoolResponse } from "../features/dashboard/types/dashboard.types";

export const dashboardApi = {
    getPool: async (processName: string): Promise<PoolResponse> => {
        return aptFetch<PoolResponse>(`/projects/pool?process=${processName}`, {
        method: 'GET',
        });
    },

   // PATCH: Start a job
  startJob: async (workOrderId: string, userId: string): Promise<void> => {
    return aptFetch<void>(`/projects/work-order/${workOrderId}/start`, {
      method: 'PATCH',
      // IMPORTANT: Your aptFetch passes options directly to fetch, 
      // so we MUST stringify the body ourselves.
      body: JSON.stringify({ userId }), 
    });
  },
}