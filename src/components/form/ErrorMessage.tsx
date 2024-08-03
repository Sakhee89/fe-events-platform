import React from "react";

interface ErrorMessageProps {
  children: React.ReactNode;
}

const ErrorMessage = ({ children }: ErrorMessageProps) => {
  return (
    <p className="text-red-600 font-bold" role="alert">
      {children}
    </p>
  );
};

export default ErrorMessage;
