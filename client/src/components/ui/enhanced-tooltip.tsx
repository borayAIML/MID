import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Info, 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Briefcase, 
  AlertTriangle, 
  Settings, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type TooltipTheme = 
  | 'financial' 
  | 'operations' 
  | 'valuation' 
  | 'document' 
  | 'strategy' 
  | 'risk' 
  | 'info' 
  | 'warning';

interface EnhancedTooltipProps {
  title: string;
  content: string;
  theme?: TooltipTheme;
  position?: 'top' | 'right' | 'bottom' | 'left';
  width?: 'narrow' | 'medium' | 'wide';
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean; // Whether tooltip has interactive elements
  illustration?: string; // URL to illustration
}

type ThemeConfig = {
  icon: React.ElementType;
  bgColor: string;
  textColor: string;
  borderColor: string;
  illustration?: string; // Default illustration for this theme
};

export function EnhancedTooltip({
  title,
  content,
  theme = 'info',
  position = 'top',
  width = 'medium',
  children,
  className,
  interactive = false,
  illustration
}: EnhancedTooltipProps) {
  const [open, setOpen] = useState(false);
  
  // Theme configurations
  const themes: Record<TooltipTheme, ThemeConfig> = {
    financial: {
      icon: DollarSign,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-800',
      borderColor: 'border-emerald-200',
      illustration: '/assets/illustrations/financial.svg'
    },
    operations: {
      icon: Settings,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-200',
      illustration: '/assets/illustrations/operations.svg'
    },
    valuation: {
      icon: TrendingUp,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-800',
      borderColor: 'border-purple-200',
      illustration: '/assets/illustrations/valuation.svg'
    },
    document: {
      icon: FileText,
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-800',
      borderColor: 'border-gray-200',
      illustration: '/assets/illustrations/document.svg'
    },
    strategy: {
      icon: Briefcase,
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-800',
      borderColor: 'border-indigo-200',
      illustration: '/assets/illustrations/strategy.svg'
    },
    risk: {
      icon: AlertTriangle,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-800',
      borderColor: 'border-amber-200',
      illustration: '/assets/illustrations/risk.svg'
    },
    info: {
      icon: Info,
      bgColor: 'bg-sky-50',
      textColor: 'text-sky-800',
      borderColor: 'border-sky-200',
      illustration: '/assets/illustrations/info.svg'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
      borderColor: 'border-red-200',
      illustration: '/assets/illustrations/warning.svg'
    }
  };
  
  const ThemeIcon = themes[theme].icon;
  const finalIllustration = illustration || themes[theme].illustration;
  
  // Width classes
  const widthClasses = {
    narrow: 'max-w-xs',
    medium: 'max-w-sm',
    wide: 'max-w-md'
  };
  
  // Interactive tooltips need different behavior - they stay open on click
  if (interactive) {
    return (
      <div className={cn("relative inline-block", className)}>
        <button 
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={() => setOpen(!open)}
          aria-label={title}
        >
          {children || <HelpCircle className="h-4 w-4" />}
        </button>
        
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "absolute z-50 mt-2",
                position === 'top' && "bottom-full mb-2",
                position === 'right' && "left-full ml-2",
                position === 'bottom' && "top-full mt-2",
                position === 'left' && "right-full mr-2",
                widthClasses[width],
                themes[theme].bgColor,
                themes[theme].borderColor,
                "rounded-lg shadow-lg border p-3"
              )}
            >
              <div className="flex items-start gap-2">
                <div className={cn("p-1.5 rounded-full mt-0.5", themes[theme].bgColor)}>
                  <ThemeIcon className={cn("h-4 w-4", themes[theme].textColor)} />
                </div>
                <div>
                  <h4 className={cn("font-medium", themes[theme].textColor)}>
                    {title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">{content}</p>
                  
                  {finalIllustration && (
                    <div className="mt-2 rounded-md overflow-hidden">
                      <img 
                        src={finalIllustration} 
                        alt={title} 
                        className="w-full h-auto max-h-32 object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="mt-2 flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => setOpen(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Triangle/pointer */}
              <div 
                className={cn(
                  "absolute w-2 h-2 transform rotate-45",
                  themes[theme].bgColor,
                  themes[theme].borderColor,
                  position === 'top' && "top-full -translate-y-1 left-1/2 -translate-x-1/2 border-r border-b",
                  position === 'right' && "right-full translate-x-1 top-1/2 -translate-y-1/2 border-l border-t",
                  position === 'bottom' && "bottom-full translate-y-1 left-1/2 -translate-x-1/2 border-l border-t",
                  position === 'left' && "left-full -translate-x-1 top-1/2 -translate-y-1/2 border-r border-b"
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
  
  // For non-interactive tooltips, use the standard Tooltip component
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <span className={className}>
            {children || (
              <HelpCircle className="h-4 w-4 text-gray-500 hover:text-gray-700 cursor-help" />
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent 
          side={position}
          className={cn(
            "p-0 border-0 shadow-lg",
            widthClasses[width]
          )}
          sideOffset={5}
        >
          <div className={cn(
            "rounded-lg overflow-hidden",
            themes[theme].bgColor,
            themes[theme].borderColor,
            "border"
          )}>
            <div className="p-3">
              <div className="flex items-start gap-2">
                <div className={cn("p-1.5 rounded-full mt-0.5", themes[theme].bgColor)}>
                  <ThemeIcon className={cn("h-4 w-4", themes[theme].textColor)} />
                </div>
                <div>
                  <h4 className={cn("font-medium", themes[theme].textColor)}>
                    {title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">{content}</p>
                  
                  {finalIllustration && (
                    <div className="mt-2 rounded-md overflow-hidden">
                      <img 
                        src={finalIllustration} 
                        alt={title} 
                        className="w-full h-auto max-h-32 object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}