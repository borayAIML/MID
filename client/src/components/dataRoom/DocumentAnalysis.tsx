import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AIThinkingLoader } from '@/components/ui/animated-loader';
import { 
  DocumentAnalysisResult, 
  DocumentIssue, 
  FinancialDocumentMetrics, 
  TaxDocumentMetrics, 
  ContractDocumentMetrics,
  analyzeDocument,
  getComprehensiveDocumentAnalysis
} from '@/lib/documentAnalysisService';
import { CalendarDays, AlertTriangle, CheckCircle, FileText, TrendingUp, ChevronDown, ChevronUp, DollarSign, BriefcaseBusiness, FileCog } from 'lucide-react';

interface DocumentAnalysisProps {
  companyId: number;
  documentId: number;
  documentType: 'financial' | 'tax' | 'contract';
}

export default function DocumentAnalysis({ companyId, documentId, documentType }: DocumentAnalysisProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysisResult | null>(null);
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});

  const toggleDetailSection = (section: string) => {
    setShowDetails(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const runAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeDocument(documentId, documentType);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Error analyzing document:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImpactColor = (impact: number) => {
    if (impact > 5) return 'text-green-600';
    if (impact > 0) return 'text-green-500';
    if (impact === 0) return 'text-gray-500';
    if (impact > -5) return 'text-amber-500';
    return 'text-red-500';
  };

  const renderFinancialMetrics = (metrics: FinancialDocumentMetrics) => {
    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-sm mb-2 flex items-center cursor-pointer" 
              onClick={() => toggleDetailSection('growth')}>
            Revenue Growth
            {showDetails.growth ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
          </h4>
          {showDetails.growth && (
            <div className="grid grid-cols-3 gap-2 text-sm">
              {metrics.revenueGrowth?.oneYear !== undefined && (
                <div className="bg-slate-50 p-2 rounded">
                  <div className="text-gray-500">1 Year</div>
                  <div className="font-semibold">{metrics.revenueGrowth.oneYear}%</div>
                </div>
              )}
              {metrics.revenueGrowth?.threeYear !== undefined && (
                <div className="bg-slate-50 p-2 rounded">
                  <div className="text-gray-500">3 Year</div>
                  <div className="font-semibold">{metrics.revenueGrowth.threeYear}%</div>
                </div>
              )}
              {metrics.revenueGrowth?.fiveYear !== undefined && (
                <div className="bg-slate-50 p-2 rounded">
                  <div className="text-gray-500">5 Year</div>
                  <div className="font-semibold">{metrics.revenueGrowth.fiveYear}%</div>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <h4 className="font-medium text-sm mb-2 flex items-center cursor-pointer"
              onClick={() => toggleDetailSection('margins')}>
            Profit Margins
            {showDetails.margins ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
          </h4>
          {showDetails.margins && (
            <div className="grid grid-cols-3 gap-2 text-sm">
              {metrics.profitMargins?.gross !== undefined && (
                <div className="bg-slate-50 p-2 rounded">
                  <div className="text-gray-500">Gross Margin</div>
                  <div className="font-semibold">{metrics.profitMargins.gross}%</div>
                </div>
              )}
              {metrics.profitMargins?.operating !== undefined && (
                <div className="bg-slate-50 p-2 rounded">
                  <div className="text-gray-500">Operating Margin</div>
                  <div className="font-semibold">{metrics.profitMargins.operating}%</div>
                </div>
              )}
              {metrics.profitMargins?.net !== undefined && (
                <div className="bg-slate-50 p-2 rounded">
                  <div className="text-gray-500">Net Margin</div>
                  <div className="font-semibold">{metrics.profitMargins.net}%</div>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <h4 className="font-medium text-sm mb-2 flex items-center cursor-pointer"
              onClick={() => toggleDetailSection('cashflow')}>
            Cash Flow
            {showDetails.cashflow ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
          </h4>
          {showDetails.cashflow && (
            <div className="space-y-2 text-sm">
              {metrics.cashFlow?.operating !== undefined && (
                <div className="flex justify-between items-center">
                  <span>Operating Cash Flow</span>
                  <span className="font-medium">€{metrics.cashFlow.operating.toLocaleString()}</span>
                </div>
              )}
              {metrics.cashFlow?.investing !== undefined && (
                <div className="flex justify-between items-center">
                  <span>Investing Cash Flow</span>
                  <span className="font-medium">€{metrics.cashFlow.investing.toLocaleString()}</span>
                </div>
              )}
              {metrics.cashFlow?.financing !== undefined && (
                <div className="flex justify-between items-center">
                  <span>Financing Cash Flow</span>
                  <span className="font-medium">€{metrics.cashFlow.financing.toLocaleString()}</span>
                </div>
              )}
              {metrics.cashFlow?.free !== undefined && (
                <div className="flex justify-between items-center">
                  <span>Free Cash Flow</span>
                  <span className="font-medium">€{metrics.cashFlow.free.toLocaleString()}</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* We could add more financial metrics here */}
      </div>
    );
  };

  const renderTaxMetrics = (metrics: TaxDocumentMetrics) => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {metrics.effectiveTaxRate !== undefined && (
            <div className="bg-slate-50 p-3 rounded">
              <div className="text-gray-500 text-sm">Effective Tax Rate</div>
              <div className="font-semibold text-lg">{metrics.effectiveTaxRate}%</div>
            </div>
          )}
          {metrics.complianceScore !== undefined && (
            <div className="bg-slate-50 p-3 rounded">
              <div className="text-gray-500 text-sm">Compliance Score</div>
              <div className="font-semibold text-lg">{metrics.complianceScore}/100</div>
            </div>
          )}
        </div>
        
        <div>
          <h4 className="font-medium text-sm mb-2 flex items-center cursor-pointer"
              onClick={() => toggleDetailSection('taxdetails')}>
            Details
            {showDetails.taxdetails ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
          </h4>
          {showDetails.taxdetails && (
            <div className="space-y-2 text-sm">
              {metrics.totalTaxLiability !== undefined && (
                <div className="flex justify-between items-center">
                  <span>Total Tax Liability</span>
                  <span className="font-medium">€{metrics.totalTaxLiability.toLocaleString()}</span>
                </div>
              )}
              {metrics.taxCredits !== undefined && (
                <div className="flex justify-between items-center">
                  <span>Tax Credits</span>
                  <span className="font-medium">€{metrics.taxCredits.toLocaleString()}</span>
                </div>
              )}
              {metrics.deductions !== undefined && (
                <div className="flex justify-between items-center">
                  <span>Total Deductions</span>
                  <span className="font-medium">€{metrics.deductions.toLocaleString()}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContractMetrics = (metrics: ContractDocumentMetrics) => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {metrics.riskExposure !== undefined && (
            <div className="bg-slate-50 p-3 rounded">
              <div className="text-gray-500 text-sm">Risk Exposure</div>
              <div className="font-semibold text-lg">{metrics.riskExposure}/100</div>
            </div>
          )}
          {metrics.favorability !== undefined && (
            <div className="bg-slate-50 p-3 rounded">
              <div className="text-gray-500 text-sm">Favorability</div>
              <div className={`font-semibold text-lg ${metrics.favorability > 0 ? 'text-green-600' : metrics.favorability < 0 ? 'text-red-600' : ''}`}>
                {metrics.favorability > 0 ? '+' : ''}{metrics.favorability}
              </div>
            </div>
          )}
        </div>
        
        <div>
          <h4 className="font-medium text-sm mb-2 flex items-center cursor-pointer"
              onClick={() => toggleDetailSection('contractdetails')}>
            Contract Terms
            {showDetails.contractdetails ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
          </h4>
          {showDetails.contractdetails && (
            <div className="space-y-2 text-sm">
              {metrics.termLength !== undefined && (
                <div className="flex justify-between items-center">
                  <span>Term Length</span>
                  <span className="font-medium">{metrics.termLength} months</span>
                </div>
              )}
              {metrics.renewalType !== undefined && (
                <div className="flex justify-between items-center">
                  <span>Renewal Type</span>
                  <span className="font-medium capitalize">{metrics.renewalType}</span>
                </div>
              )}
              {metrics.terminationRights !== undefined && (
                <div className="flex justify-between items-center">
                  <span>Termination Rights</span>
                  <span className={`font-medium capitalize ${
                    metrics.terminationRights === 'favorable' ? 'text-green-600' : 
                    metrics.terminationRights === 'unfavorable' ? 'text-red-600' : ''
                  }`}>
                    {metrics.terminationRights}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDocumentTypeIcon = () => {
    switch (documentType) {
      case 'financial':
        return <DollarSign className="h-5 w-5 text-blue-500" />;
      case 'tax':
        return <FileCog className="h-5 w-5 text-purple-500" />;
      case 'contract':
        return <BriefcaseBusiness className="h-5 w-5 text-indigo-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center space-x-2">
          {renderDocumentTypeIcon()}
          <CardTitle className="capitalize">{documentType} Document Analysis</CardTitle>
        </div>
        <CardDescription>
          AI-powered analysis of document quality, validation, and business impact
        </CardDescription>
      </CardHeader>

      <CardContent>
        {!analysisResult && !isLoading && !error && (
          <div className="flex flex-col items-center justify-center py-10">
            <FileText className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-center text-gray-500 mb-6">Run document analysis to validate your {documentType} documents and identify potential issues</p>
            <Button 
              onClick={runAnalysis} 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Analyze Document
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="py-8 flex flex-col items-center">
            <AIThinkingLoader text={`Analyzing ${documentType} document...`} />
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="my-4">
            <AlertTitle>Analysis Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {analysisResult && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-1">Validation Score</h3>
                <Progress 
                  value={analysisResult.validation.score} 
                  className="h-3" 
                  style={{ backgroundColor: analysisResult.validation.score > 70 ? '#dcfce7' : analysisResult.validation.score > 40 ? '#fef9c3' : '#fee2e2' }}
                />
              </div>
              <div className="text-3xl font-bold">
                {analysisResult.validation.score}/100
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Summary</h3>
              <p className="text-gray-700">{analysisResult.validation.summary}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Valuation Impact</h3>
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Impact Score</span>
                  <span className={`text-xl font-bold ${getImpactColor(analysisResult.valuationImpact.impact)}`}>
                    {analysisResult.valuationImpact.impact > 0 ? '+' : ''}{analysisResult.valuationImpact.impact.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{analysisResult.valuationImpact.description}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Issues Found</h3>
              {analysisResult.validation.issues.length === 0 ? (
                <div className="flex items-center text-green-600 space-x-2 p-3 bg-green-50 rounded-md">
                  <CheckCircle className="h-5 w-5" />
                  <span>No issues found in this document</span>
                </div>
              ) : (
                <ul className="space-y-2">
                  {analysisResult.validation.issues.map((issue, idx) => (
                    <li key={idx} className={`p-3 border rounded-md ${getSeverityColor(issue.severity)}`}>
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium">{issue.description}</div>
                          {issue.location && <div className="text-sm">Location: {issue.location}</div>}
                          {issue.recommendation && (
                            <div className="text-sm mt-1">
                              <span className="font-medium">Recommendation:</span> {issue.recommendation}
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Key Metrics</h3>
              {documentType === 'financial' && renderFinancialMetrics(analysisResult.metrics as FinancialDocumentMetrics)}
              {documentType === 'tax' && renderTaxMetrics(analysisResult.metrics as TaxDocumentMetrics)}
              {documentType === 'contract' && renderContractMetrics(analysisResult.metrics as ContractDocumentMetrics)}
            </div>
          </div>
        )}
      </CardContent>

      {analysisResult && (
        <CardFooter className="flex justify-between border-t pt-6">
          <div className="flex items-center text-sm text-gray-500">
            <CalendarDays className="mr-2 h-4 w-4" />
            Last updated on {new Date().toLocaleDateString()}
          </div>
          <Button variant="outline" onClick={runAnalysis} disabled={isLoading}>
            Refresh Analysis
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export function ComprehensiveDocumentAnalysis({ companyId }: { companyId: number }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{
    overallScore: number;
    documentAnalyses: DocumentAnalysisResult[];
    valuationImpact: number;
    recommendations: string[];
  } | null>(null);

  const runComprehensiveAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getComprehensiveDocumentAnalysis(companyId);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Error performing comprehensive analysis:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Comprehensive Document Analysis</CardTitle>
        <CardDescription>
          AI-powered analysis of all documents to validate information and identify risks
        </CardDescription>
      </CardHeader>

      <CardContent>
        {!analysisResult && !isLoading && !error && (
          <div className="flex flex-col items-center justify-center py-10">
            <FileText className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-center text-gray-500 mb-6">
              Analyze all company documents to validate information, identify inconsistencies, and assess impact on valuation
            </p>
            <Button 
              onClick={runComprehensiveAnalysis} 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Run Comprehensive Analysis
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="py-8 flex flex-col items-center">
            <AIThinkingLoader text="Performing comprehensive document analysis..." />
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="my-4">
            <AlertTitle>Analysis Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {analysisResult && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-1">Overall Document Score</h3>
                <Progress 
                  value={analysisResult.overallScore} 
                  className="h-3" 
                  style={{ backgroundColor: analysisResult.overallScore > 70 ? '#dcfce7' : analysisResult.overallScore > 40 ? '#fef9c3' : '#fee2e2' }}
                />
              </div>
              <div className="text-3xl font-bold">
                {analysisResult.overallScore}/100
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Valuation Impact</h3>
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Net Impact</span>
                  <span className={`text-xl font-bold ${analysisResult.valuationImpact > 0 ? 'text-green-600' : analysisResult.valuationImpact < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                    {analysisResult.valuationImpact > 0 ? '+' : ''}{analysisResult.valuationImpact.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  The overall impact of document quality and findings on company valuation
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Key Recommendations</h3>
              <ul className="space-y-2">
                {analysisResult.recommendations.map((recommendation, idx) => (
                  <li key={idx} className="p-3 bg-blue-50 text-blue-800 rounded-md flex items-start space-x-2">
                    <span className="font-bold mr-2">{idx + 1}.</span>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Document Analysis Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisResult.documentAnalyses.map((doc, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        {doc.documentType === 'financial' && <DollarSign className="h-5 w-5 text-blue-500 mr-2" />}
                        {doc.documentType === 'tax' && <FileCog className="h-5 w-5 text-purple-500 mr-2" />}
                        {doc.documentType === 'contract' && <BriefcaseBusiness className="h-5 w-5 text-indigo-500 mr-2" />}
                        <h4 className="font-medium capitalize">{doc.documentType} Document</h4>
                      </div>
                      <Badge className={doc.validation.score > 80 ? 'bg-green-100 text-green-800' : 
                                        doc.validation.score > 60 ? 'bg-amber-100 text-amber-800' : 
                                        'bg-red-100 text-red-800'}>
                        {doc.validation.score}/100
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{doc.validation.summary}</p>
                    <div className="text-sm">
                      <div className="flex items-center space-x-1 text-gray-500">
                        <TrendingUp className="h-4 w-4" />
                        <span>Valuation Impact: </span>
                        <span className={doc.valuationImpact.impact > 0 ? 'text-green-600' : 
                                        doc.valuationImpact.impact < 0 ? 'text-red-600' : 'text-gray-500'}>
                          {doc.valuationImpact.impact > 0 ? '+' : ''}{doc.valuationImpact.impact.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {analysisResult && (
        <CardFooter className="flex justify-between border-t pt-6">
          <div className="flex items-center text-sm text-gray-500">
            <CalendarDays className="mr-2 h-4 w-4" />
            Last updated on {new Date().toLocaleDateString()}
          </div>
          <Button variant="outline" onClick={runComprehensiveAnalysis} disabled={isLoading}>
            Refresh Analysis
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}