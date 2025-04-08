import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Calculator, 
  DollarSign, 
  LineChart, 
  BarChart4,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';

type LoaderSize = 'sm' | 'md' | 'lg';

interface FinancialLoaderProps {
  size?: LoaderSize;
  text?: string;
  className?: string;
  textClassName?: string;
  loaderType?: 'chart' | 'calculator' | 'money' | 'growth' | 'pulse';
}

// Size configuration for different loader sizes
const sizeConfig = {
  sm: {
    iconSize: 'h-3 w-3',
    containerSize: 'h-4 w-4',
    text: 'text-xs',
    spacing: 'space-y-1'
  },
  md: {
    iconSize: 'h-5 w-5',
    containerSize: 'h-8 w-8',
    text: 'text-sm',
    spacing: 'space-y-2'
  },
  lg: {
    iconSize: 'h-8 w-8',
    containerSize: 'h-12 w-12',
    text: 'text-base',
    spacing: 'space-y-3'
  }
};

/**
 * Financial chart loader - mimics a stock or valuation chart being drawn
 */
export function ChartLoader({ 
  size = 'md',
  text,
  className,
  textClassName
}: FinancialLoaderProps) {
  const sizes = sizeConfig[size];
  
  return (
    <div className={cn("flex flex-col items-center", sizes.spacing, className)}>
      <div className={cn("relative", sizes.containerSize)}>
        <motion.div
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatType: "loop" }}
          className={cn("text-blue-500", sizes.iconSize)}
        >
          <LineChart strokeWidth={2} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <BarChart4 className={cn("text-indigo-400", sizes.iconSize)} strokeWidth={1.5} />
        </motion.div>
      </div>
      
      {text && (
        <motion.p 
          className={cn("text-center", sizes.text, "text-gray-600 dark:text-gray-300", textClassName)}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

/**
 * Calculator loader - mimics calculations happening
 */
export function CalculatorLoader({ 
  size = 'md',
  text,
  className,
  textClassName
}: FinancialLoaderProps) {
  const sizes = sizeConfig[size];
  
  return (
    <div className={cn("flex flex-col items-center", sizes.spacing, className)}>
      <div className={cn("relative", sizes.containerSize)}>
        <motion.div
          animate={{ 
            rotate: [0, 5, 0, -5, 0],
            scale: [1, 1.05, 1, 1.05, 1] 
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className={cn("text-emerald-500", sizes.iconSize)}
        >
          <Calculator strokeWidth={2} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0.7, 1.2, 0.7],
            y: [-2, 2, -2]
          }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
          className="absolute top-0 right-0 -mt-1 -mr-1"
        >
          <div className={cn("text-xs", size === 'sm' ? 'text-[8px]' : '')}>+</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0.7, 1.2, 0.7],
            y: [2, -2, 2]
          }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.8 }}
          className="absolute bottom-0 left-0 -mb-1 -ml-1"
        >
          <div className={cn("text-xs", size === 'sm' ? 'text-[8px]' : '')}>%</div>
        </motion.div>
      </div>
      
      {text && (
        <motion.p 
          className={cn("text-center", sizes.text, "text-gray-600 dark:text-gray-300", textClassName)}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

/**
 * Money loader - coins and dollar animations
 */
export function MoneyLoader({ 
  size = 'md',
  text,
  className,
  textClassName
}: FinancialLoaderProps) {
  const sizes = sizeConfig[size];
  
  return (
    <div className={cn("flex flex-col items-center", sizes.spacing, className)}>
      <div className={cn("relative", sizes.containerSize)}>
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1, 1.1, 1],
            y: [0, -2, 0, -2, 0]
          }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className={cn("text-green-500", sizes.iconSize)}
        >
          <DollarSign strokeWidth={2} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5, x: 5, y: 5 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0.7, 1, 0.7],
            x: [5, 10, 5],
            y: [5, 0, 5]
          }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          className="absolute -bottom-1 -right-1 h-2 w-2 bg-yellow-400 rounded-full"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.5, x: -5, y: -5 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0.7, 1, 0.7],
            x: [-5, -10, -5],
            y: [-5, 0, -5]
          }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.7 }}
          className="absolute -top-1 -left-1 h-2 w-2 bg-yellow-400 rounded-full"
        />
      </div>
      
      {text && (
        <motion.p 
          className={cn("text-center", sizes.text, "text-gray-600 dark:text-gray-300", textClassName)}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

/**
 * Growth loader - growth trend animation
 */
export function GrowthLoader({ 
  size = 'md',
  text,
  className,
  textClassName
}: FinancialLoaderProps) {
  const sizes = sizeConfig[size];
  
  return (
    <div className={cn("flex flex-col items-center", sizes.spacing, className)}>
      <div className={cn("relative", sizes.containerSize)}>
        <motion.div
          initial={{ pathLength: 0, pathOffset: 0 }}
          animate={{ 
            pathLength: [0, 1],
            pathOffset: [0, 0.2]
          }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
          className={cn("text-indigo-500", sizes.iconSize)}
        >
          <TrendingUp strokeWidth={2} />
        </motion.div>
        <motion.div 
          className="absolute -right-1 -top-1 h-1.5 w-1.5 bg-indigo-500 rounded-full"
          animate={{ 
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "loop", delay: 1.3 }}
        />
      </div>
      
      {text && (
        <motion.p 
          className={cn("text-center", sizes.text, "text-gray-600 dark:text-gray-300", textClassName)}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

/**
 * Pulse loader - financial heartbeat style
 */
export function PulseLoader({ 
  size = 'md',
  text,
  className,
  textClassName
}: FinancialLoaderProps) {
  const sizes = sizeConfig[size];
  
  return (
    <div className={cn("flex flex-col items-center", sizes.spacing, className)}>
      <div className={cn("relative", sizes.containerSize)}>
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            color: ['#3b82f6', '#8b5cf6', '#3b82f6']
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className={cn("text-blue-500", sizes.iconSize)}
        >
          <Heart strokeWidth={2} />
        </motion.div>
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(59, 130, 246, 0)',
              '0 0 0 4px rgba(59, 130, 246, 0.3)',
              '0 0 0 8px rgba(59, 130, 246, 0)'
            ]
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
      
      {text && (
        <motion.p 
          className={cn("text-center", sizes.text, "text-gray-600 dark:text-gray-300", textClassName)}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

/**
 * Main loader that provides all financial loader types
 */
export function FinancialLoader({
  size = 'md',
  text,
  className,
  textClassName,
  loaderType = 'chart'
}: FinancialLoaderProps) {
  
  switch (loaderType) {
    case 'calculator':
      return (
        <CalculatorLoader 
          size={size} 
          text={text} 
          className={className} 
          textClassName={textClassName} 
        />
      );
    case 'money':
      return (
        <MoneyLoader 
          size={size} 
          text={text} 
          className={className} 
          textClassName={textClassName} 
        />
      );
    case 'growth':
      return (
        <GrowthLoader 
          size={size} 
          text={text} 
          className={className} 
          textClassName={textClassName} 
        />
      );
    case 'pulse':
      return (
        <PulseLoader 
          size={size} 
          text={text} 
          className={className} 
          textClassName={textClassName} 
        />
      );
    case 'chart':
    default:
      return (
        <ChartLoader 
          size={size} 
          text={text} 
          className={className} 
          textClassName={textClassName} 
        />
      );
  }
}