import { apiRequest } from './queryClient';

// Types for document analysis
export type DocumentType = 'financial' | 'tax' | 'contract';

export interface DocumentValidationResult {
  isValid: boolean;
  issues: DocumentIssue[];
  score: number; // 0-100 validation score
  summary: string;
}

export interface DocumentIssue {
  severity: 'critical' | 'warning' | 'info';
  description: string;
  location?: string; // e.g., "page 5", "balance sheet", etc.
  recommendation?: string;
}

export interface FinancialDocumentMetrics {
  revenueGrowth?: {
    oneYear?: number;
    threeYear?: number;
    fiveYear?: number;
  };
  profitMargins?: {
    gross?: number;
    operating?: number;
    net?: number;
  };
  liquidityRatios?: {
    current?: number;
    quick?: number;
  };
  debtRatios?: {
    debtToEquity?: number;
    interestCoverage?: number;
  };
  workingCapital?: number;
  cashFlow?: {
    operating?: number;
    investing?: number;
    financing?: number;
    free?: number;
  };
}

export interface TaxDocumentMetrics {
  effectiveTaxRate?: number;
  totalTaxLiability?: number;
  taxCredits?: number;
  deductions?: number;
  complianceScore?: number; // 0-100
}

export interface ContractDocumentMetrics {
  riskExposure?: number; // 0-100
  favorability?: number; // negative values are unfavorable, positive are favorable
  termLength?: number; // in months
  renewalType?: 'automatic' | 'manual' | 'none';
  terminationRights?: 'balanced' | 'favorable' | 'unfavorable';
}

export interface DocumentAnalysisResult {
  documentId: number;
  documentType: DocumentType;
  validation: DocumentValidationResult;
  metrics: FinancialDocumentMetrics | TaxDocumentMetrics | ContractDocumentMetrics;
  valuationImpact: {
    description: string;
    impact: number; // -10 to +10 scale
  };
}

/**
 * Uploads and analyzes a document
 */
export async function uploadAndAnalyzeDocument(
  file: File,
  companyId: number,
  documentType: DocumentType
): Promise<{ documentId: number; fileName: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('companyId', companyId.toString());
  formData.append('type', documentType);
  
  const response = await apiRequest('/api/documents', {
    method: 'POST',
    body: formData,
    headers: {
      // Don't set Content-Type for multipart/form-data
      // The browser will set it automatically with boundary
    },
  });
  
  return {
    documentId: response.id,
    fileName: response.fileName
  };
}

/**
 * Analyzes a previously uploaded document
 */
export async function analyzeDocument(
  documentId: number,
  documentType: DocumentType
): Promise<DocumentAnalysisResult> {
  // This would call our AI-powered document analysis endpoint
  // For now we'll create a mock implementation
  
  // In a real implementation, this would call:
  // return await apiRequest(`/api/ai/analyze-document/${documentId}`, {
  //   method: 'GET'
  // });
  
  // For now, we'll return mocked data
  const mockResponses: Record<DocumentType, DocumentAnalysisResult> = {
    financial: {
      documentId,
      documentType: 'financial',
      validation: {
        isValid: true,
        issues: [
          {
            severity: 'warning',
            description: 'Inconsistent revenue recognition method between years',
            location: 'Income Statement, p.3',
            recommendation: 'Standardize revenue recognition method across reporting periods'
          },
          {
            severity: 'info',
            description: 'Missing footnotes for depreciation methods',
            location: 'Notes, p.12',
            recommendation: 'Add detailed explanation of depreciation calculations'
          }
        ],
        score: 85,
        summary: 'Overall good quality financial statements with minor issues that should be addressed.'
      },
      metrics: {
        revenueGrowth: {
          oneYear: 12.5,
          threeYear: 32.1,
          fiveYear: 67.8
        },
        profitMargins: {
          gross: 42.3,
          operating: 18.7,
          net: 11.2
        },
        liquidityRatios: {
          current: 2.1,
          quick: 1.5
        },
        debtRatios: {
          debtToEquity: 0.68,
          interestCoverage: 5.2
        },
        workingCapital: 850000,
        cashFlow: {
          operating: 1200000,
          investing: -500000,
          financing: -300000,
          free: 700000
        }
      },
      valuationImpact: {
        description: 'Strong financial performance with steady growth provides positive impact on valuation',
        impact: 7.5
      }
    },
    tax: {
      documentId,
      documentType: 'tax',
      validation: {
        isValid: true,
        issues: [
          {
            severity: 'critical',
            description: 'Incomplete documentation for R&D tax credits claimed',
            location: 'Form XYZ, Section 5',
            recommendation: 'Provide detailed supporting documentation for all R&D activities'
          }
        ],
        score: 72,
        summary: 'Tax documents have some compliance issues that should be addressed before any transaction.'
      },
      metrics: {
        effectiveTaxRate: 21.3,
        totalTaxLiability: 420000,
        taxCredits: 85000,
        deductions: 750000,
        complianceScore: 78
      },
      valuationImpact: {
        description: 'Some tax compliance issues present moderate risk and could impact valuation',
        impact: -2.5
      }
    },
    contract: {
      documentId,
      documentType: 'contract',
      validation: {
        isValid: true,
        issues: [
          {
            severity: 'warning',
            description: 'Automatic renewal clause with lengthy notice period',
            location: 'Section 8.3, p.11',
            recommendation: 'Negotiate shorter notice period or manual renewal process'
          },
          {
            severity: 'warning',
            description: 'Broad liability clauses favorable to counterparty',
            location: 'Section 12, p.15-17',
            recommendation: 'Renegotiate for more balanced liability terms'
          }
        ],
        score: 68,
        summary: 'Contracts have several terms that are unfavorable and may impact business flexibility.'
      },
      metrics: {
        riskExposure: 65,
        favorability: -12,
        termLength: 36,
        renewalType: 'automatic',
        terminationRights: 'unfavorable'
      },
      valuationImpact: {
        description: 'Contract terms create moderate business constraints and liabilities',
        impact: -3.8
      }
    }
  };
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return mockResponses[documentType];
}

