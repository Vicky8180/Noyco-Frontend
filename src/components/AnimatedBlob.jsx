'use client';

import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBlob = ({ 
  gradient, 
  duration = 12, 
  delay = 0, 
  sizeClass = "w-8 h-8", 
  isVisible = true,
  isStatic = false,
  opacity = 0.55,
  blur = 50,
  position = 'center',
  offsetX = 0,
  offsetY = 0
}) => {
  if (!isVisible) return null;

  // Position classes based on position prop with offsets
  const positionClass = position === 'center' 
    ? 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
    : 'left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2';

  const animationProps = isStatic 
    ? {
        // Static state - no animation
        animate: {
          borderRadius: '40% 60% 60% 40% / 50% 40% 60% 50%',
          scale: 1,
          x: offsetX,
          y: offsetY,
        },
        transition: {
          duration: 0.3,
          ease: 'easeOut'
        }
      }
    : {
        // Animated state - contained within icon
        animate: {
          borderRadius: [
            '40% 60% 60% 40% / 50% 40% 60% 50%',
            '60% 40% 40% 60% / 40% 60% 40% 60%',
            '50% 50% 70% 30% / 30% 70% 30% 70%',
            '70% 30% 30% 70% / 60% 40% 60% 40%',
            '40% 60% 60% 40% / 50% 40% 60% 50%',
          ],
          scale: [1, 1.08, 0.94, 1.04, 1],
          x: [offsetX, offsetX + 4, offsetX - 4, offsetX + 3, offsetX],
          y: [offsetY, offsetY - 3, offsetY + 4, offsetY - 2, offsetY],
        },
        transition: {
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay,
        }
      };

  return (
    <motion.div
      className={`absolute ${positionClass} ${sizeClass}`}
      style={{
        background: gradient,
        filter: `blur(${blur}px)`,
        opacity,
        pointerEvents: 'none',
        zIndex: 0,
      }}
      {...animationProps}
    />
  );
};

// Multi-blob component for sidebar icons
export const SidebarBlob = ({ 
  isHovered = false, 
  isActive = false, 
  position = 'center' 
}) => {
  const hoverGradients = [
    "linear-gradient(135deg, #facc15 0%, #f97316 100%)", // Yellow to orange
    "linear-gradient(135deg, #a855f7 0%, #ef4444 100%)", // Purple to red
    "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)", // Blue to cyan
    "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)", // Pink to rose
  ];

  // Only show animated blobs on hover (not when active - active uses CSS gradient)
  if (!isHovered || isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden lg:rounded-full rounded-lg">
      <div
        className="absolute inset-0 lg:rounded-full rounded-lg"
        style={{
          background: 'linear-gradient(135deg, rgba(250,204,21,0.25), rgba(168,85,247,0.2), rgba(59,130,246,0.2))',
        }}
      />
      {/* Yellow-Orange blob - top left */}
      <AnimatedBlob
        gradient={hoverGradients[0]}
        duration={12}
        delay={0}
        sizeClass="w-6 h-6"
        opacity={0.35}
        blur={6}
        position={position}
        offsetX={-8}
        offsetY={-8}
      />
      {/* Purple-Red blob - top right */}
      <AnimatedBlob
        gradient={hoverGradients[1]}
        duration={16}
        delay={2}
        sizeClass="w-7 h-7"
        opacity={0.3}
        blur={7}
        position={position}
        offsetX={8}
        offsetY={-8}
      />
      {/* Blue-Cyan blob - bottom left */}
      <AnimatedBlob
        gradient={hoverGradients[2]}
        duration={14}
        delay={1}
        sizeClass="w-5 h-5"
        opacity={0.4}
        blur={5}
        position={position}
        offsetX={-8}
        offsetY={8}
      />
      {/* Pink-Rose blob - bottom right */}
      <AnimatedBlob
        gradient={hoverGradients[3]}
        duration={18}
        delay={3}
        sizeClass="w-6 h-6"
        opacity={0.32}
        blur={6}
        position={position}
        offsetX={8}
        offsetY={8}
      />
    </div>
  );
};

export default AnimatedBlob;
