import React, { useEffect } from 'react';
import { IToastProps } from '../utils/intefaces';


const Toast: React.FC<IToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000); 

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      {message}
    </div>
  );
};

export default Toast;