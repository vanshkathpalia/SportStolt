import React, { ReactNode, useState } from 'react';

interface TooltipProps {
  content: ReactNode;       // The tooltip text or element to show
  children: ReactNode;      // The element that triggers the tooltip on hover
  delay?: number;           // Optional delay before tooltip shows (ms)
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, delay = 300 }) => {
  const [visible, setVisible] = useState(false);
  let timeout: NodeJS.Timeout;

  const showTooltip = () => {
    timeout = setTimeout(() => setVisible(true), delay);
  };

  const hideTooltip = () => {
    clearTimeout(timeout);
    setVisible(false);
  };

  return (
    <div
      style={{ display: 'inline-block', position: 'relative' }}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {visible && (
        <div
          style={{
            position: 'absolute',
            bottom: '125%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'black',
            color: 'white',
            padding: '6px 10px',
            borderRadius: '4px',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            fontSize: '12px',
            pointerEvents: 'none',
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};
