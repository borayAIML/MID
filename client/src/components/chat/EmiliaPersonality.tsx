import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, LightbulbIcon, Heart, AlertCircle, ChartBar, Sparkles, MessageCircle, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

export type EmiliaPersonalityType = 
  | 'neutral'  // Default state
  | 'thinking'  // When processing complex information
  | 'excited'   // When providing positive information
  | 'concerned' // When discussing risks or issues
  | 'analytical' // When presenting data or analysis
  | 'creative'  // When suggesting innovative ideas
  | 'helpful';  // When answering general questions

export interface EmiliaPersonalityProps {
  mood: EmiliaPersonalityType;
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
  withAnimation?: boolean;
  className?: string;
}

const moodTexts = {
  neutral: "I'm Emilia, your business valuation assistant",
  thinking: "Analyzing your business data...",
  excited: "I found something interesting!",
  concerned: "I should point out a potential issue",
  analytical: "Let me break down these numbers for you",
  creative: "I have an innovative suggestion",
  helpful: "I'm happy to help you with that"
};

const moodColors = {
  neutral: 'bg-blue-100 text-blue-600',
  thinking: 'bg-purple-100 text-purple-600',
  excited: 'bg-green-100 text-green-600',
  concerned: 'bg-amber-100 text-amber-600',
  analytical: 'bg-indigo-100 text-indigo-600',
  creative: 'bg-pink-100 text-pink-600',
  helpful: 'bg-teal-100 text-teal-600'
};

const moodIcons = {
  neutral: MessageCircle,
  thinking: BrainCircuit,
  excited: Sparkles,
  concerned: AlertCircle,
  analytical: ChartBar,
  creative: LightbulbIcon,
  helpful: Heart
};

export function EmiliaPersonality({
  mood = 'neutral',
  size = 'md',
  withText = false,
  withAnimation = true,
  className
}: EmiliaPersonalityProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };
  
  const IconComponent = moodIcons[mood];
  const moodText = moodTexts[mood];
  const moodColor = moodColors[mood];
  
  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 36
  };
  
  // Different animation variants based on the mood
  const getAnimationVariants = () => {
    switch(mood) {
      case 'thinking':
        return {
          animate: { 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.05, 1]
          },
          transition: {
            duration: 3,
            repeat: Infinity,
            repeatType: "loop"
          }
        };
      case 'excited':
        return {
          animate: { 
            scale: [1, 1.15, 1],
            y: [0, -5, 0]
          },
          transition: {
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop"
          }
        };
      case 'concerned':
        return {
          animate: { 
            scale: [1, 1.1, 1],
            rotate: [0, -5, 0, 5, 0]
          },
          transition: {
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }
        };
      case 'analytical':
        return {
          animate: { 
            scale: [1, 1.03, 1],
            opacity: [0.9, 1, 0.9]
          },
          transition: {
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }
        };
      case 'creative':
        return {
          animate: { 
            rotate: [0, 15, 0, -15, 0],
            scale: [1, 1.1, 1]
          },
          transition: {
            duration: 3,
            repeat: Infinity,
            repeatType: "loop"
          }
        };
      case 'helpful':
        return {
          animate: { 
            scale: [1, 1.1, 1],
            y: [0, -3, 0]
          },
          transition: {
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop"
          }
        };
      default: // neutral
        return {
          animate: { 
            scale: [1, 1.05, 1],
            opacity: [0.9, 1, 0.9]
          },
          transition: {
            duration: 3,
            repeat: Infinity,
            repeatType: "loop"
          }
        };
    }
  };
  
  const animationProps = withAnimation ? getAnimationVariants() : {};
  
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <motion.div 
        className={cn(
          "rounded-full flex items-center justify-center", 
          sizeClasses[size],
          moodColor
        )}
        {...animationProps}
      >
        <IconComponent size={iconSizes[size]} />
      </motion.div>
      
      {withText && (
        <AnimatePresence mode="wait">
          <motion.div 
            key={mood}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-2 text-center text-sm font-medium"
          >
            {moodText}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

// Function to detect the mood from message content
export function detectMoodFromMessage(message: string): EmiliaPersonalityType {
  const lowerMessage = message.toLowerCase();
  
  // Check for different patterns to determine the appropriate mood
  if (
    lowerMessage.includes('analyzing') || 
    lowerMessage.includes('processing') || 
    lowerMessage.includes('thinking') ||
    lowerMessage.includes('let me calculate')
  ) {
    return 'thinking';
  } else if (
    lowerMessage.includes('great news') || 
    lowerMessage.includes('excellent') || 
    lowerMessage.includes('congratulations') ||
    lowerMessage.includes('impressive')
  ) {
    return 'excited';
  } else if (
    lowerMessage.includes('concern') || 
    lowerMessage.includes('warning') || 
    lowerMessage.includes('risk') ||
    lowerMessage.includes('issue') ||
    lowerMessage.includes('problem')
  ) {
    return 'concerned';
  } else if (
    lowerMessage.includes('data shows') || 
    lowerMessage.includes('analysis') || 
    lowerMessage.includes('statistics') ||
    lowerMessage.includes('figures') ||
    lowerMessage.includes('percentage') ||
    lowerMessage.includes('trend')
  ) {
    return 'analytical';
  } else if (
    lowerMessage.includes('innovative') || 
    lowerMessage.includes('creative') || 
    lowerMessage.includes('idea') ||
    lowerMessage.includes('suggest')
  ) {
    return 'creative';
  } else if (
    lowerMessage.includes('help') || 
    lowerMessage.includes('assist') || 
    lowerMessage.includes('support') ||
    lowerMessage.startsWith('i can')
  ) {
    return 'helpful';
  }
  
  // Default to neutral if no specific patterns match
  return 'neutral';
}