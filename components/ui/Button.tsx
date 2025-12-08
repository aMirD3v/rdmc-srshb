import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button
      className={`bg-gray-700 text-white hover:bg-gray-800 px-4 py-2 rounded-md ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
