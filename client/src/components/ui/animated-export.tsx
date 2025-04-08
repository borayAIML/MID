import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Download, 
  FileJson, 
  FileSpreadsheet, 
  FilePieChart, 
  Check, 
  X, 
  FileDown, 
  ArrowDownToDot,
  Upload,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { exportAsCSV, exportAsJSON, exportAsPDF } from '@/lib/exportUtils';
import { Company, Valuation } from '@shared/schema';
import { ConfettiAnimation } from '@/components/ui/confetti-animation';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { FinancialLoader } from '@/components/ui/financial-loaders';
import { cn } from '@/lib/utils';

type ExportFormat = 'csv' | 'json' | 'pdf';

interface AnimatedExportProps {
  company: Company;
  valuation: Valuation;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  buttonText?: string;
  defaultFormat?: ExportFormat;
  showFormatSelector?: boolean;
  showConfetti?: boolean;
  animationType?: 'simple' | 'detailed';
  glowEffect?: boolean;
  pulsate?: boolean;
  onExportStart?: () => void;
  onExportComplete?: (format: ExportFormat) => void;
  onExportError?: (format: ExportFormat, error: any) => void;
}

export function AnimatedExport({ 
  company, 
  valuation, 
  variant = 'default',
  size = 'default',
  className = '',
  buttonText = 'Export Data',
  defaultFormat = 'pdf',
  showFormatSelector = true,
  showConfetti = true,
  animationType = 'detailed',
  glowEffect = true,
  pulsate = true,
  onExportStart,
  onExportComplete,
  onExportError
}: AnimatedExportProps) {
  const [currentFormat, setCurrentFormat] = useState<ExportFormat>(defaultFormat);
  const [isExporting, setIsExporting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportError, setExportError] = useState(false);
  const [fileName, setFileName] = useState("");
  const [exportProgress, setExportProgress] = useState(0);
  const [showConfettiAnim, setShowConfettiAnim] = useState(false);
  const { toast } = useToast();

  // Format-specific configuration
  const formatConfig = {
    csv: {
      icon: <FileSpreadsheet className="h-4 w-4" />,
      label: 'Spreadsheet (CSV)',
      tooltip: 'Download raw data as a CSV spreadsheet',
      color: 'bg-green-500',
      gradient: 'from-green-400 to-emerald-500',
      successMessage: 'Spreadsheet exported successfully',
      errorMessage: 'Failed to export spreadsheet',
      extension: '.csv',
      loaderType: 'calculator' as const
    },
    json: {
      icon: <FileJson className="h-4 w-4" />,
      label: 'JSON Data',
      tooltip: 'Download structured data in JSON format',
      color: 'bg-blue-500',
      gradient: 'from-blue-400 to-indigo-500',
      successMessage: 'JSON data exported successfully',
      errorMessage: 'Failed to export JSON data',
      extension: '.json',
      loaderType: 'pulse' as const
    },
    pdf: {
      icon: <FilePieChart className="h-4 w-4" />,
      label: 'Valuation Report',
      tooltip: 'Download a formatted valuation report',
      color: 'bg-purple-500',
      gradient: 'from-purple-400 to-indigo-500',
      successMessage: 'Valuation report exported successfully',
      errorMessage: 'Failed to export report',
      extension: '.html',
      loaderType: 'chart' as const
    }
  };

  // Simulated progress for the export process
  useEffect(() => {
    if (isExporting) {
      const interval = setInterval(() => {
        setExportProgress((prev) => {
          const newProgress = prev + (1 + Math.random() * 5);
          return newProgress > 95 ? 95 : newProgress;
        });
      }, 150);
      
      return () => clearInterval(interval);
    } else {
      setExportProgress(0);
    }
  }, [isExporting]);

  const handleExport = async () => {
    try {
      // Start export process
      setIsExporting(true);
      setIsMenuOpen(false);
      setExportProgress(10); // Start with 10% progress
      
      if (onExportStart) {
        onExportStart();
      }

      // Generate file name
      const cleanCompanyName = company.name.replace(/\s+/g, '_');
      const fileNameWithExt = `${cleanCompanyName}_valuation${formatConfig[currentFormat].extension}`;
      setFileName(fileNameWithExt);
      
      // Adding a delay for animation purposes
      await new Promise(resolve => setTimeout(resolve, 500));
      setExportProgress(40); // Progress update
      
      // Export based on format
      if (currentFormat === 'csv') {
        exportAsCSV(company, valuation);
      } else if (currentFormat === 'json') {
        exportAsJSON(company, valuation);
      } else if (currentFormat === 'pdf') {
        await exportAsPDF(company, valuation);
      }
      
      // Complete the progress bar
      setExportProgress(100);
      
      // Handle success
      setExportSuccess(true);
      if (showConfetti) {
        setShowConfettiAnim(true);
      }
      
      toast({
        title: "Export Successful",
        description: formatConfig[currentFormat].successMessage,
        variant: "default",
      });
      
      if (onExportComplete) {
        onExportComplete(currentFormat);
      }
      
      // Reset state after a delay
      setTimeout(() => {
        setExportSuccess(false);
        setIsExporting(false);
      }, 2500);
      
    } catch (error) {
      // Handle error
      setExportError(true);
      setIsExporting(false);
      
      toast({
        title: "Export Failed",
        description: formatConfig[currentFormat].errorMessage,
        variant: "destructive",
      });
      
      if (onExportError) {
        onExportError(currentFormat, error);
      }
      
      // Reset error state after a delay
      setTimeout(() => {
        setExportError(false);
      }, 2000);
      
      console.error('Export error:', error);
    }
  };

  const handleChangeFormat = (format: ExportFormat) => {
    setCurrentFormat(format);
    setIsMenuOpen(false);
  };

  return (
    <div className="relative inline-block">
      {showConfettiAnim && (
        <ConfettiAnimation
          pieces={60}
          duration={3000}
          onComplete={() => setShowConfettiAnim(false)}
          trigger={true}
          colors={['#6366f1', '#8b5cf6', '#3b82f6', '#06b6d4', '#10b981']}
        />
      )}
      
      <motion.div 
        className="inline-flex items-center"
        animate={isExporting ? { scale: 0.98 } : { scale: 1 }}
      >
        <Button
          variant={variant}
          size={size}
          onClick={handleExport}
          disabled={isExporting && exportProgress < 95}
          className={cn(
            "relative overflow-hidden",
            isExporting && glowEffect ? "shadow-lg" : "",
            pulsate && !isExporting ? "hover:animate-pulse" : "",
            className
          )}
        >
          {/* Background animation */}
          {isExporting && (
            <motion.div
              className={`absolute inset-0 bg-gradient-to-r ${formatConfig[currentFormat].gradient} opacity-20`}
              initial={{ width: 0 }}
              animate={{ width: `${exportProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          )}
          
          {/* Glow effect for exporting state */}
          {isExporting && glowEffect && (
            <motion.div
              className="absolute inset-0 -z-10 rounded-md"
              initial={{ boxShadow: "0 0 0 rgba(139, 92, 246, 0)" }}
              animate={{ 
                boxShadow: [
                  "0 0 10px rgba(139, 92, 246, 0.3)",
                  "0 0 20px rgba(139, 92, 246, 0.5)",
                  "0 0 10px rgba(139, 92, 246, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          
          {/* Button content with animations */}
          <motion.div 
            className="flex items-center gap-2 z-10 relative"
            animate={{ 
              x: isExporting ? [-1, 1, -1, 1, 0] : 0,
              scale: exportSuccess ? [1, 1.1, 1] : 1
            }}
            transition={{ 
              duration: isExporting ? 0.3 : 0.2, 
              repeat: isExporting ? 2 : 0
            }}
          >
            {/* Icon with animations */}
            {exportSuccess ? (
              <motion.div
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: [0, 10, 0] }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Check className="h-4 w-4 text-green-500" />
              </motion.div>
            ) : exportError ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, -10, 0, 10, 0] }}
                transition={{ duration: 0.4 }}
              >
                <X className="h-4 w-4 text-red-500" />
              </motion.div>
            ) : isExporting ? (
              animationType === 'simple' ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <ArrowDownToDot className="h-4 w-4" />
                </motion.div>
              ) : (
                <div className="h-4 w-4 mr-0">
                  <FinancialLoader 
                    size="sm" 
                    loaderType={formatConfig[currentFormat].loaderType} 
                  />
                </div>
              )
            ) : (
              <motion.div 
                whileHover={{ y: -2 }} 
                transition={{ type: "spring", stiffness: 300 }}
              >
                {formatConfig[currentFormat].icon}
              </motion.div>
            )}
            
            {/* Button text */}
            <span>
              {exportSuccess ? 'Exported!' : 
              exportError ? 'Failed' : 
              isExporting ? (
                <motion.span
                  className="inline-block"
                  animate={{ opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {exportProgress < 30 ? 'Preparing...' : 
                   exportProgress < 70 ? 'Generating...' : 
                   'Exporting...'}
                </motion.span>
              ) : buttonText}
            </span>
            
            {/* Progress indicator */}
            {isExporting && animationType === 'detailed' && (
              <motion.span 
                className="ml-1 text-xs font-mono"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {Math.floor(exportProgress)}%
              </motion.span>
            )}
          </motion.div>
        </Button>
        
        {/* Format selector button */}
        {showFormatSelector && (
          <div className="relative ml-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    disabled={isExporting}
                  >
                    <motion.div
                      animate={{ rotate: isMenuOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Download className="h-4 w-4" />
                    </motion.div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Change export format</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Format dropdown menu */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  transition={{ duration: 0.2, type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute right-0 mt-2 w-52 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
                >
                  <div className="py-1">
                    {(Object.entries(formatConfig) as [ExportFormat, typeof formatConfig.csv][]).map(([format, config]) => (
                      <motion.button
                        key={format}
                        onClick={() => handleChangeFormat(format)}
                        className={`flex items-center w-full px-4 py-2 text-sm text-left
                          ${currentFormat === format 
                            ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          }`}
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="mr-2">{config.icon}</span>
                        <span>{config.label}</span>
                        {currentFormat === format ? (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto"
                          >
                            <Check className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                          </motion.div>
                        ) : null}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
      
      {/* File name indicator */}
      {exportSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mt-2 text-xs text-gray-600 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md"
        >
          <span className="flex items-center gap-1">
            <motion.div
              animate={{ scale: [1, 1.1, 1], y: [0, -1, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              <Sparkles className="h-3 w-3 text-amber-500" />
            </motion.div>
            {fileName}
          </span>
        </motion.div>
      )}
    </div>
  );
}

/**
 * Minimal version of the animated export button for use in cards, tables, or smaller UI elements
 */
export function CompactAnimatedExport({
  company,
  valuation,
  format = 'pdf',
  variant = 'ghost',
  size = 'sm',
  className = '',
  buttonText = 'Export',
  showIcon = true,
  pulsate = true,
  onExportComplete
}: {
  company: Company;
  valuation: Valuation;
  format?: ExportFormat;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  buttonText?: string;
  showIcon?: boolean;
  pulsate?: boolean;
  onExportComplete?: (format: ExportFormat) => void;
}) {
  const [isExporting, setIsExporting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const { toast } = useToast();

  const formatIcons = {
    csv: <FileSpreadsheet className="h-4 w-4" />,
    json: <FileJson className="h-4 w-4" />,
    pdf: <FilePieChart className="h-4 w-4" />
  };

  const colors = {
    csv: "text-emerald-500 dark:text-emerald-400",
    json: "text-blue-500 dark:text-blue-400",
    pdf: "text-purple-500 dark:text-purple-400"
  };
  
  useEffect(() => {
    if (isExporting) {
      const interval = setInterval(() => {
        setProgressValue(prev => {
          const next = prev + (2 + Math.random() * 6);
          return next > 95 ? 95 : next;
        });
      }, 100);
      return () => clearInterval(interval);
    } else {
      setProgressValue(0);
    }
  }, [isExporting]);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setProgressValue(10);
      
      // Adding a slight delay for animation
      await new Promise(resolve => setTimeout(resolve, 300));
      setProgressValue(40);
      
      if (format === 'csv') {
        exportAsCSV(company, valuation);
      } else if (format === 'json') {
        exportAsJSON(company, valuation);
      } else if (format === 'pdf') {
        await exportAsPDF(company, valuation);
      }
      
      setProgressValue(100);
      setIsSuccess(true);
      
      toast({
        title: "Export Complete",
        description: `Exported as ${format.toUpperCase()} successfully`,
      });
      
      if (onExportComplete) {
        onExportComplete(format);
      }
      
      setTimeout(() => {
        setIsSuccess(false);
        setIsExporting(false);
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Export Failed",
        description: `Could not export data`,
        variant: "destructive",
      });
      setIsExporting(false);
      console.error('Export error:', error);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleExport}
      disabled={isExporting}
      className={cn(
        "relative overflow-hidden",
        pulsate && !isExporting ? "hover:animate-pulse" : "",
        className
      )}
    >
      {/* Progress animation */}
      {isExporting && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-20"
          initial={{ width: 0 }}
          animate={{ width: `${progressValue}%` }}
          transition={{ duration: 0.2 }}
        />
      )}
      
      <motion.div 
        className="flex items-center gap-2"
        animate={
          isExporting 
            ? { scale: 0.95 } 
            : isSuccess 
            ? { scale: [1, 1.2, 1] } 
            : { scale: 1 }
        }
        transition={{ duration: 0.3 }}
      >
        {showIcon && (
          isExporting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className={colors[format]}
            >
              <ArrowDownToDot className="h-4 w-4" />
            </motion.div>
          ) : isSuccess ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, 0] }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-green-500"
            >
              <Check className="h-4 w-4" />
            </motion.div>
          ) : (
            <motion.div 
              whileHover={{ y: -2 }} 
              className={colors[format]}
            >
              {formatIcons[format]}
            </motion.div>
          )
        )}
        
        {buttonText && (
          <span>
            {isSuccess ? 'Done!' : isExporting ? 
              <motion.span
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                Exporting...
              </motion.span> : buttonText}
          </span>
        )}
      </motion.div>
    </Button>
  );
}

/**
 * Export badge for inline use in tables, cards, or lists
 */
export function AnimatedExportBadge({
  company,
  valuation,
  format = 'pdf',
  label
}: {
  company: Company;
  valuation: Valuation;
  format?: ExportFormat;
  label?: string;
}) {
  const [isExporting, setIsExporting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  
  const formatLabels = {
    csv: 'CSV',
    json: 'JSON',
    pdf: 'Report'
  };
  
  const formatIcons = {
    csv: <FileSpreadsheet className="h-3 w-3" />,
    json: <FileJson className="h-3 w-3" />,
    pdf: <FilePieChart className="h-3 w-3" />
  };
  
  const formatColors = {
    csv: 'group-hover:bg-green-100 dark:group-hover:bg-green-900/20 group-hover:text-green-700 dark:group-hover:text-green-300 group-hover:border-green-300',
    json: 'group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20 group-hover:text-blue-700 dark:group-hover:text-blue-300 group-hover:border-blue-300',
    pdf: 'group-hover:bg-purple-100 dark:group-hover:bg-purple-900/20 group-hover:text-purple-700 dark:group-hover:text-purple-300 group-hover:border-purple-300'
  };
  
  const handleExport = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsExporting(true);
      
      // Adding a slight delay for animation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (format === 'csv') {
        exportAsCSV(company, valuation);
      } else if (format === 'json') {
        exportAsJSON(company, valuation);
      } else if (format === 'pdf') {
        await exportAsPDF(company, valuation);
      }
      
      setIsSuccess(true);
      
      setTimeout(() => {
        setIsSuccess(false);
        setIsExporting(false);
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Export Failed",
        description: `Could not export ${formatLabels[format]}`,
        variant: "destructive",
      });
      setIsExporting(false);
      console.error('Export error:', error);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleExport}
      className="inline-block cursor-pointer group"
    >
      <Badge 
        variant="outline" 
        className={`
          flex items-center gap-1 bg-white dark:bg-gray-800
          transition-all duration-300 ease-in-out
          ${formatColors[format]}
          ${isExporting ? 'opacity-70' : ''}
        `}
      >
        {isExporting ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <ArrowDownToDot className="h-3 w-3" />
          </motion.div>
        ) : isSuccess ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Check className="h-3 w-3 text-green-500" />
          </motion.div>
        ) : (
          formatIcons[format]
        )}
        
        <span className="text-xs">
          {isSuccess ? 'Downloaded' : isExporting ? 'Exporting...' : label || formatLabels[format]}
        </span>
      </Badge>
    </motion.div>
  );
}