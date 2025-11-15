'use client';

import { useRef, useState, ReactNode } from 'react';

const Card3D = ({ children, className }: { children: ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [rot, setRot] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    setRot({
      x: (y - r.height / 2) / 15,
      y: (r.width / 2 - x) / 15,
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setRot({ x: 0, y: 0 })}
      style={{
        transform: `perspective(1200px) rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
        transition: 'transform 0.2s ease-out',
      }}
      className={className}
    >
      {children}
    </div>
  );
};

export default Card3D;
