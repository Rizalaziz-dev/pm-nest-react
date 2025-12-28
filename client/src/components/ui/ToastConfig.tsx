// src/components/ui/ToastConfig.tsx
import { Toaster } from 'react-hot-toast';

export const ToastConfig = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        // Base style for all toasts
        className: 'alert shadow-lg bg-base-100 text-base-content border border-base-300',
        duration: 3000,
        
        // Success style (DaisyUI alert-success)
        success: {
          className: 'alert alert-success text-success-content shadow-lg',
          icon: <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        },
        
        // Error style (DaisyUI alert-error)
        error: {
          className: 'alert alert-error text-error-content shadow-lg',
          icon: <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        },
        // Loading Style
        loading: {
        className: 'alert alert-info shadow-lg',
        // Use the DaisyUI loading spinner as the icon
        icon: <span className="loading loading-spinner loading-sm"></span>,
        },
      }}
    />
  );
};