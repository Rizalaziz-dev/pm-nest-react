import React from 'react';
import { useParams } from 'react-router-dom'; // Assuming React Router
import { SmartQueue } from './SmartQueue';


const OperatorPage: React.FC = () => {
  // Option A: Hardcoded for now (e.g., Mike only sees JIG)
  // const processName = "JIG_DRAWING";

  // Option B: Dynamic from URL (e.g., /dashboard/jig-drawing)
  const { process } = useParams(); 
  // Map URL param "jig-drawing" to Enum "JIG_DRAWING" if needed

  return (
    <div>
       {/* You just drop the Feature Widget here */}
       <SmartQueue processName="JIG_DRAWING" />
    </div>
   
  );
};

export default OperatorPage;