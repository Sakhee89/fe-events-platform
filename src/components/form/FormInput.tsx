import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  defaultValue: string;
  className?: string;
}

const FormInput = ({
  label,
  defaultValue,
  className,
  ...props
}: FormInputProps) => {
  return (
    <div className="flex flex-col">
      <label>{label}:</label>
      <input
        className={`border-2 p-1 border-gray-600 rounded-md ${className}`}
        defaultValue={defaultValue}
        {...props}
      />
    </div>
  );
};

export default FormInput;
