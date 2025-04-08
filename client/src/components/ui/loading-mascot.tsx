import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type MascotMood = 'neutral' | 'happy' | 'thinking' | 'celebrating' | 'explaining';
type MascotSize = 'sm' | 'md' | 'lg' | 'xl';

interface LoadingMascotProps {
  mood?: MascotMood;
  size?: MascotSize;
  className?: string;
  message?: string;
  showSpeechBubble?: boolean;
  animated?: boolean;
}

const LoadingMascot = ({ 
  mood = 'neutral', 
  size = 'md', 
  className = '', 
  message = 'Analyzing your business data...', 
  showSpeechBubble = true, 
  animated = true 
}: LoadingMascotProps) => {
  
  // Define size in pixels based on the size prop
  const getSizeInPixels = (sizeParam: MascotSize): number => {
    switch (sizeParam) {
      case 'sm': return 60;
      case 'md': return 100;
      case 'lg': return 150;
      case 'xl': return 200;
      default: return 100;
    }
  };
  
  const pixelSize = getSizeInPixels(size);
  
  // Create animation objects
  const eyeBlinkAnimation = animated ? {
    animate: {
      scaleY: [1, 0.1, 1],
      transition: { 
        repeat: Infinity, 
        repeatDelay: 3,
        duration: 0.2,
        times: [0, 0.5, 1]
      }
    }
  } : {};
  
  const bodyWiggleAnimation = animated ? {
    animate: {
      rotate: [0, -2, 0, 2, 0],
      transition: { 
        repeat: Infinity, 
        duration: 2,
        ease: "easeInOut" 
      }
    }
  } : {};
  
  const loadingDotsAnimation = animated ? {
    animate: {
      opacity: [0, 1, 0],
      y: [0, -5, 0],
      transition: {
        repeat: Infinity,
        duration: 1,
        ease: "easeInOut",
        delay: 0.2
      }
    }
  } : {};
  
  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      {/* Mascot SVG */}
      <motion.div 
        {...bodyWiggleAnimation}
        className="relative"
        style={{ width: pixelSize, height: pixelSize }}
      >
        <svg 
          width={pixelSize} 
          height={pixelSize} 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Body - an owl shape in blue/purple gradient */}
          <motion.path 
            d="M50 95C72 95 90 80 90 55C90 30 72 15 50 15C28 15 10 30 10 55C10 80 28 95 50 95Z" 
            fill="url(#mascot-body-gradient)" 
          />
          
          {/* Light belly */}
          <path 
            d="M50 85C62 85 72 75 72 60C72 45 62 35 50 35C38 35 28 45 28 60C28 75 38 85 50 85Z" 
            fill="#F0F4FF" 
          />
          
          {/* Eyes based on mood */}
          {mood === 'thinking' ? (
            <>
              {/* Thinking eyes (one open, one squinting) */}
              <motion.ellipse 
                {...eyeBlinkAnimation}
                cx="35" 
                cy="50" 
                rx="8" 
                ry="10" 
                fill="#0C2461" 
              />
              <path 
                d="M65 45C68.3137 45 71 47.6863 71 51C71 54.3137 68.3137 57 65 57" 
                stroke="#0C2461" 
                strokeWidth="2" 
                strokeLinecap="round" 
              />
            </>
          ) : mood === 'happy' ? (
            <>
              {/* Happy eyes (curved upwards) */}
              <path 
                d="M30 50C33.3137 47 36.6863 47 40 50" 
                stroke="#0C2461" 
                strokeWidth="2" 
                strokeLinecap="round" 
              />
              <path 
                d="M60 50C63.3137 47 66.6863 47 70 50" 
                stroke="#0C2461" 
                strokeWidth="2" 
                strokeLinecap="round" 
              />
            </>
          ) : mood === 'celebrating' ? (
            <>
              {/* Celebrating eyes (stars) */}
              <path 
                d="M35 50L37 45L35 40L40 42L45 40L43 45L45 50L40 48L35 50Z" 
                fill="#0C2461" 
              />
              <path 
                d="M65 50L67 45L65 40L70 42L75 40L73 45L75 50L70 48L65 50Z" 
                fill="#0C2461" 
              />
            </>
          ) : mood === 'explaining' ? (
            <>
              {/* Explaining eyes (one raised eyebrow) */}
              <motion.ellipse 
                {...eyeBlinkAnimation}
                cx="35" 
                cy="50" 
                rx="8" 
                ry="10" 
                fill="#0C2461" 
              />
              <motion.ellipse 
                {...eyeBlinkAnimation}
                cx="65" 
                cy="48" 
                rx="8" 
                ry="10" 
                fill="#0C2461" 
              />
              <path 
                d="M55 38C58 36 62 36 65 38" 
                stroke="#0C2461" 
                strokeWidth="2" 
                strokeLinecap="round" 
              />
            </>
          ) : (
            <>
              {/* Default neutral eyes (round) */}
              <motion.ellipse 
                {...eyeBlinkAnimation}
                cx="35" 
                cy="50" 
                rx="8" 
                ry="10" 
                fill="#0C2461" 
              />
              <motion.ellipse 
                {...eyeBlinkAnimation}
                cx="65" 
                cy="50" 
                rx="8" 
                ry="10" 
                fill="#0C2461" 
              />
            </>
          )}
          
          {/* Beak */}
          <path 
            d="M45 65H55L50 72L45 65Z" 
            fill="#F59E0B" 
            stroke="#D97706" 
            strokeWidth="1" 
          />
          
          {/* Eyebrows based on mood */}
          {mood === 'thinking' ? (
            <>
              <path 
                d="M25 40C28 38 32 38 35 40" 
                stroke="#0C2461" 
                strokeWidth="2" 
                strokeLinecap="round" 
              />
              <path 
                d="M55 38C62 35 68 38 75 42" 
                stroke="#0C2461" 
                strokeWidth="2" 
                strokeLinecap="round" 
              />
            </>
          ) : mood === 'explaining' ? (
            <>
              <path 
                d="M25 40C28 38 32 38 35 40" 
                stroke="#0C2461" 
                strokeWidth="2" 
                strokeLinecap="round" 
              />
              <path 
                d="M55 38C58 36 62 36 65 38" 
                stroke="#0C2461" 
                strokeWidth="2" 
                strokeLinecap="round" 
              />
            </>
          ) : (
            <>
              <path 
                d="M25 40C28 38 32 38 35 40" 
                stroke="#0C2461" 
                strokeWidth="2" 
                strokeLinecap="round" 
              />
              <path 
                d="M65 40C68 38 72 38 75 40" 
                stroke="#0C2461" 
                strokeWidth="2" 
                strokeLinecap="round" 
              />
            </>
          )}
          
          {/* Wings */}
          <path 
            d="M15 60C12 50 14 40 20 35M85 60C88 50 86 40 80 35" 
            stroke="#4C6EF5" 
            strokeWidth="3" 
            strokeLinecap="round" 
          />
          
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="mascot-body-gradient" x1="50" y1="15" x2="50" y2="95" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4C6EF5" />
              <stop offset="1" stopColor="#3B4FD8" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Add animation effects based on mood */}
        {animated && mood === 'thinking' && (
          <motion.div 
            className="absolute text-blue-600 text-lg font-bold"
            style={{ top: pixelSize * 0.25, right: pixelSize * 0.15 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0.8, 1, 0.8],
              rotate: [0, 10, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2
            }}
          >
            ?
          </motion.div>
        )}
        
        {animated && mood === 'celebrating' && (
          <>
            <motion.div 
              className="absolute text-yellow-500 text-lg"
              style={{ top: pixelSize * 0.1, left: pixelSize * 0.2 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
                y: [0, -10, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5,
                delay: 0.2
              }}
            >
              ✨
            </motion.div>
            <motion.div 
              className="absolute text-yellow-500 text-lg"
              style={{ top: pixelSize * 0.1, right: pixelSize * 0.2 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
                y: [0, -10, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5,
                delay: 0.5
              }}
            >
              ✨
            </motion.div>
          </>
        )}
      </motion.div>
      
      {/* Speech bubble with message */}
      {showSpeechBubble && (
        <div className="relative mt-4 bg-white rounded-lg p-3 px-4 shadow-sm border border-gray-200 max-w-[200px]">
          <div className="absolute top-[-8px] left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 bg-white border-t border-l border-gray-200"></div>
          <p className="text-sm text-center text-gray-700">
            {message}
            <motion.span 
              {...loadingDotsAnimation}
              className="inline-block ml-1"
            >
              ...
            </motion.span>
          </p>
        </div>
      )}
    </div>
  );
};

