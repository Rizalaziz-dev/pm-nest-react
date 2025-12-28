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
    <fieldset className="fieldset">
      <legend className="fieldset-legend">{label}</legend>
      <input className="input w-full" ref={ref} {...props} />
      {error && <p className="text-red-500">{error}</p>} 
    </fieldset>
    </div>
  );
}
);
export default Input;