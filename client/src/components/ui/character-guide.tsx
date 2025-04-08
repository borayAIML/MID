import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X, HelpCircle, Sparkles, LightbulbIcon, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Character types with personality traits
export type CharacterType = 'emilia' | 'mentor' | 'analyst' | 'coach';

interface CharacterGuideProps {
  character?: CharacterType;
  title: string;
  content: string | React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  isOpen?: boolean;
  onClose?: () => void;
  onAction?: () => void;
  actionText?: string;
  className?: string;
  children?: React.ReactNode;
  dismissible?: boolean;
  autoShow?: boolean;
  delay?: number;
  width?: 'narrow' | 'medium' | 'wide';
  withArrow?: boolean;
  highlightTarget?: boolean;
  persistToLocalStorage?: boolean;
  storageKey?: string;
}

// Character configuration for different personalities
const characterConfig: Record<CharacterType, {
  name: string;
  avatar: string;
  color: string;
  personality: string;
  style: string;
}> = {
  emilia: {
    name: 'Emilia',
    avatar: '👩‍💼',
    color: 'bg-gradient-to-r from-purple-500 to-indigo-500',
    personality: 'friendly and helpful',
    style: 'border-l-4 border-purple-500'
  },
  mentor: {
    name: 'Mentor',
    avatar: '🧙‍♂️',
    color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    personality: 'wise and insightful',
    style: 'border-l-4 border-blue-500'
  },
  analyst: {
    name: 'Analyst',
    avatar: '🧠',
    color: 'bg-gradient-to-r from-emerald-500 to-green-500',
    personality: 'data-driven and precise',
    style: 'border-l-4 border-emerald-500'
  },
  coach: {
    name: 'Coach',
    avatar: '🏆',
    color: 'bg-gradient-to-r from-amber-500 to-orange-500',
    personality: 'motivating and energetic',
    style: 'border-l-4 border-amber-500'
  }
};

