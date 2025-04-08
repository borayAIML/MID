import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileUpIcon } from "lucide-react";

type DocumentUploadProps = {
  initialData: {
    financialStatements: File | null;
    taxDocuments: File | null;
    contracts: File | null;
  };
  onComplete: (data: {
    financialStatements: File | null;
    taxDocuments: File | null;
    contracts: File | null;
  }) => void;
};

export default function DocumentUpload({ initialData, onComplete }: DocumentUploadProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState({
    financialStatements: initialData.financialStatements,
    taxDocuments: initialData.taxDocuments,
    contracts: initialData.contracts,
  });
  
  const financialInputRef = useRef<HTMLInputElement>(null);
  const taxInputRef = useRef<HTMLInputElement>(null);
  const contractInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: keyof typeof files) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 10MB",
          variant: "destructive",
        });
        return;
      }
      
      // Check file type
      const validTypes = ['application/pdf', 'application/vnd.ms-excel', 
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
        'text/csv', 'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload PDF, Excel, CSV, or Word documents only.",
          variant: "destructive",
        });
        return;
      }
      
      setFiles(prev => ({
        ...prev,
        [fileType]: file
      }));
    }
  };
  
  const handleUploadClick = (inputRef: React.RefObject<HTMLInputElement>) => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, fileType: keyof typeof files) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 10MB",
          variant: "destructive",
        });
        return;
      }
      
      // Check file type
      const validTypes = ['application/pdf', 'application/vnd.ms-excel', 
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
        'text/csv', 'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload PDF, Excel, CSV, or Word documents only.",
          variant: "destructive",
        });
        return;
      }
      
      setFiles(prev => ({
        ...prev,
        [fileType]: file
      }));
    }
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      onComplete(files);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to upload documents.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderFileInfo = (file: File | null) => {
    if (!file) return null;
    
    return (
      <div className="mt-2 text-sm text-gray-700 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Document Upload</h2>
      <p className="text-sm text-gray-600 mb-6">Upload your financial documents for a more accurate valuation. All files are securely encrypted and confidential.</p>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Financial Statements</label>
          <div 
            className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50"
            onClick={() => handleUploadClick(financialInputRef)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "financialStatements")}
          >
            <div className="space-y-1 text-center">
              <FileUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-blue-500">
                  <span>Upload a file</span>
                  <input 
                    ref={financialInputRef}
                    id="file-upload-1" 
                    name="file-upload-1" 
                    type="file" 
                    className="sr-only"
                    onChange={(e) => handleFileChange(e, "financialStatements")}
                    accept=".pdf,.xlsx,.xls,.csv,.doc,.docx"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PDF, Excel up to 10MB</p>
            </div>
          </div>
          {renderFileInfo(files.financialStatements)}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tax Documents</label>
          <div 
            className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50"
            onClick={() => handleUploadClick(taxInputRef)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "taxDocuments")}
          >
            <div className="space-y-1 text-center">
              <FileUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-blue-500">
                  <span>Upload a file</span>
                  <input 
                    ref={taxInputRef}
                    id="file-upload-2" 
                    name="file-upload-2" 
                    type="file" 
                    className="sr-only"
                    onChange={(e) => handleFileChange(e, "taxDocuments")}
                    accept=".pdf,.xlsx,.xls,.csv,.doc,.docx"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PDF, Excel up to 10MB</p>
            </div>
          </div>
          {renderFileInfo(files.taxDocuments)}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contracts (Optional)</label>
          <div 
            className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50"
            onClick={() => handleUploadClick(contractInputRef)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "contracts")}
          >
            <div className="space-y-1 text-center">
              <FileUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-blue-500">
                  <span>Upload a file</span>
                  <input 
                    ref={contractInputRef}
                    id="file-upload-3" 
                    name="file-upload-3" 
                    type="file" 
                    className="sr-only"
                    onChange={(e) => handleFileChange(e, "contracts")}
                    accept=".pdf,.doc,.docx"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PDF up to 10MB</p>
            </div>
          </div>
          {renderFileInfo(files.contracts)}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Next"}
        </Button>
      </div>
    </div>
  );
}