// Loading state with mascot and spinner
export const LoadingState: React.FC<{
  message?: string;
  className?: string;
  mascotMood?: MascotMood;
  showSpinner?: boolean;
}> = ({
  message = "Loading your data",
  className = "",
  mascotMood = "neutral",
  showSpinner = true
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-6", className)}>
      <LoadingMascot 
        mood={mascotMood} 
        size="lg" 
        message={message} 
      />
      
      {showSpinner && (
        <div className="mt-6">
          <motion.div
            className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}
    </div>
  );
};

// Full-page loading overlay
export const LoadingOverlay: React.FC<{
  message?: string;
  mascotMood?: MascotMood;
}> = ({
  message = "Preparing your business valuation",
  mascotMood = "thinking"
}) => {
  return (
    <motion.div
      className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <LoadingState 
        message={message} 
        mascotMood={mascotMood} 
      />
    </motion.div>
  );
};

// Button with loading state that shows mini mascot
export const MascotLoadingButton: React.FC<{
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}> = ({
  children,
  isLoading = false,
  className = "",
  onClick,
  disabled = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        "relative flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md transition-all", 
        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/90",
        className
      )}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <LoadingMascot 
            mood="thinking" 
            size="sm" 
            showSpeechBubble={false} 
          />
          <span>Loading...</span>
        </div>
      ) : children}
    </button>
  );
};

export default LoadingMascot;