import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Download, 
  FileDown, 
  FileJson, 
  FileSpreadsheet, 
  FilePieChart, 
  Check, 
  X, 
  ArrowDownToDot 
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

type ExportFormat = 'csv' | 'json' | 'pdf';

interface OneClickExportProps {
  company: Company;
  valuation: Valuation;
  defaultFormat?: ExportFormat;
  allowChangeFormat?: boolean;
  showFileName?: boolean;
  showConfetti?: boolean;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  buttonText?: string;
  onExportStart?: () => void;
  onExportComplete?: (format: ExportFormat) => void;
  onExportError?: (format: ExportFormat, error: any) => void;
}

export function OneClickExport({ 
  company, 
  valuation, 
  defaultFormat = 'pdf',
  allowChangeFormat = true,
  showFileName = true,
  showConfetti = true,
  variant = 'default',
  size = 'default',
  className = '',
  buttonText = 'Export Data',
  onExportStart,
  onExportComplete,
  onExportError
}: OneClickExportProps) {
  const [currentFormat, setCurrentFormat] = useState<ExportFormat>(defaultFormat);
  const [isExporting, setIsExporting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportError, setExportError] = useState(false);
  const [fileName, setFileName] = useState("");
  const [showConfettiAnim, setShowConfettiAnim] = useState(false);
  const { toast } = useToast();

  const formatConfig = {
    csv: {
      icon: <FileSpreadsheet className="h-4 w-4" />,
      label: 'Spreadsheet (CSV)',
      color: 'bg-green-500',
      successMessage: 'CSV spreadsheet exported successfully',
      errorMessage: 'Failed to export CSV spreadsheet',
      extension: '.csv'
    },
    json: {
      icon: <FileJson className="h-4 w-4" />,
      label: 'JSON Data',
      color: 'bg-blue-500',
      successMessage: 'JSON data exported successfully',
      errorMessage: 'Failed to export JSON data',
      extension: '.json'
    },
    pdf: {
      icon: <FilePieChart className="h-4 w-4" />,
      label: 'Valuation Report',
      color: 'bg-purple-500',
      successMessage: 'Valuation report exported successfully',
      errorMessage: 'Failed to export valuation report',
      extension: '.html'
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setIsMenuOpen(false);
      
      if (onExportStart) {
        onExportStart();
      }

      // Generate file name
      const cleanCompanyName = company.name.replace(/\s+/g, '_');
      const fileNameWithExt = `${cleanCompanyName}_valuation${formatConfig[currentFormat].extension}`;
      setFileName(fileNameWithExt);
      
      // Adding a slight delay for animation purposes
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Export based on format
      if (currentFormat === 'csv') {
        exportAsCSV(company, valuation);
      } else if (currentFormat === 'json') {
        exportAsJSON(company, valuation);
      } else if (currentFormat === 'pdf') {
        await exportAsPDF(company, valuation);
      }
      
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
      }, 2000);
      
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
          pieces={50}
          duration={2000}
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
          disabled={isExporting}
          className={`relative overflow-hidden ${className}`}
        >
          {/* Progress animation */}
          {isExporting && (
            <motion.div
              className={`absolute inset-0 ${formatConfig[currentFormat].color} opacity-20`}
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8 }}
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
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <ArrowDownToDot className="h-4 w-4" />
              </motion.div>
            ) : (
              <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                {formatConfig[currentFormat].icon}
              </motion.div>
            )}
            
            {/* Button text */}
            <span>
              {exportSuccess ? 'Exported!' : 
               exportError ? 'Failed' : 
               isExporting ? 'Exporting...' : 
               buttonText}
            </span>
          </motion.div>
        </Button>
        
        {/* Format selector button */}
        {allowChangeFormat && (
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
                  className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                >
                  <div className="py-1">
                    {(Object.entries(formatConfig) as [ExportFormat, typeof formatConfig.csv][]).map(([format, config]) => (
                      <motion.button
                        key={format}
                        onClick={() => handleChangeFormat(format)}
                        className={`flex items-center w-full px-4 py-2 text-sm text-left ${
                          currentFormat === format 
                            ? 'bg-indigo-50 text-indigo-700' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="mr-2">{config.icon}</span>
                        <span>{config.label}</span>
                        {currentFormat === format && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto"
                          >
                            <Check className="h-3 w-3 text-indigo-600" />
                          </motion.div>
                        )}
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
      {showFileName && exportSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mt-2 text-xs text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded-md"
        >
          <span className="flex items-center gap-1">
            <FileDown className="h-3 w-3" />
            {fileName}
          </span>
        </motion.div>
      )}
    </div>
  );
}

/**
 * A simple version that only exports to a single format with minimal UI
 */
export function SimpleOneClickExport({
  company,
  valuation,
  format = 'pdf',
  icon,
  variant = 'ghost',
  size = 'sm',
  className = '',
  buttonText
}: {
  company: Company;
  valuation: Valuation;
  format?: ExportFormat;
  icon?: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  buttonText?: string;
}) {
  const [isExporting, setIsExporting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const formatIcons = {
    csv: <FileSpreadsheet className="h-4 w-4" />,
    json: <FileJson className="h-4 w-4" />,
    pdf: <FilePieChart className="h-4 w-4" />
  };
  
  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      // Adding a slight delay for animation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (format === 'csv') {
        exportAsCSV(company, valuation);
      } else if (format === 'json') {
        exportAsJSON(company, valuation);
      } else if (format === 'pdf') {
        await exportAsPDF(company, valuation);
      }
      
      setIsSuccess(true);
      toast({
        title: "Export Complete",
        description: `Exported valuation data successfully`,
      });
      
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
      className={className}
    >
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
        {isExporting ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <ArrowDownToDot className="h-4 w-4" />
          </motion.div>
        ) : isSuccess ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 10, 0] }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Check className="h-4 w-4 text-green-500" />
          </motion.div>
        ) : (
          icon || formatIcons[format]
        )}
        
        {buttonText || (isSuccess ? 'Exported!' : isExporting ? 'Exporting...' : 'Export')}
      </motion.div>
    </Button>
  );
}

/**
 * Quick export badge that's perfect for placing in tables or lists
 */
export function ExportBadge({
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
  
  const handleExport = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsExporting(true);
      
      // Adding a slight delay for animation
      await new Promise(resolve => setTimeout(resolve, 300));
      
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
      className="inline-block cursor-pointer"
    >
      <Badge 
        variant="outline" 
        className={`
          flex items-center gap-1 hover:bg-indigo-50 
          ${isExporting ? 'bg-indigo-50' : ''} 
          ${isSuccess ? 'bg-green-50 border-green-200' : ''}
        `}
      >
        {isExporting ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          >
            <ArrowDownToDot className="h-3 w-3" />
          </motion.div>
        ) : isSuccess ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <Check className="h-3 w-3 text-green-500" />
          </motion.div>
        ) : (
          <Download className="h-3 w-3" />
        )}
        {label || (isSuccess ? 'Exported!' : formatLabels[format])}
      </Badge>
    </motion.div>
  );
}