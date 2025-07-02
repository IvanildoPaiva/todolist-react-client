import React from 'react';
import './Button.css';

const Button = ({ onClick, children, className = '' }) => {
  const buttonClassName = `btn ${className}`;

  return (
    <button className={buttonClassName} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;