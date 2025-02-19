import React, { useState, useEffect } from 'react';

interface NotificationProps {
  message: string;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({ message, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer); 
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '10px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        borderRadius: '5px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      {message}
    </div>
  );
};

export default Notification; 