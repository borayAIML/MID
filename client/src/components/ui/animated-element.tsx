import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedElementProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'card' | 'input';
  delay?: number;
}

export function AnimatedElement({ 
  children,
  className,
  onClick,
  type = 'button',
  delay = 0
}: AnimatedElementProps) {
  // Different animation configurations based on element type
  const animations = {
    button: {
      initial: { scale: 1 },
      animate: {} as any,
      whileHover: { scale: 1.05, transition: { duration: 0.2 } },
      whileTap: { scale: 0.95, transition: { duration: 0.1 } },
      transition: { type: 'spring', stiffness: 400, damping: 17 }
    },
    card: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      whileHover: { 
        y: -5, 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        transition: { duration: 0.2 }
      },
      transition: { duration: 0.4, delay }
    },
    input: {
      initial: { borderColor: 'rgba(226, 232, 240, 1)' },
      animate: { opacity: 1, scale: 1 },
      whileHover: {} as any,
      whileTap: {} as any,
      whileFocus: { 
        borderColor: 'rgba(79, 70, 229, 1)',
        boxShadow: '0 0 0 2px rgba(79, 70, 229, 0.2)',
        transition: { duration: 0.2 }
      },
      transition: { duration: 0.3, delay }
    }
  };

  const selectedAnimation = animations[type];

  // Based on the type, we need to conditionally render different props
  if (type === 'button') {
    return (
      <motion.div
        className={cn('', className)}
        onClick={onClick}
        initial={selectedAnimation.initial}
        animate={selectedAnimation.animate}
        whileHover={selectedAnimation.whileHover}
        whileTap={selectedAnimation.whileTap}
        transition={selectedAnimation.transition}
      >
        {children}
      </motion.div>
    );
  } else if (type === 'input') {
    return (
      <motion.div
        className={cn('', className)}
        onClick={onClick}
        initial={selectedAnimation.initial}
        animate={selectedAnimation.animate}
        whileFocus={selectedAnimation.whileFocus}
        transition={selectedAnimation.transition}
      >
        {children}
      </motion.div>
    );
  } else {
    // Default 'card' type
    return (
      <motion.div
        className={cn('', className)}
        onClick={onClick}
        initial={selectedAnimation.initial}
        animate={selectedAnimation.animate}
        whileHover={selectedAnimation.whileHover}
        transition={selectedAnimation.transition}
      >
        {children}
      </motion.div>
    );
  }
}

