import React, { useEffect, useState, useRef, ReactNode } from 'react';
import { motion, useScroll, useTransform, MotionValue, useInView } from 'framer-motion';

interface ParallaxProps {
  children: ReactNode;
  speed?: number; // Positive values move slower, negative values move faster
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  containerClassName?: string;
  offset?: number;
}

/**
 * Parallax scrolling component - creates subtle movement effects on scroll
 */
export function ParallaxSection({
  children,
  speed = 0.5,
  direction = 'up',
  className = '',
  containerClassName = '',
  offset = 100
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Calculate movement ranges based on direction and speed
  const getRange = () => {
    switch(direction) {
      case 'up':
        return [offset, -offset * speed];
      case 'down':
        return [-offset, offset * speed];
      case 'left':
        return [offset, -offset * speed];
      case 'right':
        return [-offset, offset * speed];
      default:
        return [offset, -offset * speed];
    }
  };

  // Set the transform property based on direction
  const getTransform = (value: MotionValue<number>) => {
    switch(direction) {
      case 'up':
      case 'down':
        return useTransform(value, [0, 1], getRange());
      case 'left':
      case 'right':
        return useTransform(value, [0, 1], getRange());
      default:
        return useTransform(value, [0, 1], [0, 0]);
    }
  };

  const y = direction === 'up' || direction === 'down' 
    ? getTransform(scrollYProgress) 
    : useTransform(scrollYProgress, [0, 1], [0, 0]);
  
  const x = direction === 'left' || direction === 'right' 
    ? getTransform(scrollYProgress) 
    : useTransform(scrollYProgress, [0, 1], [0, 0]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${containerClassName}`}>
      <motion.div 
        style={{ y, x }} 
        className={className}
        transition={{ type: 'spring', stiffness: 400, damping: 90 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Makes any element float gently with a parallax effect
 */
export function FloatingElement({
  children,
  floatAmount = 10,
  duration = 4,
  delay = 0,
  className = ''
}: {
  children: ReactNode;
  floatAmount?: number;
  duration?: number;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      animate={{ 
        y: [`${-floatAmount}px`, `${floatAmount}px`]
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Component that reveals its children with an animation when scrolled into view
 */
export function RevealOnScroll({
  children,
  className = '',
  delay = 0,
  threshold = 0.1,
  direction = 'up',
  distance = 50
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  
  // Set initial and animate values based on direction
  const getInitialPosition = () => {
    switch(direction) {
      case 'up': return { opacity: 0, y: distance };
      case 'down': return { opacity: 0, y: -distance };
      case 'left': return { opacity: 0, x: distance };
      case 'right': return { opacity: 0, x: -distance };
      default: return { opacity: 0, y: distance };
    }
  };
  
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={getInitialPosition()}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : getInitialPosition()
      }
      transition={{
        duration: 0.8,
        delay: delay,
        ease: [0.17, 0.55, 0.55, 1]
      }}
    >
      {children}
    </motion.div>
  );
}

export function ParallaxBackground({
  children,
  className = '',
  intensity = 20,
  inverted = false
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
  inverted?: boolean;
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    // Initialize window size
    handleResize();
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Calculate the percentage position of the mouse
  const xPercentage = windowSize.width ? mousePosition.x / windowSize.width : 0;
  const yPercentage = windowSize.height ? mousePosition.y / windowSize.height : 0;
  
  // Calculate the movement offset for parallax (invert if needed)
  const moveX = inverted 
    ? (xPercentage - 0.5) * intensity 
    : (0.5 - xPercentage) * intensity;
    
  const moveY = inverted 
    ? (yPercentage - 0.5) * intensity 
    : (0.5 - yPercentage) * intensity;
  
  return (
    <motion.div
      className={`transition-transform ${className}`}
      animate={{
        x: moveX,
        y: moveY
      }}
      transition={{
        type: "spring",
        stiffness: 50,
        damping: 30,
        mass: 0.8
      }}
    >
      {children}
    </motion.div>
  );
}