import React, { useEffect, useRef } from 'react';

export const AdBanner: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && !containerRef.current.hasChildNodes()) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://pl30931218.effectivecpmnetwork.com/07230dbcf7ed6c26ce8b0cf69c999b4/invoke.js';
      containerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full flex justify-center items-center my-4 min-h-[90px]">
      <div 
        ref={containerRef} 
        id="container-07230dbcf7ed6c26ce8b0cf69c999b4"
      ></div>
    </div>
  );
};
