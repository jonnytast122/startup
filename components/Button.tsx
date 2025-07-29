// Example for Advice 2: File Naming Conventions (PascalCase for components)
// Example for Advice 6: Styling - Extract repeated Tailwind classes

import React from 'react';

export const buttonBase = 'px-4 py-2 rounded bg-blue-500 text-white';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ children, ...props }) => (
  <button className={buttonBase} {...props}>
    {children}
  </button>
);

export default Button;