/**
 * Get a comprehensive analysis of all company documents
 */
export async function getComprehensiveDocumentAnalysis(companyId: number): Promise<{
  overallScore: number;
  documentAnalyses: DocumentAnalysisResult[];
  valuationImpact: number;
  recommendations: string[];
}> {
  // This would call a comprehensive document analysis endpoint
  // For now we'll return a mock implementation
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    overallScore: 76,
    documentAnalyses: [
      {
        documentId: 1,
        documentType: 'financial',
        validation: {
          isValid: true,
          issues: [
            {
              severity: 'warning',
              description: 'Inconsistent revenue recognition method between years',
              location: 'Income Statement, p.3',
              recommendation: 'Standardize revenue recognition method across reporting periods'
            }
          ],
          score: 85,
          summary: 'Overall good quality financial statements with minor issues.'
        },
        metrics: {
          revenueGrowth: {
            oneYear: 12.5,
            threeYear: 32.1
          },
          profitMargins: {
            gross: 42.3,
            operating: 18.7,
            net: 11.2
          }
        },
        valuationImpact: {
          description: 'Strong financial performance with steady growth provides positive impact on valuation',
          impact: 7.5
        }
      },
      {
        documentId: 2,
        documentType: 'tax',
        validation: {
          isValid: true,
          issues: [
            {
              severity: 'critical',
              description: 'Incomplete documentation for R&D tax credits claimed',
              location: 'Form XYZ, Section 5',
              recommendation: 'Provide detailed supporting documentation for all R&D activities'
            }
          ],
          score: 72,
          summary: 'Tax documents have compliance issues that should be addressed.'
        },
        metrics: {
          effectiveTaxRate: 21.3,
          totalTaxLiability: 420000,
          complianceScore: 78
        },
        valuationImpact: {
          description: 'Some tax compliance issues present moderate risk',
          impact: -2.5
        }
      }
    ],
    valuationImpact: 5.0,
    recommendations: [
      'Standardize accounting methods across all financial periods',
      'Prepare proper documentation for all tax credits claimed',
      'Review and renegotiate unfavorable contract terms before seeking investors or buyers',
      'Consider accelerating amortization of certain assets to improve tax position',
      'Implement more detailed financial reporting to better showcase growth metrics'
    ]
  };
}

/**
 * Check for common financial document errors or misrepresentations
 */
export function validateFinancialDocuments(metrics: FinancialDocumentMetrics): DocumentIssue[] {
  const issues: DocumentIssue[] = [];
  
  // These are example validations that would be implemented
  if (metrics.profitMargins?.net && metrics.profitMargins.net > metrics.profitMargins.gross) {
    issues.push({
      severity: 'critical',
      description: 'Net profit margin cannot exceed gross profit margin',
      recommendation: 'Review expense categorization and profit calculations'
    });
  }
  
  if (metrics.cashFlow?.operating && metrics.cashFlow?.free && 
      metrics.cashFlow.free > metrics.cashFlow.operating) {
    issues.push({
      severity: 'warning',
      description: 'Free cash flow exceeds operating cash flow without positive investing cash flow',
      recommendation: 'Verify cash flow calculations and categorization'
    });
  }
  
  return issues;
}