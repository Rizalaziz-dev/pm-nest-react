import {forwardRef } from "react";

type InputProps = {
  label: string;
  type?: string;
  error?: String;
  } & React.InputHTMLAttributes<HTMLInputElement>;


const Input = forwardRef<HTMLInputElement, InputProps>
(({ label, error, className, ...props }, ref) => {
  return (
    <div>
    <div className="input my-1">
      <span className="label">{label}</span>
      <input ref={ref} {...props} />
    </div>
      {error && <p className="text-red-500">{error}</p>} 
    </div>
  );
}
);
export default Input;