// Specific animations for different element types
export function AnimatedButton({ 
  children, 
  className, 
  onClick,
  delay = 0,
  ...props
}: AnimatedElementProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <motion.button
      className={className}
      onClick={onClick}
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17, delay }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function AnimatedCard({ 
  children, 
  className, 
  onClick,
  delay = 0
}: AnimatedElementProps) {
  return (
    <motion.div
      className={cn('rounded-lg overflow-hidden', className)}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -5, 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedInput({ 
  className, 
  delay = 0,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { delay?: number }) {
  return (
    <motion.input
      className={className}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      whileFocus={{ 
        borderColor: 'rgba(79, 70, 229, 1)',
        boxShadow: '0 0 0 2px rgba(79, 70, 229, 0.2)'
      }}
      transition={{ duration: 0.3, delay }}
      {...props}
    />
  );
}

export function AnimatedText({ 
  children, 
  className,
  delay = 0,
  staggerChildren = 0.03,
  type = 'heading',
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  staggerChildren?: number;
  type?: 'heading' | 'paragraph';
} & React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement>) {
  // If children is not a string, just animate the whole element
  if (typeof children !== 'string') {
    const simpleAnimation = {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0, 
        transition: {
          type: "spring",
          damping: 12,
          stiffness: 200,
          delay
        }
      }
    };
    
    if (type === 'heading') {
      return (
        <motion.h2
          className={className}
          variants={simpleAnimation}
          initial="hidden"
          animate="visible"
          {...props}
        >
          {children}
        </motion.h2>
      );
    }
    
    return (
      <motion.p
        className={className}
        variants={simpleAnimation}
        initial="hidden"
        animate="visible"
        {...props}
      >
        {children}
      </motion.p>
    );
  }
  
  // For string children, animate each letter
  const letters = Array.from(children);
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren, delayChildren: delay * i }
    })
  };
  
  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    }
  };

  if (type === 'heading') {
    return (
      <motion.h2
        className={className}
        variants={container}
        initial="hidden"
        animate="visible"
        {...props}
      >
        {letters.map((letter, index) => (
          <motion.span key={index} variants={child}>
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </motion.h2>
    );
  }
  
  return (
    <motion.p
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {letters.map((letter, index) => (
        <motion.span key={index} variants={child}>
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.p>
  );
}

export function AnimatedList({ 
  children, 
  className,
  staggerDelay = 0.1,
  ...props
}: {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
} & React.HTMLAttributes<HTMLUListElement>) {
  return (
    <motion.ul
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          opacity: 1,
          transition: {
            when: "beforeChildren",
            staggerChildren: staggerDelay
          }
        },
        hidden: {
          opacity: 0,
          transition: {
            when: "afterChildren"
          }
        }
      }}
      {...props}
    >
      {React.Children.map(children, (child, i) => (
        <motion.li
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 20 }
          }}
        >
          {child}
        </motion.li>
      ))}
    </motion.ul>
  );
}

// Animated Badge that draws attention
export function AnimatedBadge({
  children,
  className,
  pulse = false,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  pulse?: boolean;
} & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <motion.span
      className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", className)}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: pulse ? [1, 1.1, 1] : 1, 
        opacity: 1 
      }}
      transition={{
        duration: 0.5,
        repeat: pulse ? Infinity : 0,
        repeatType: "reverse",
        repeatDelay: 2
      }}
      {...props}
    >
      {children}
    </motion.span>
  );
}

// Value Counter that animates numbers changing
export function AnimatedCounter({
  value,
  duration = 1,
  className,
  formatter = (val: number) => val.toString(),
  ...props
}: {
  value: number;
  duration?: number;
  className?: string;
  formatter?: (val: number) => string;
} & React.HTMLAttributes<HTMLSpanElement>) {
  const nodeRef = React.useRef<HTMLSpanElement>(null);
  
  React.useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    
    let startValue = 0;
    const endValue = value;
    const range = endValue - startValue;
    const startTime = performance.now();
    const endTime = startTime + duration * 1000;
    
    const updateValue = (timestamp: number) => {
      if (!node) return;
      
      const currentTime = Math.min(timestamp, endTime);
      const elapsed = currentTime - startTime;
      const progress = elapsed / (duration * 1000);
      const currentValue = Math.floor(startValue + (progress * range));
      
      node.textContent = formatter(currentValue);
      
      if (currentTime < endTime) {
        requestAnimationFrame(updateValue);
      } else {
        node.textContent = formatter(endValue);
      }
    };
    
    requestAnimationFrame(updateValue);
  }, [value, duration, formatter]);
  
  return <span ref={nodeRef} className={className} {...props}>{formatter(0)}</span>;
}

// Reveal text on scroll
export function RevealOnScroll({
  children,
  className,
  direction = 'up',
  delay = 0,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
} & React.HTMLAttributes<HTMLDivElement>) {
  const directionMap = {
    up: { y: 50, x: 0 },
    down: { y: -50, x: 0 },
    left: { x: 50, y: 0 },
    right: { x: -50, y: 0 }
  };
  
  return (
    <motion.div
      className={className}
      initial={{ 
        opacity: 0, 
        y: directionMap[direction].y, 
        x: directionMap[direction].x 
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        x: 0,
        transition: {
          duration: 0.7,
          delay
        }
      }}
      viewport={{ once: true, margin: "-100px" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}