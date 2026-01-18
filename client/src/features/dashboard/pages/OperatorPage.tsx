import React from 'react';
import { Navigate, useParams } from 'react-router-dom'; // Assuming React Router
import { SmartQueue } from './SmartQueue';
import { useAuth } from '../../auth/hooks/useAuth';

const ROLE_TO_PROCESS: Record<string, string> = {
  // The Gatekeeper
  'OPERATOR_BREAKDOWN': 'BREAKDOWN',

  // The 6 Engineers
  'ENGINEER_JOINT':     'JOINT_DRAWING',
  'ENGINEER_HOUSING':   'HOUSING_DRAWING',
  'ENGINEER_JIG':       'JIG_DRAWING',
  'ENGINEER_VISUAL':    'VISUAL_DRAWING',
  'ENGINEER_JS_ACC':    'JOB_STATION_ACC',
  'ENGINEER_JS_FIN':    'JOB_STATION_FINISHING',
};

export default function OperatorPage() {
  // 1. Get User Info
  const { user, loading } = useAuth();

  // 2. Wait for Token Decoding
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // 3. Security Check: Must be logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 4. Determine Process based on Role
  const processName = ROLE_TO_PROCESS[user.role];

  // 5. Handle Unauthorized / Admin Roles
  // If an Admin tries to visit this page, send them to their own dashboard
  if (!processName) {
    if (user.role === 'ADMIN' || user.role === 'MANAGER' || user.role === 'PM') {
      return <Navigate to="/admin/overview" replace />;
    }
    
    // If it's a role with no mapping (e.g., "CUSTOMER"), show error
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="alert alert-error max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Access Denied. Your role ({user.role}) does not have an assigned queue.</span>
        </div>
        <button className="btn btn-outline" onClick={() => window.location.href='/login'}>
            Go Back to Login
        </button>
      </div>
    );
  }

  // 6. ✅ Render the Correct Queue
  return (
    <div className="min-h-screen bg-base-200">
       <SmartQueue processName={processName} />
    </div>
  );
}