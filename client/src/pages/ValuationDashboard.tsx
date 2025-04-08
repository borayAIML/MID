import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Download, ChevronRight } from "lucide-react";

import ValuationChart from "@/components/charts/ValuationChart";
import RiskScoreChart from "@/components/charts/RiskScoreChart";
import BenchmarkChart from "@/components/charts/BenchmarkChart";
import { useQuery } from "@tanstack/react-query";
import { generatePdf } from "@/lib/pdfGenerator";
import { useToast } from "@/hooks/use-toast";
import { AnimatedExport } from "@/components/ui/animated-export";
import { IndustrySelector, IndustryDetail } from "@/components/ui/industry-selector";
import { BenchmarkDisplay } from "@/components/ui/benchmark-display";
import { Company, Valuation } from "@shared/schema";

type ValuationDashboardProps = {
  companyId: number | null;
};

export default function ValuationDashboard({ companyId: propCompanyId }: ValuationDashboardProps) {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Try to get companyId from props or localStorage
  const [companyId, setCompanyId] = useState<number | null>(() => {
    if (propCompanyId) return propCompanyId;
    const saved = localStorage.getItem('companyId');
    return saved ? JSON.parse(saved) : null;
  });

  // Update localStorage if prop changes
  useEffect(() => {
    if (propCompanyId) {
      setCompanyId(propCompanyId);
      localStorage.setItem('companyId', JSON.stringify(propCompanyId));
    }
  }, [propCompanyId]);
  
  // Fetch company information
  const { data: company, isLoading: isLoadingCompany } = useQuery<Company>({
    queryKey: [`/api/companies/${companyId}`],
    enabled: !!companyId,
  });
  
  // Fetch valuation data
  const { data: valuation, isLoading: isLoadingValuation } = useQuery<Valuation>({
    queryKey: [`/api/companies/${companyId}/valuation`],
    enabled: !!companyId,
  });
  
  const formatCurrency = (value: number | string | null | undefined) => {
    if (value === null || value === undefined) return 'N/A';
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
      notation: 'compact',
    }).format(numericValue);
  };
  
  const handleDownloadReport = async () => {
    if (!companyId || !company || !valuation) {
      toast({
        title: "Error",
        description: "Unable to generate report. Missing data.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log("Starting report generation...");
      console.log("Company data:", company);
      console.log("Valuation data:", valuation);
      
      await generatePdf(company, valuation);
      
      toast({
        title: "Success",
        description: "Report downloaded successfully.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      let errorMessage = "Failed to generate report.";
      
      if (error instanceof Error) {
        errorMessage += ` ${error.message}`;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };
  
  const handleShowRecommendations = () => {
    setLocation("/improvement-suggestions");
  };
  
  const isLoading = isLoadingCompany || isLoadingValuation;
  
  if (!companyId) {
    setLocation("/onboarding");
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Business Valuation Results
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Analysis completed on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div className="mt-4 flex space-x-3 md:mt-0">
            {company && valuation ? (
              <AnimatedExport 
                company={company} 
                valuation={valuation} 
                variant="outline" 
                className="bg-white hover:bg-gray-50 border-gray-300"
                defaultFormat="pdf"
                showFormatSelector={true}
                showConfetti={true}
                animationType="detailed"
                glowEffect={true}
                pulsate={true}
                buttonText="Export Data"
                onExportStart={() => {
                  toast({
                    title: "Preparing export",
                    description: "Getting your data ready for download...",
                  });
                }}
                onExportComplete={(format: 'csv' | 'json' | 'pdf') => {
                  toast({
                    title: "Export successful",
                    description: `Your data has been exported as ${format.toUpperCase()}`,
                  });
                }}
              />
            ) : (
              <Button variant="outline" disabled>
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            )}
            <Button 
              onClick={() => setLocation("/data-room")} 
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Data Room Analysis
            </Button>
          </div>
        </div>

        <Card className="shadow overflow-hidden mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Valuation Summary</h2>
            
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Company</h3>
                  <p className="text-lg font-semibold text-gray-900">{company?.name || 'Loading...'}</p>
                  <p className="text-sm text-gray-700">{company?.sector || 'Loading...'}</p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Valuation Range</h3>
                  <div className="flex items-baseline">
                    <p className="text-3xl font-bold text-blue-600">{formatCurrency(valuation?.valuationMedian)}</p>
                    <p className="ml-2 text-sm text-blue-700">median value</p>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-700">{formatCurrency(valuation?.valuationMin)}</span>
                    <span className="text-xs text-blue-600">Range</span>
                    <span className="text-sm font-medium text-blue-700">{formatCurrency(valuation?.valuationMax)}</span>
                  </div>
                  
                  {valuation && (
                    <ValuationChart 
                      min={Number(valuation.valuationMin)} 
                      median={Number(valuation.valuationMedian)} 
                      max={Number(valuation.valuationMax)} 
                    />
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Valuation Method Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <table className="min-w-full divide-y divide-gray-200">
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-900">EBITDA Multiple</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                            {formatCurrency(valuation?.ebitdaMultiple)}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-900">Discounted Cash Flow</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                            {formatCurrency(valuation?.discountedCashFlow)}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-900">Revenue Multiple</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                            {formatCurrency(valuation?.revenueMultiple)}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-900">Asset-Based</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                            {formatCurrency(valuation?.assetBased)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="shadow overflow-hidden">
            <CardContent className="p-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Risk Score</h2>
              
              {valuation && (
                <>
                  <div className="flex items-center mb-4">
                    <RiskScoreChart score={valuation.riskScore} />
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900">
                        {valuation.riskScore > 70 ? 'Low' : valuation.riskScore > 40 ? 'Moderate' : 'High'} Risk
                      </h4>
                      <p className="text-sm text-gray-500">
                        {valuation.riskScore > 70 
                          ? 'Your business shows strong fundamentals' 
                          : valuation.riskScore > 40 
                            ? 'Some improvements needed' 
                            : 'Significant risk factors identified'}
                      </p>
                    </div>
                  </div>
                  
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Risk Breakdown</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-gray-700">Financial Health</span>
                        <span className="text-xs font-medium text-gray-700">{valuation.financialHealthScore}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${
                            valuation.financialHealthScore > 60 ? 'bg-green-500' : 
                            valuation.financialHealthScore > 40 ? 'bg-yellow-500' : 
                            'bg-red-500'
                          } h-2 rounded-full`} 
                          style={{ width: `${valuation.financialHealthScore}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-gray-700">Market Position</span>
                        <span className="text-xs font-medium text-gray-700">{valuation.marketPositionScore}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${
                            valuation.marketPositionScore > 60 ? 'bg-green-500' : 
                            valuation.marketPositionScore > 40 ? 'bg-yellow-500' : 
                            'bg-red-500'
                          } h-2 rounded-full`} 
                          style={{ width: `${valuation.marketPositionScore}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-gray-700">Operational Efficiency</span>
                        <span className="text-xs font-medium text-gray-700">{valuation.operationalEfficiencyScore}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${
                            valuation.operationalEfficiencyScore > 60 ? 'bg-green-500' : 
                            valuation.operationalEfficiencyScore > 40 ? 'bg-yellow-500' : 
                            'bg-red-500'
                          } h-2 rounded-full`} 
                          style={{ width: `${valuation.operationalEfficiencyScore}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-gray-700">Debt Structure</span>
                        <span className="text-xs font-medium text-gray-700">{valuation.debtStructureScore}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${
                            valuation.debtStructureScore > 60 ? 'bg-green-500' : 
                            valuation.debtStructureScore > 40 ? 'bg-yellow-500' : 
                            'bg-red-500'
                          } h-2 rounded-full`} 
                          style={{ width: `${valuation.debtStructureScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card className="shadow overflow-hidden">
            <CardContent className="p-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Industry Benchmarks</h2>
              
              {/* Industry Selector Component */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Select Your Industry</h3>
                <IndustrySelector 
                  initialValue={{ 
                    industryId: company?.sector === 'Technology' ? 'tech' : 
                                 company?.sector === 'Retail' ? 'retail' : 
                                 company?.sector === 'Manufacturing' ? 'manufacturing' : 
                                 company?.sector === 'Professional Services' ? 'services' : 
                                 company?.sector === 'Healthcare' ? 'healthcare' : 'tech'
                  }}
                  onChange={(selection) => {
                    console.log("Industry selection changed:", selection);
                    // In a real app, you might store this in state and/or save to the backend
                  }}
                />
              </div>
              
              {/* Industry Description */}
              <div className="mb-6">
                <IndustryDetail 
                  industryId={
                    company?.sector === 'Technology' ? 'tech' : 
                    company?.sector === 'Retail' ? 'retail' : 
                    company?.sector === 'Manufacturing' ? 'manufacturing' : 
                    company?.sector === 'Professional Services' ? 'services' : 
                    company?.sector === 'Healthcare' ? 'healthcare' : 'tech'
                  }
                />
              </div>
              
              {/* Dynamic Benchmark Display Component */}
              <BenchmarkDisplay 
                industryId={
                  company?.sector === 'Technology' ? 'tech' : 
                  company?.sector === 'Retail' ? 'retail' : 
                  company?.sector === 'Manufacturing' ? 'manufacturing' : 
                  company?.sector === 'Professional Services' ? 'services' : 
                  company?.sector === 'Healthcare' ? 'healthcare' : 'tech'
                }
                companyMetrics={{
                  revenue_growth: 14,
                  profit_margin: 22,
                  digital_transformation: 42
                }}
                metrics={['revenue_growth', 'profit_margin', 'digital_transformation', 'roi', 'customer_retention']}
              />
            </CardContent>
          </Card>
        </div>

        <Card className="shadow overflow-hidden mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Red Flags & Areas of Concern</h2>
            
            {valuation?.redFlags && valuation.redFlags.length > 0 ? (
              <div className="space-y-4">
                {valuation.redFlags.map((flag: string, index: number) => (
                  <div key={index} className={index === 0 ? "bg-red-50 border-l-4 border-red-400 p-4" : "bg-yellow-50 border-l-4 border-yellow-400 p-4"}>
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${index === 0 ? 'text-red-400' : 'text-yellow-400'}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className={`text-sm font-medium ${index === 0 ? 'text-red-800' : 'text-yellow-800'}`}>{flag}</h3>
                        <div className={`mt-1 text-sm ${index === 0 ? 'text-red-700' : 'text-yellow-700'}`}>
                          <p>
                            {index === 0 
                              ? 'This represents a significant risk factor that may negatively impact your valuation.' 
                              : 'This is an area of concern that should be addressed to improve your business value.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">No significant red flags detected</h3>
                    <div className="mt-1 text-sm text-green-700">
                      <p>Your business shows strong fundamentals across key areas.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-6">
              <Button
                onClick={handleShowRecommendations}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <ChevronRight className="mr-2 h-4 w-4" />
                How can I increase my valuation?
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
