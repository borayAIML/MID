import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  BarChart, 
  Calculator, 
  LightbulbIcon, 
  Cog, 
  BrainCircuit, 
  TrendingUp, 
  Loader2, 
  RefreshCw,
  BarChart2 // Using BarChart2 instead of Equalizer which doesn't exist
} from 'lucide-react';

type LoaderType = 'chart' | 'calculation' | 'insight' | 'processing';

interface AnimatedLoaderProps {
  type?: LoaderType;
  text?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  loops?: number; // Number of animation loops before completion, -1 for infinite
  onComplete?: () => void;
}

export function AnimatedLoader({
  type = 'processing',
  text,
  className,
  size = 'md',
  loops = -1, 
  onComplete
}: AnimatedLoaderProps) {
  const [currentLoop, setCurrentLoop] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  
  // Size mapping
  const sizeMap = {
    sm: {
      containerClass: 'p-2',
      iconSize: 16,
      textClass: 'text-xs mt-1',
      progressSize: 'h-1'
    },
    md: {
      containerClass: 'p-3',
      iconSize: 24,
      textClass: 'text-sm mt-2',
      progressSize: 'h-1.5'
    },
    lg: {
      containerClass: 'p-4',
      iconSize: 32,
      textClass: 'text-base mt-3',
      progressSize: 'h-2'
    }
  };
  
  // Fun messages for each loader type
  const loadingMessages = {
    chart: [
      "Crunching the numbers...",
      "Plotting data points...",
      "Analyzing trends...",
      "Generating visualizations...",
      "Connecting the dots..."
    ],
    calculation: [
      "Running complex calculations...",
      "Computing valuation models...",
      "Number crunching in progress...",
      "Calculating multiples...",
      "Applying financial formulas..."
    ],
    insight: [
      "Extracting valuable insights...",
      "Discovering hidden patterns...",
      "Analyzing potential opportunities...",
      "Finding growth indicators...",
      "Identifying market trends..."
    ],
    processing: [
      "Processing your request...",
      "Working on it...",
      "Almost there...",
      "Making things happen...",
      "Preparing your results..."
    ]
  };
  
  // Icons for each loader type
  const LoaderIcon = {
    chart: BarChart,
    calculation: Calculator,
    insight: LightbulbIcon,
    processing: Cog
  }[type];
  
  // Loader type colors
  const loaderColors = {
    chart: "bg-blue-100 text-blue-700",
    calculation: "bg-amber-100 text-amber-700",
    insight: "bg-purple-100 text-purple-700",
    processing: "bg-emerald-100 text-emerald-700"
  };
  
  const selectedSize = sizeMap[size];
  
  // Track animation loops
  useEffect(() => {
    if (loops > 0 && currentLoop >= loops && !showCompletion) {
      setShowCompletion(true);
      // Wait for completion animation to finish
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentLoop, loops, showCompletion, onComplete]);
  
  // Animation for the circular loading indicator
  const spinTransition = {
    loop: loops === -1 ? Infinity : loops,
    ease: "linear",
    duration: 1.5,
    onLoop: () => setCurrentLoop(prev => prev + 1)
  };
  
  // Animation for the progress bar
  const progressVariants = {
    initial: { width: "0%" },
    animate: { 
      width: "100%", 
      transition: { 
        duration: 2.5,
        repeat: loops === -1 ? Infinity : loops,
        repeatType: "loop" as "loop" // type assertion to fix the error
      }
    }
  };
  
  // Random loading messages
  const [message, setMessage] = useState(
    loadingMessages[type][Math.floor(Math.random() * loadingMessages[type].length)]
  );
  
  // Change message periodically
  useEffect(() => {
    if (showCompletion) return;
    
    const messageTimer = setInterval(() => {
      const messages = loadingMessages[type];
      const newMessage = messages[Math.floor(Math.random() * messages.length)];
      setMessage(newMessage);
    }, 3000);
    
    return () => clearInterval(messageTimer);
  }, [type, showCompletion]);
  
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center text-center",
        className
      )}
    >
      {showCompletion ? (
        <motion.div
          initial={{ scale: 0, rotate: 20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
          className={cn(
            "rounded-full p-3",
            "bg-green-100 text-green-700"
          )}
        >
          <TrendingUp size={selectedSize.iconSize} />
        </motion.div>
      ) : (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={spinTransition}
            className={cn(
              "rounded-full", 
              selectedSize.containerClass,
              loaderColors[type]
            )}
          >
            <LoaderIcon size={selectedSize.iconSize} />
          </motion.div>
          
          <motion.div 
            className={cn("flex items-center mt-3 gap-1.5")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className={cn(selectedSize.textClass)}>
              {text || message}
            </span>
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <BarChart2 size={selectedSize.iconSize * 0.7} className="text-gray-400" />
            </motion.span>
          </motion.div>
        </>
      )}
      
      {/* Progress bar */}
      <div 
        className={cn(
          "w-full mt-3 bg-gray-100 rounded-full overflow-hidden",
          selectedSize.progressSize
        )}
      >
        <motion.div
          className={cn(
            showCompletion ? "bg-green-500" : "bg-blue-500",
            selectedSize.progressSize
          )}
          variants={progressVariants}
          initial="initial"
          animate={showCompletion ? { width: "100%" } : "animate"}
        />
      </div>
      
      {showCompletion && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn("text-green-700 font-medium mt-2", selectedSize.textClass)}
        >
          Analysis complete!
        </motion.p>
      )}
    </div>
  );
}

// Special loaders for specific contexts
export function ValuationLoader(props: Omit<AnimatedLoaderProps, 'type'>) {
  return (
    <AnimatedLoader
      type="calculation"
      text="Calculating business valuation..."
      {...props}
    />
  );
}

export function InsightLoader(props: Omit<AnimatedLoaderProps, 'type'>) {
  return (
    <AnimatedLoader
      type="insight"
      text="Generating business insights..."
      {...props}
    />
  );
}

export function BenchmarkLoader(props: Omit<AnimatedLoaderProps, 'type'>) {
  return (
    <AnimatedLoader
      type="chart"
      text="Analyzing industry benchmarks..."
      {...props}
    />
  );
}

export function GeneralLoader({ 
  text = "Loading...",
  className
}: { 
  text?: string 
  className?: string 
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  );
}

export function RefreshLoader({ 
  text = "Refreshing...",
  className
}: { 
  text?: string 
  className?: string 
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <RefreshCw className="h-4 w-4 animate-spin" />
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  );
}

// AI thinking loader with animated brain
export function AIThinkingLoader({
  text = "AI analyzing your business...",
  className,
  size = 'md'
}: {
  text?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="relative">
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute inset-0 bg-purple-400 blur-xl rounded-full opacity-30"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
          className="relative z-10"
        >
          <BrainCircuit 
            size={size === 'sm' ? 24 : size === 'lg' ? 56 : 40} 
            className="text-purple-600" 
          />
        </motion.div>
      </div>
      <div className="text-center">
        <motion.p
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-sm font-medium text-purple-700"
        >
          {text}
        </motion.p>
        <div className="flex justify-center mt-2 space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -5, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatType: "loop",
                delay: i * 0.2
              }}
              className="w-2 h-2 rounded-full bg-purple-500"
            />
          ))}
        </div>
      </div>
    </div>
  );
}