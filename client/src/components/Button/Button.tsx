import React from "react";

// import './button.css'
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    text: string;
    }

const Button = ({ text, ...props}: ButtonProps) => {
    return (
    <button 
    className="btn btn-soft btn-primary m-2" 
    {...props }>
        {text}
        </button>
);
}

export default Button