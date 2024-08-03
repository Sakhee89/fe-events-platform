import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

const Button = ({ className, children, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={`px-5 py-2 rounded-md bg-blue-700 hover:bg-blue-500 text-white ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
