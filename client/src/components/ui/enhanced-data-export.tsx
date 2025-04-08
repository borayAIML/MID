import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, FileJson, FileSpreadsheet, FilePieChart, Check, X, FileDown, ArrowDownToDot } from 'lucide-react';
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

type ExportFormat = 'csv' | 'json' | 'pdf';

interface EnhancedDataExportProps {
  company: Company;
  valuation: Valuation;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  showLabel?: boolean;
  quickExport?: ExportFormat; // Format to use for one-click export
  onExportStart?: () => void;
  onExportComplete?: (format: ExportFormat) => void;
  onExportError?: (format: ExportFormat, error: any) => void;
}

export function EnhancedDataExport({ 
  company, 
  valuation, 
  variant = 'default',
  size = 'default',
  className,
  showLabel = true,
  quickExport = 'pdf', // Default one-click export is PDF
  onExportStart,
  onExportComplete,
  onExportError
}: EnhancedDataExportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<ExportFormat | null>(null);
  const [exportError, setExportError] = useState<ExportFormat | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();

  const exportFormats = {
    csv: {
      label: 'CSV',
      icon: <FileSpreadsheet className="mr-2 h-4 w-4" />,
      tooltip: 'Download as spreadsheet (CSV)',
      successMessage: 'CSV export complete!',
      errorMessage: 'CSV export failed'
    },
    json: {
      label: 'JSON',
      icon: <FileJson className="mr-2 h-4 w-4" />,
      tooltip: 'Download as structured data (JSON)',
      successMessage: 'JSON export complete!',
      errorMessage: 'JSON export failed'
    },
    pdf: {
      label: 'Report',
      icon: <FilePieChart className="mr-2 h-4 w-4" />,
      tooltip: 'Download as formatted report',
      successMessage: 'Report export complete!',
      errorMessage: 'Report export failed'
    }
  };

  const handleExport = async (format: ExportFormat) => {
    try {
      setIsExporting(true);
      if (onExportStart) onExportStart();
      
      // Add a slight delay before actual export to allow for animation
      await new Promise(resolve => setTimeout(resolve, 300));

      if (format === 'csv') {
        exportAsCSV(company, valuation);
      } else if (format === 'json') {
        exportAsJSON(company, valuation);
      } else if (format === 'pdf') {
        await exportAsPDF(company, valuation);
      }
      
      // Show success animation
      setExportSuccess(format);
      setShowConfetti(true);
      
      toast({
        title: "Export successful",
        description: exportFormats[format].successMessage,
        variant: "default",
      });
      
      if (onExportComplete) onExportComplete(format);
      
      // Close the menu after a short delay
      setTimeout(() => {
        setIsOpen(false);
        setExportSuccess(null);
        setIsExporting(false);
      }, 1000);
    } catch (error) {
      // Show error animation
      setExportError(format);
      setIsExporting(false);
      
      toast({
        title: "Export failed",
        description: exportFormats[format].errorMessage,
        variant: "destructive",
      });
      
      if (onExportError) onExportError(format, error);
      
      setTimeout(() => setExportError(null), 2000);
      console.error('Export error:', error);
    }
  };

  // Quick export function when clicking the main button
  const handleQuickExport = (e: React.MouseEvent) => {
    // If pressing shift or alt, open the menu instead of doing quick export
    if (e.shiftKey || e.altKey) {
      setIsOpen(!isOpen);
      return;
    }
    
    handleExport(quickExport);
  };

  return (
    <div className="relative">
      {showConfetti && (
        <ConfettiAnimation 
          trigger={true} 
          pieces={40} 
          duration={1500} 
          onComplete={() => setShowConfetti(false)} 
        />
      )}
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={variant}
              size={size}
              className={`${className} relative overflow-hidden`}
              onClick={handleQuickExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <motion.div 
                  className="absolute inset-0 bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8 }}
                />
              ) : null}
              
              <motion.div 
                className="flex items-center justify-center relative z-10"
                animate={{ scale: isExporting ? 0.9 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {exportSuccess ? (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    <Check className="mr-2 h-4 w-4" />
                  </motion.div>
                ) : exportError ? (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    <X className="mr-2 h-4 w-4" />
                  </motion.div>
                ) : isExporting ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="mr-2 h-4 w-4"
                  >
                    <ArrowDownToDot className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <motion.div 
                    whileHover={{ y: [0, -2, 0, -2, 0] }}
                    transition={{ duration: 0.5 }}
                    className="mr-2 h-4 w-4"
                  >
                    <FileDown className="h-4 w-4" />
                  </motion.div>
                )}
                {showLabel && (
                  <span>
                    {isExporting ? 'Exporting...' : exportSuccess ? 'Downloaded!' : 'Export Data'}
                  </span>
                )}
              </motion.div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to export as {exportFormats[quickExport].label}. Hold Shift and click to see more options.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 500, damping: 30 }}
            className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 overflow-hidden"
          >
            <div className="py-1 divide-y divide-gray-100">
              {Object.entries(exportFormats).map(([format, details]) => (
                <TooltipProvider key={format}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.button
                        whileHover={{ 
                          backgroundColor: 'rgba(0, 0, 0, 0.05)',
                          x: 2 
                        }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleExport(format as ExportFormat)}
                        className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700"
                        disabled={isExporting}
                      >
                        {details.icon}
                        Export as {details.label}
                        {exportSuccess === format && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: [0, 15, 0] }}
                            transition={{ duration: 0.4, type: "spring" }}
                            className="ml-auto"
                          >
                            <Check className="h-4 w-4 text-green-500" />
                          </motion.div>
                        )}
                        {exportError === format && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: [0, 5, -5, 5, 0] }}
                            transition={{ duration: 0.5 }}
                            className="ml-auto"
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </motion.div>
                        )}
                        {isExporting && format === quickExport && (
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="ml-auto h-4 w-4"
                          >
                            <ArrowDownToDot className="h-4 w-4 text-blue-500" />
                          </motion.div>
                        )}
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{details.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}