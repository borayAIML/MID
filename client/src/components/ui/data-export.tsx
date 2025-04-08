import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, FileJson, FileSpreadsheet, FilePieChart, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { exportAsCSV, exportAsJSON, exportAsPDF } from '@/lib/exportUtils';
import { Company, Valuation } from '@shared/schema';

type ExportFormat = 'csv' | 'json' | 'pdf';

interface DataExportProps {
  company: Company;
  valuation: Valuation;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function DataExport({ 
  company, 
  valuation, 
  variant = 'default',
  size = 'default',
  className 
}: DataExportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<ExportFormat | null>(null);
  const [exportError, setExportError] = useState<ExportFormat | null>(null);

  const handleExport = (format: ExportFormat) => {
    try {
      if (format === 'csv') {
        exportAsCSV(company, valuation);
      } else if (format === 'json') {
        exportAsJSON(company, valuation);
      } else if (format === 'pdf') {
        exportAsPDF(company, valuation);
      }
      
      // Show success animation
      setExportSuccess(format);
      setTimeout(() => setExportSuccess(null), 2000);
      
      // Close the menu after a short delay
      setTimeout(() => setIsOpen(false), 600);
    } catch (error) {
      // Show error animation
      setExportError(format);
      setTimeout(() => setExportError(null), 2000);
      console.error('Export error:', error);
    }
  };

  return (
    <div className="relative">
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Download className="mr-2 h-4 w-4" /> Export Data
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
          >
            <div className="py-1 divide-y divide-gray-100">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleExport('csv')}
                      className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700"
                    >
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Export as CSV
                      {exportSuccess === 'csv' && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto"
                        >
                          <Check className="h-4 w-4 text-green-500" />
                        </motion.div>
                      )}
                      {exportError === 'csv' && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto"
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </motion.div>
                      )}
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download as spreadsheet (CSV)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleExport('json')}
                      className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700"
                    >
                      <FileJson className="mr-2 h-4 w-4" />
                      Export as JSON
                      {exportSuccess === 'json' && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto"
                        >
                          <Check className="h-4 w-4 text-green-500" />
                        </motion.div>
                      )}
                      {exportError === 'json' && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto"
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </motion.div>
                      )}
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download as structured data (JSON)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleExport('pdf')}
                      className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700"
                    >
                      <FilePieChart className="mr-2 h-4 w-4" />
                      Export as Report
                      {exportSuccess === 'pdf' && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto"
                        >
                          <Check className="h-4 w-4 text-green-500" />
                        </motion.div>
                      )}
                      {exportError === 'pdf' && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto"
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </motion.div>
                      )}
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download as formatted report</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}