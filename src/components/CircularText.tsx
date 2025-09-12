'use client';

import { useEffect } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';

const getRotationTransition = (duration: number, from: number, loop = true) => ({
  from,
  to: from + 360,
  ease: 'linear' as const,
  duration,
  type: 'tween' as const,
  repeat: loop ? Infinity : 0
});

const getTransition = (duration: number, from: number) => ({
  rotate: getRotationTransition(duration, from),
  scale: {
    type: 'spring' as const,
    damping: 20,
    stiffness: 300
  }
});

interface CircularTextProps {
  text: string;
  spinDuration?: number;
  onHover?: 'speedUp' | 'slowDown' | 'pause' | 'goBonkers';
  className?: string;
  size?: number;
  fontSize?: number;
}

const CircularText = ({ 
  text, 
  spinDuration = 20, 
  onHover = 'speedUp', 
  className = '',
  size = 200,
  fontSize = 24
}: CircularTextProps) => {
  const letters = Array.from(text);
  const controls = useAnimation();
  const rotation = useMotionValue(0);

  useEffect(() => {
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start)
    });
  }, [spinDuration, text, onHover, controls, rotation]);

  const handleHoverStart = () => {
    const start = rotation.get();
    if (!onHover) return;

    let transitionConfig;
    let scaleVal = 1;

    switch (onHover) {
      case 'slowDown':
        transitionConfig = getTransition(spinDuration * 2, start);
        break;
      case 'speedUp':
        transitionConfig = getTransition(spinDuration / 4, start);
        break;
      case 'pause':
        transitionConfig = {
          rotate: { type: 'spring' as const, damping: 20, stiffness: 300 },
          scale: { type: 'spring' as const, damping: 20, stiffness: 300 }
        };
        scaleVal = 1;
        break;
      case 'goBonkers':
        transitionConfig = getTransition(spinDuration / 20, start);
        scaleVal = 0.8;
        break;
      default:
        transitionConfig = getTransition(spinDuration, start);
    }

    controls.start({
      rotate: start + 360,
      scale: scaleVal,
      transition: transitionConfig
    });
  };

  const handleHoverEnd = () => {
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start)
    });
  };

  return (
    <motion.div
      className={`circular-text ${className}`}
      style={{ 
        rotate: rotation,
        width: size,
        height: size
      }}
      initial={{ rotate: 0 }}
      animate={controls}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      {letters.map((letter, i) => {
        const rotationDeg = (360 / letters.length) * i;
        const radius = (size - fontSize) / 2;
        const x = Math.cos((rotationDeg * Math.PI) / 180) * radius;
        const y = Math.sin((rotationDeg * Math.PI) / 180) * radius;
        const transform = `translate(${x}px, ${y}px)`;

        return (
          <span 
            key={i} 
            style={{ 
              transform, 
              WebkitTransform: transform,
              fontSize: `${fontSize}px`,
              position: 'absolute',
              left: '50%',
              top: '50%',
              marginLeft: `-${fontSize / 2}px`,
              marginTop: `-${fontSize / 2}px`,
              fontWeight: 900,
              color: '#fff',
              textAlign: 'center',
              transition: 'all 0.5s cubic-bezier(0, 0, 0, 1)'
            }}
          >
            {letter}
          </span>
        );
      })}
    </motion.div>
  );
};

export default CircularText;
