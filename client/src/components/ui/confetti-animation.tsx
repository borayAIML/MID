import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ConfettiProps {
  duration?: number;
  pieces?: number;
  colors?: string[];
  onComplete?: () => void;
  trigger?: boolean;
}

export function ConfettiAnimation({
  duration = 2000,
  pieces = 100,
  colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'],
  onComplete,
  trigger = false
}: ConfettiProps) {
  const [confetti, setConfetti] = useState<boolean>(trigger);
  const [confettiElements, setConfettiElements] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    if (trigger && !confetti) {
      setConfetti(true);
    }
  }, [trigger, confetti]);

  useEffect(() => {
    if (!confetti) return;

    // Generate confetti elements
    const elements = Array.from({ length: pieces }).map((_, i) => {
      const size = Math.floor(Math.random() * 10) + 5; // 5-15px
      const color = colors[Math.floor(Math.random() * colors.length)];
      const xStart = Math.random() * 100; // Random starting position
      const delay = Math.random() * 0.5; // Random delay for more natural effect
      
      // Random initial velocity angles
      const angle = Math.random() * Math.PI * 2;
      const velocity = 30 + Math.random() * 100;
      const xMovement = Math.cos(angle) * velocity;
      
      return (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: Math.random() > 0.3 ? '50%' : '0', // Mix circles and squares
            backgroundColor: color,
            top: 0,
            left: `${xStart}%`,
            opacity: 1
          }}
          initial={{ y: -20, x: 0, rotate: 0 }}
          animate={{
            y: window.innerHeight + 100,
            x: xMovement,
            rotate: Math.random() * 360 * (Math.random() > 0.5 ? 1 : -1), // Random rotation
            opacity: 0
          }}
          transition={{
            duration: 1 + Math.random() * 2.5, // 1-3.5s fall time
            ease: [0.1, 0.25, 0.85, 1], // Custom ease
            delay: delay
          }}
        />
      );
    });

    setConfettiElements(elements);

    // Stop the animation after the duration
    const timer = setTimeout(() => {
      setConfetti(false);
      if (onComplete) onComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [confetti, duration, pieces, colors, onComplete]);

  if (!confetti) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiElements}
    </div>
  );
}

// Interactive celebration confetti with message
interface CelebrationProps {
  message: string;
  subtext?: string;
  isVisible: boolean;
  onClose?: () => void;
  duration?: number;
  emoticon?: string;
}

export function CelebrationConfetti({ 
  message,
  subtext,
  isVisible,
  onClose,
  duration = 5000,
  emoticon = "🎉"
}: CelebrationProps) {
  const [visible, setVisible] = useState(isVisible);
  
  useEffect(() => {
    setVisible(isVisible);
    
    let timer: NodeJS.Timeout | null = null;
    
    if (isVisible) {
      timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isVisible, duration, onClose]);
  
  if (!visible) return null;
  
  return (
    <>
      <ConfettiAnimation trigger={true} pieces={150} />
      
      <motion.div 
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="bg-black/20 fixed inset-0" onClick={() => {
          setVisible(false);
          if (onClose) onClose();
        }} />
        
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center max-w-sm mx-4 z-10"
          initial={{ scale: 0.8, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          <div className="text-4xl mb-4">{emoticon}</div>
          <h2 className="text-xl font-bold mb-2">{message}</h2>
          {subtext && <p className="text-gray-500 dark:text-gray-400 mb-4">{subtext}</p>}
          
          <motion.button
            className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-medium"
            onClick={() => {
              setVisible(false);
              if (onClose) onClose();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continue
          </motion.button>
        </motion.div>
      </motion.div>
    </>
  );
}