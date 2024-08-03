import React from "react";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label: string;
  defaultValue: string;
  onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput = ({
  className,
  label,
  defaultValue,
  onChangeHandler,
}: TextInputProps) => {
  return (
    <div className="flex flex-col">
      <label>{label}</label>
      <input
        className={`border border2 p-1 border-gray-600 rounded-md ${className}`}
        type="text"
        onChange={(event) => onChangeHandler(event)}
        defaultValue={defaultValue}
      />
    </div>
  );
};

export default TextInput;