export const CharacterGuide: React.FC<CharacterGuideProps> = ({ 
  character = 'emilia',
  title,
  content,
  position = 'bottom',
  isOpen: externalIsOpen,
  onClose,
  onAction,
  actionText = 'Got it',
  className,
  children,
  dismissible = true,
  autoShow = false,
  delay = 500,
  width = 'medium',
  withArrow = true,
  highlightTarget = false,
  persistToLocalStorage = false,
  storageKey = '',
}) => {
  // Use controlled or uncontrolled state based on prop presence
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = externalIsOpen !== undefined;
  const isOpen = isControlled ? externalIsOpen : internalIsOpen;
  
  const tooltipRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  
  // Handle localStorage for tooltip dismissal state
  useEffect(() => {
    if (persistToLocalStorage && storageKey) {
      const hasBeenShown = localStorage.getItem(`tooltip-${storageKey}`);
      if (hasBeenShown === 'dismissed') {
        // If it's already been dismissed, don't show
        if (!isControlled) {
          setInternalIsOpen(false);
        }
      }
    }
  }, [persistToLocalStorage, storageKey, isControlled]);
  
  // Auto-show tooltip after delay
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    if (autoShow && !isOpen) {
      // Only auto-show if it hasn't been dismissed before
      if (persistToLocalStorage && storageKey) {
        const hasBeenShown = localStorage.getItem(`tooltip-${storageKey}`);
        if (hasBeenShown === 'dismissed') return;
      }
      
      timeoutId = setTimeout(() => {
        if (!isControlled) {
          setInternalIsOpen(true);
        }
      }, delay);
    }
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [autoShow, delay, isOpen, isControlled, persistToLocalStorage, storageKey]);
  
  // Handle click outside to close tooltip
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current && 
        !tooltipRef.current.contains(event.target as Node) &&
        targetRef.current && 
        !targetRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  const handleToggle = () => {
    if (!isControlled) {
      setInternalIsOpen(!internalIsOpen);
    }
  };
  
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    
    if (!isControlled) {
      setInternalIsOpen(false);
    }
    
    // Save dismissal to localStorage if configured
    if (persistToLocalStorage && storageKey) {
      localStorage.setItem(`tooltip-${storageKey}`, 'dismissed');
    }
  };
  
  const handleAction = () => {
    if (onAction) {
      onAction();
    }
    handleClose();
  };
  
  // Determine width class
  const widthClass = {
    narrow: 'max-w-xs',
    medium: 'max-w-sm',
    wide: 'max-w-md',
  }[width];
  
  // Determine position classes
  const positionClass = {
    top: 'bottom-full mb-2',
    right: 'left-full ml-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
  }[position];
  
  // Determine arrow position and styles
  const arrowPosition = {
    top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45',
    right: 'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rotate-45',
    bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45',
    left: 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45',
  }[position];
  
  // Configure character
  const currentCharacter = characterConfig[character];
  
  // Animation variants
  const tooltipVariants = {
    hidden: {
      opacity: 0,
      y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0,
      x: position === 'left' ? 10 : position === 'right' ? -10 : 0,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }
    },
    exit: {
      opacity: 0,
      y: position === 'top' ? 5 : position === 'bottom' ? -5 : 0,
      x: position === 'left' ? 5 : position === 'right' ? -5 : 0,
      scale: 0.98,
      transition: {
        duration: 0.2
      }
    }
  };
  
  const buttonIcon = highlightTarget ? (
    <div className="relative">
      <HelpCircle className="w-5 h-5" />
      <motion.div 
        className="absolute -inset-1 rounded-full opacity-30"
        initial={{ scale: 1, opacity: 0.3 }}
        animate={{ 
          scale: [1, 1.2, 1], 
          opacity: [0.3, 0.6, 0.3] 
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2,
        }}
      />
    </div>
  ) : <HelpCircle className="w-5 h-5" />;
  
  return (
    <div className={cn("relative inline-block", className)}>
      {/* Target element */}
      <div 
        ref={targetRef}
        className={cn(
          "inline-flex cursor-pointer",
          highlightTarget && "ring-2 ring-offset-2 ring-primary-400 rounded"
        )}
        onClick={handleToggle}
      >
        {children || (
          <button 
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Show guide"
          >
            {buttonIcon}
          </button>
        )}
      </div>
      
      {/* Tooltip */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={tooltipRef}
            className={cn(
              "absolute z-50",
              positionClass,
              "min-w-[200px]",
              widthClass
            )}
            variants={tooltipVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Arrow */}
            {withArrow && (
              <div 
                className={cn(
                  "absolute w-3 h-3 bg-white border-t border-l",
                  "border-gray-200",
                  arrowPosition
                )}
              />
            )}
            
            <div 
              className={cn(
                "bg-white rounded-lg shadow-lg p-4 relative",
                "border border-gray-200",
                currentCharacter.style
              )}
            >
              {/* Character header */}
              <div className="flex items-center mb-2">
                <div 
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center mr-2 text-white",
                    currentCharacter.color
                  )}
                >
                  <span className="text-lg">{currentCharacter.avatar}</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-800">{currentCharacter.name}</div>
                  <div className="text-xs text-gray-500">{title}</div>
                </div>
                {dismissible && (
                  <button 
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {/* Content */}
              <div className="text-sm text-gray-600 mb-4">
                {typeof content === 'string' ? (
                  <p>{content}</p>
                ) : (
                  content
                )}
              </div>
              
              {/* Actions */}
              <div className="flex justify-end space-x-2">
                {onAction && (
                  <Button 
                    size="sm" 
                    onClick={handleAction}
                    className="flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    {actionText}
                  </Button>
                )}
                {!onAction && dismissible && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleClose}
                  >
                    {actionText || 'Got it'}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Factory functions for character-specific tooltips
export const EmiliaGuide: React.FC<Omit<CharacterGuideProps, 'character'>> = (props) => (
  <CharacterGuide {...props} character="emilia" />
);

export const MentorGuide: React.FC<Omit<CharacterGuideProps, 'character'>> = (props) => (
  <CharacterGuide {...props} character="mentor" />
);

export const AnalystGuide: React.FC<Omit<CharacterGuideProps, 'character'>> = (props) => (
  <CharacterGuide {...props} character="analyst" />
);

export const CoachGuide: React.FC<Omit<CharacterGuideProps, 'character'>> = (props) => (
  <CharacterGuide {...props} character="coach" />
);

// Tour component that sequences multiple tooltips
interface TourGuideProps {
  steps: Array<CharacterGuideProps & { elementId: string }>;
  isActive: boolean;
  onComplete?: () => void;
  onSkip?: () => void;
}

export const TourGuide: React.FC<TourGuideProps> = ({
  steps,
  isActive,
  onComplete,
  onSkip,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Reset or advance tour
  useEffect(() => {
    if (!isActive) {
      setCurrentStep(0);
    }
  }, [isActive]);
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      if (onComplete) {
        onComplete();
      }
    }
  };
  
  // Render nothing if tour is inactive
  if (!isActive) {
    return null;
  }
  
  const currentStepData = steps[currentStep];
  
  return (
    <div className="tour-guide">
      <CharacterGuide
        {...currentStepData}
        isOpen={true}
        onAction={handleNext}
        actionText={currentStep < steps.length - 1 ? "Next" : "Finish"}
        onClose={onSkip}
        dismissible={true}
      />
    </div>
  );
};

// Infobox component for larger character-guided information sections
interface InfoboxProps extends Omit<CharacterGuideProps, 'position' | 'width'> {
  compact?: boolean;
  showAvatar?: boolean;
}

export const CharacterInfobox: React.FC<InfoboxProps> = ({
  character = 'emilia',
  title,
  content,
  className,
  compact = false,
  showAvatar = true,
  onAction,
  actionText,
  dismissible = false,
  onClose,
  ...props
}) => {
  const currentCharacter = characterConfig[character];
  
  return (
    <div 
      className={cn(
        "relative bg-white rounded-lg shadow-md border border-gray-200",
        currentCharacter.style,
        compact ? "p-3" : "p-4",
        className
      )}
      {...props}
    >
      {/* Character header */}
      <div className={cn("flex items-center", compact ? "mb-1" : "mb-3")}>
        {showAvatar && (
          <div 
            className={cn(
              "rounded-full flex items-center justify-center mr-2 text-white",
              currentCharacter.color,
              compact ? "w-6 h-6 text-sm" : "w-8 h-8 text-lg"
            )}
          >
            <span>{currentCharacter.avatar}</span>
          </div>
        )}
        <div className="flex-1">
          <div className={cn("font-medium text-gray-800", compact ? "text-xs" : "text-sm")}>{title}</div>
        </div>
        {dismissible && (
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X className={cn(compact ? "w-3 h-3" : "w-4 h-4")} />
          </button>
        )}
      </div>
      
      {/* Content */}
      <div className={cn("text-gray-600", compact ? "text-xs" : "text-sm")}>
        {typeof content === 'string' ? (
          <p>{content}</p>
        ) : (
          content
        )}
      </div>
      
      {/* Actions */}
      {onAction && (
        <div className={cn("flex justify-end", compact ? "mt-2" : "mt-3")}>
          <Button 
            size={compact ? "xs" : "sm"}
            onClick={onAction}
            className="flex items-center gap-1"
          >
            <Sparkles className={cn(compact ? "w-2 h-2" : "w-3 h-3")} />
            {actionText || 'Learn more'}
          </Button>
        </div>
      )}
    </div>
  );
};