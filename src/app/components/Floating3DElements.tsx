import { motion } from 'motion/react';
import { memo, useMemo } from 'react';

interface Floating3DElementsProps {
  variant?: 'cubes' | 'spheres' | 'pyramids' | 'mixed';
  count?: number;
}

function Floating3DElements({ variant = 'mixed', count = 8 }: Floating3DElementsProps) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const prefersReduced = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reducir elementos en móvil o si se prefiere reducir movimiento
  const actualCount = useMemo(() => {
    if (prefersReduced) return 0;
    if (isMobile) return Math.min(count, 4);
    return count;
  }, [count, isMobile, prefersReduced]);

  const elements = useMemo(() => 
    Array.from({ length: actualCount }, (_, i) => i),
    [actualCount]
  );

  const getShape = (index: number) => {
    if (variant === 'cubes') return 'cube';
    if (variant === 'spheres') return 'sphere';
    if (variant === 'pyramids') return 'pyramid';
    const shapes = ['cube', 'sphere', 'pyramid'];
    return shapes[index % shapes.length];
  };

  const positions = useMemo(() => [
    { x: '10%', y: '20%' },
    { x: '85%', y: '15%' },
    { x: '5%', y: '70%' },
    { x: '90%', y: '65%' },
    { x: '15%', y: '45%' },
    { x: '80%', y: '40%' },
    { x: '30%', y: '10%' },
    { x: '70%', y: '85%' },
    { x: '50%', y: '25%' },
    { x: '60%', y: '60%' },
  ], []);

  if (actualCount === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((index) => {
        const shape = getShape(index);
        const position = positions[index % positions.length];
        const delay = (index * 0.8) % 3;
        const size = isMobile ? 40 + (index % 2) * 20 : 60 + (index % 3) * 30;

        return (
          <motion.div
            key={index}
            className="absolute"
            style={{
              left: position.x,
              top: position.y,
              width: size,
              height: size,
              willChange: 'transform, opacity',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              prefersReduced 
                ? { opacity: 0.1 } 
                : {
                    opacity: [0, 0.12, 0],
                    scale: [0.8, 1, 0.8],
                    rotateX: [0, 180],
                    rotateY: [0, 180],
                    y: [-15, 15, -15],
                  }
            }
            transition={{
              duration: isMobile ? 10 : 8 + (index % 4) * 2,
              repeat: Infinity,
              delay: delay,
              ease: 'easeInOut',
            }}
          >
            {shape === 'cube' && <Cube />}
            {shape === 'sphere' && <Sphere />}
            {shape === 'pyramid' && <Pyramid />}
          </motion.div>
        );
      })}
    </div>
  );
}

const Cube = memo(() => (
  <div className="w-full h-full relative" style={{ transformStyle: 'preserve-3d' }}>
    <div
      className="absolute inset-0 bg-gradient-to-br from-[#7700CE] to-[#9933FF] opacity-25 backdrop-blur-sm"
      style={{
        transform: 'translateZ(20px)',
        border: '1px solid rgba(119, 0, 206, 0.2)',
        boxShadow: '0 0 20px rgba(119, 0, 206, 0.15)',
      }}
    />
  </div>
));

const Sphere = memo(() => (
  <div
    className="w-full h-full rounded-full bg-gradient-to-br from-[#7700CE] to-[#9933FF] opacity-20"
    style={{
      boxShadow: '0 0 30px rgba(119, 0, 206, 0.2), inset 0 0 15px rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(119, 0, 206, 0.25)',
    }}
  />
));

const Pyramid = memo(() => (
  <div className="w-full h-full relative">
    <div
      className="absolute inset-0"
      style={{
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        background: 'linear-gradient(135deg, rgba(119, 0, 206, 0.25), rgba(153, 51, 255, 0.25))',
        border: '1px solid rgba(119, 0, 206, 0.2)',
        boxShadow: '0 0 20px rgba(119, 0, 206, 0.15)',
      }}
    />
  </div>
));

Cube.displayName = 'Cube';
Sphere.displayName = 'Sphere';
Pyramid.displayName = 'Pyramid';

export default memo(Floating3DElements);
