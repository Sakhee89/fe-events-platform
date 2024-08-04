import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  label: string;
  children: React.ReactNode;
}

const Button = ({ className, label, children, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      aria-label={label}
      className={`px-5 py-2 rounded-md bg-blue-700 hover:bg-blue-500 text-white ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
