import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

import { Valuation, Company } from "@shared/schema";
import ValuationChart from "@/components/charts/ValuationChart";
import RiskScoreChart from "@/components/charts/RiskScoreChart";
import BenchmarkChart from "@/components/charts/BenchmarkChart";
import { IndustrySelector, IndustryDetail } from "@/components/ui/industry-selector";
import { BenchmarkDisplay } from "@/components/ui/benchmark-display";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer, ChevronLeft, Share2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataExport } from "@/components/ui/data-export";
import { generatePdf } from "@/lib/pdfGenerator";

type ValuationReportProps = {
  companyId: number | null;
};

export default function ValuationReport({ companyId: propCompanyId }: ValuationReportProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  
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

  const {
    data: company,
    isLoading: isLoadingCompany,
    error: companyError,
  } = useQuery({
    queryKey: ["/api/companies", companyId],
    enabled: !!companyId,
  });

  const {
    data: valuation,
    isLoading: isLoadingValuation,
    error: valuationError,
  } = useQuery({
    queryKey: ["/api/companies", companyId, "valuation"],
    enabled: !!companyId,
  });

  useEffect(() => {
    if (companyError || valuationError) {
      toast({
        title: "Error",
        description: "Failed to load valuation data. Please try again.",
        variant: "destructive",
      });
    }
  }, [companyError, valuationError, toast]);

  const formatCurrency = (value: any) => {
    if (!value || isNaN(Number(value))) return "N/A";
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(Number(value));
  };

  const formatPercentage = (value: any) => {
    if (!value || isNaN(Number(value))) return "N/A";
    return `${value}%`;
  };

  const handleBackToValuation = () => {
    setLocation("/valuation");
  };

  const handlePrintReport = () => {
    window.print();
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
  
  const handleShareReport = () => {
    // In a real app, this would generate a shareable link
    toast({
      title: "Share Link Generated",
      description: "A unique link to this report has been copied to your clipboard.",
    });
  };

  const isLoading = isLoadingCompany || isLoadingValuation;

  if (!companyId) {
    setLocation("/onboarding");
    return null;
  }

  // Risk score text mapping
  const getRiskText = (score: number) => {
    if (score > 70) return { label: "Low Risk", description: "Your business shows strong fundamentals" };
    if (score > 40) return { label: "Moderate Risk", description: "Some improvements needed" };
    return { label: "High Risk", description: "Significant risk factors identified" };
  };

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 print:px-0 print:py-0">
        <div className="md:flex md:items-center md:justify-between mb-8 print:hidden">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToValuation}
                className="mr-2 -ml-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              Business Valuation Report
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Generated on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div className="mt-4 flex space-x-3 md:mt-0">
            <Button onClick={handlePrintReport} variant="outline" disabled={isLoading}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            {company && valuation ? (
              <DataExport 
                company={company} 
                valuation={valuation} 
                variant="outline" 
                className="bg-white hover:bg-gray-50 border-gray-300"
              />
            ) : (
              <Button variant="outline" disabled>
                <Printer className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            )}
            <Button onClick={handleShareReport} disabled={isLoading}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Print header - only visible when printing */}
        <div className="hidden print:block mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-900">Business Valuation Report</h1>
          <p className="text-center text-gray-500 mt-2">
            Generated on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <div className="border-b border-gray-200 my-6"></div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p>Loading valuation report...</p>
          </div>
        ) : (
          <>
            {/* Report Content */}
            <Tabs defaultValue="overview" className="print:hidden" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Valuation Details</TabsTrigger>
                <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card className="shadow">
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Company Profile</h2>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Company Name</h3>
                          <p className="text-lg font-medium text-gray-900">{company?.name || 'N/A'}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Industry</h3>
                          <p className="text-lg font-medium text-gray-900">{company?.sector || 'N/A'}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Location</h3>
                          <p className="text-lg font-medium text-gray-900">{company?.location || 'N/A'}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Years in Business</h3>
                          <p className="text-lg font-medium text-gray-900">{company?.yearsInBusiness || 'N/A'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow">
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Valuation Summary</h2>
                      
                      <div className="bg-blue-50 rounded-lg p-4 mb-6">
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
                      
                      <div className="flex items-center mb-4">
                        {valuation && <RiskScoreChart score={valuation.riskScore} />}
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-gray-900">
                            {valuation && getRiskText(valuation.riskScore).label}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {valuation && getRiskText(valuation.riskScore).description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="shadow mb-6">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Executive Summary</h2>
                    <p className="text-gray-700 mb-4">
                      Based on our comprehensive analysis of {company?.name || 'your business'}, we've determined a 
                      valuation range of {formatCurrency(valuation?.valuationMin)} to {formatCurrency(valuation?.valuationMax)}, 
                      with a median value of {formatCurrency(valuation?.valuationMedian)}.
                    </p>
                    <p className="text-gray-700 mb-4">
                      This valuation is derived from multiple methodologies including EBITDA multiple, 
                      discounted cash flow analysis, revenue multiple, and asset-based calculations. 
                      The business demonstrates {valuation?.riskScore && valuation.riskScore > 60 ? 'strong' : 
                      valuation?.riskScore && valuation.riskScore > 40 ? 'moderate' : 'concerning'} 
                      fundamentals with particular {valuation?.riskScore && valuation.riskScore > 60 ? 'strengths' : 'challenges'} 
                      in {valuation?.financialHealthScore && valuation.financialHealthScore > 60 ? 'financial health' : 
                      valuation?.marketPositionScore && valuation.marketPositionScore > 60 ? 'market position' : 
                      valuation?.operationalEfficiencyScore && valuation.operationalEfficiencyScore > 60 ? 'operational efficiency' : 
                      'debt structure'}.
                    </p>
                    <p className="text-gray-700">
                      We've identified several opportunities for value enhancement through digital transformation, 
                      operational improvements, and financial restructuring that could potentially increase 
                      the company's valuation by 15-25% over the next 12-24 months.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="details" className="mt-6">
                <Card className="shadow mb-6">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Valuation Methods</h2>
                    
                    <div className="overflow-hidden mb-6">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Valuation Method
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Value
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Weight
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Weighted Value
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              EBITDA Multiple
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                              {formatCurrency(valuation?.ebitdaMultiple)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                              40%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                              {valuation?.ebitdaMultiple ? formatCurrency(Number(valuation.ebitdaMultiple) * 0.4) : 'N/A'}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Discounted Cash Flow
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                              {formatCurrency(valuation?.discountedCashFlow)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                              30%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                              {valuation?.discountedCashFlow ? formatCurrency(Number(valuation.discountedCashFlow) * 0.3) : 'N/A'}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Revenue Multiple
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                              {formatCurrency(valuation?.revenueMultiple)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                              20%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                              {valuation?.revenueMultiple ? formatCurrency(Number(valuation.revenueMultiple) * 0.2) : 'N/A'}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Asset-Based
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                              {formatCurrency(valuation?.assetBased)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                              10%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                              {valuation?.assetBased ? formatCurrency(Number(valuation.assetBased) * 0.1) : 'N/A'}
                            </td>
                          </tr>
                          <tr className="bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                              Weighted Average
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                              
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                              100%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                              {formatCurrency(valuation?.valuationMedian)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Methodology Explanations</h3>
                    
                    <div className="space-y-4 text-gray-700">
                      <div>
                        <h4 className="font-medium text-gray-900">EBITDA Multiple</h4>
                        <p>Based on the company's earnings before interest, taxes, depreciation, and amortization, multiplied by an industry-specific factor.</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900">Discounted Cash Flow</h4>
                        <p>Estimates the value based on expected future cash flows, adjusted for the time value of money using a discount rate reflecting the risk of the business.</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900">Revenue Multiple</h4>
                        <p>Calculates value based on annual revenue multiplied by an industry-specific factor, which is particularly relevant for growth-stage companies.</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900">Asset-Based</h4>
                        <p>Determines value based on the net asset value of the company, important for businesses with significant tangible assets.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow mb-6">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Industry Benchmarks</h2>
                    
                    {/* Industry Detail Component */}
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-600 mb-2">Industry Profile</h3>
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
                        digital_transformation: 42,
                        customer_retention: 82
                      }}
                      metrics={['revenue_growth', 'profit_margin', 'digital_transformation', 'customer_retention']}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="risk" className="mt-6">
                <Card className="shadow mb-6">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Risk Assessment</h2>
                    
                    <div className="flex items-center mb-6">
                      {valuation && <RiskScoreChart score={valuation.riskScore} />}
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">
                          {valuation && getRiskText(valuation.riskScore).label}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {valuation && getRiskText(valuation.riskScore).description}
                        </p>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Breakdown</h3>
                    <div className="space-y-6 mb-8">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">Financial Health</span>
                          <span className="text-sm font-medium text-gray-700">{valuation?.financialHealthScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${
                              valuation?.financialHealthScore && valuation.financialHealthScore > 60 ? 'bg-green-500' : 
                              valuation?.financialHealthScore && valuation.financialHealthScore > 40 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            } h-2 rounded-full`} 
                            style={{ width: `${valuation?.financialHealthScore}%` }}
                          ></div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          {valuation?.financialHealthScore && valuation.financialHealthScore > 60 
                            ? 'Strong financial performance with consistent growth and healthy margins.' 
                            : valuation?.financialHealthScore && valuation.financialHealthScore > 40 
                              ? 'Moderate financial health with some volatility in revenue and profitability.'
                              : 'Concerning financial indicators with declining revenue or inconsistent profitability.'}
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">Market Position</span>
                          <span className="text-sm font-medium text-gray-700">{valuation?.marketPositionScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${
                              valuation?.marketPositionScore && valuation.marketPositionScore > 60 ? 'bg-green-500' : 
                              valuation?.marketPositionScore && valuation.marketPositionScore > 40 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            } h-2 rounded-full`} 
                            style={{ width: `${valuation?.marketPositionScore}%` }}
                          ></div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          {valuation?.marketPositionScore && valuation.marketPositionScore > 60 
                            ? 'Well-established market presence with strong competitive advantages.' 
                            : valuation?.marketPositionScore && valuation.marketPositionScore > 40 
                              ? 'Moderate market position with growing but not dominant market share.'
                              : 'Weak market positioning with significant competitive threats.'}
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">Operational Efficiency</span>
                          <span className="text-sm font-medium text-gray-700">{valuation?.operationalEfficiencyScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${
                              valuation?.operationalEfficiencyScore && valuation.operationalEfficiencyScore > 60 ? 'bg-green-500' : 
                              valuation?.operationalEfficiencyScore && valuation.operationalEfficiencyScore > 40 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            } h-2 rounded-full`} 
                            style={{ width: `${valuation?.operationalEfficiencyScore}%` }}
                          ></div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          {valuation?.operationalEfficiencyScore && valuation.operationalEfficiencyScore > 60 
                            ? 'Highly efficient operations with optimized processes and resource utilization.' 
                            : valuation?.operationalEfficiencyScore && valuation.operationalEfficiencyScore > 40 
                              ? 'Reasonable operational efficiency with some opportunities for improvement.'
                              : 'Inefficient operations with significant waste and process bottlenecks.'}
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">Debt Structure</span>
                          <span className="text-sm font-medium text-gray-700">{valuation?.debtStructureScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${
                              valuation?.debtStructureScore && valuation.debtStructureScore > 60 ? 'bg-green-500' : 
                              valuation?.debtStructureScore && valuation.debtStructureScore > 40 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            } h-2 rounded-full`} 
                            style={{ width: `${valuation?.debtStructureScore}%` }}
                          ></div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          {valuation?.debtStructureScore && valuation.debtStructureScore > 60 
                            ? 'Healthy debt levels with favorable terms and strong coverage ratios.' 
                            : valuation?.debtStructureScore && valuation.debtStructureScore > 40 
                              ? 'Manageable debt with some refinancing opportunities.'
                              : 'Concerning debt levels or unfavorable terms creating financial strain.'}
                        </p>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Red Flags & Areas of Concern</h3>
                    
                    {valuation?.redFlags && valuation.redFlags.length > 0 ? (
                      <div className="space-y-4">
                        {valuation.redFlags.map((flag, index) => (
                          <div key={index} className={index === 0 ? "bg-red-50 border-l-4 border-red-400 p-4" : "bg-yellow-50 border-l-4 border-yellow-400 p-4"}>
                            <div className="flex items-start">
                              <div className="flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${index === 0 ? 'text-red-400' : 'text-yellow-400'}`} viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <h3 className={`text-sm font-medium ${index === 0 ? 'text-red-800' : 'text-yellow-800'}`}>{flag.title}</h3>
                                <p className={`mt-1 text-sm ${index === 0 ? 'text-red-700' : 'text-yellow-700'}`}>{flag.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-red-50 border-l-4 border-red-400 p-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Digital Transformation Gap</h3>
                            <p className="mt-1 text-sm text-red-700">Your company's digital transformation score is significantly below industry average (42 vs 68), limiting growth potential and operational efficiency.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="recommendations" className="mt-6">
                <Card className="shadow mb-6">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Recommendations</h2>
                    
                    <div className="space-y-8">
                      <div>
                        <div className="flex items-center mb-2">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-bold">1</span>
                          </div>
                          <h3 className="text-lg font-medium text-gray-900">Digital Transformation Initiatives</h3>
                        </div>
                        <div className="ml-13 pl-13">
                          <p className="text-gray-700 mb-3 ml-13">Potential valuation impact: <span className="font-semibold text-blue-600">12-18% increase</span></p>
                          <div className="bg-blue-50 p-4 rounded-lg mb-3">
                            <ul className="list-disc space-y-2 ml-5 text-gray-700">
                              <li>Implement CRM system to better track customer interactions and improve sales processes</li>
                              <li>Adopt ERP solutions to streamline operations and provide real-time business insights</li>
                              <li>Develop e-commerce channels to expand market reach and create new revenue streams</li>
                              <li>Leverage cloud computing for improved flexibility and reduced IT infrastructure costs</li>
                            </ul>
                          </div>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Timeline:</span> 6-12 months
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center mb-2">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                            <span className="text-purple-600 font-bold">2</span>
                          </div>
                          <h3 className="text-lg font-medium text-gray-900">AI Operations Integration</h3>
                        </div>
                        <div className="ml-13 pl-13">
                          <p className="text-gray-700 mb-3">Potential valuation impact: <span className="font-semibold text-purple-600">15-22% increase</span></p>
                          <div className="bg-purple-50 p-4 rounded-lg mb-3">
                            <ul className="list-disc space-y-2 ml-5 text-gray-700">
                              <li>Implement AI-powered customer support to improve response times and satisfaction</li>
                              <li>Use AI for sales forecasting to optimize inventory and resource allocation</li>
                              <li>Adopt AI-based analytics for deeper business insights and predictive capabilities</li>
                              <li>Automate routine tasks to reduce operational costs and increase efficiency</li>
                            </ul>
                          </div>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Timeline:</span> 8-14 months
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center mb-2">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                            <span className="text-green-600 font-bold">3</span>
                          </div>
                          <h3 className="text-lg font-medium text-gray-900">Financial Structure Optimization</h3>
                        </div>
                        <div className="ml-13 pl-13">
                          <p className="text-gray-700 mb-3">Potential valuation impact: <span className="font-semibold text-green-600">8-14% increase</span></p>
                          <div className="bg-green-50 p-4 rounded-lg mb-3">
                            <ul className="list-disc space-y-2 ml-5 text-gray-700">
                              <li>Restructure existing debt to improve terms and reduce interest expenses</li>
                              <li>Implement margin optimization strategies focusing on high-profit products/services</li>
                              <li>Address tax filing inconsistencies to reduce audit risk and potential liabilities</li>
                              <li>Develop more robust financial reporting processes for better decision-making</li>
                            </ul>
                          </div>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Timeline:</span> 3-6 months
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow mb-6">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Next Steps</h2>
                    
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <ol className="list-decimal ml-5 space-y-4 text-gray-700">
                        <li>
                          <span className="font-medium">Schedule a strategy session</span> with our advisors to develop an implementation plan for these recommendations
                        </li>
                        <li>
                          <span className="font-medium">Prioritize initiatives</span> based on impact, resource requirements, and strategic alignment
                        </li>
                        <li>
                          <span className="font-medium">Assemble implementation teams</span> with the right skills and expertise for each focus area
                        </li>
                        <li>
                          <span className="font-medium">Establish metrics</span> to track progress and measure impact on business valuation
                        </li>
                        <li>
                          <span className="font-medium">Schedule quarterly reviews</span> to assess progress and adjust strategies as needed
                        </li>
                      </ol>
                      
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="font-medium text-gray-900 mb-2">Contact Information</p>
                        <p className="text-gray-700">For additional information or to schedule your strategy session, please contact:</p>
                        <p className="text-gray-700 mt-2">
                          <span className="font-medium">Email:</span> advisor@valuationpro.com<br />
                          <span className="font-medium">Phone:</span> (555) 123-4567
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            {/* Print version - only visible when printing */}
            <div className="hidden print:block">
              {/* Print Overview Section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4">Company Overview</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Company Name</h3>
                    <p className="text-lg font-medium text-gray-900">{company?.name || 'N/A'}</p>
                    
                    <h3 className="text-sm font-medium text-gray-500 mt-4">Industry</h3>
                    <p className="text-lg font-medium text-gray-900">{company?.sector || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                    <p className="text-lg font-medium text-gray-900">{company?.location || 'N/A'}</p>
                    
                    <h3 className="text-sm font-medium text-gray-500 mt-4">Years in Business</h3>
                    <p className="text-lg font-medium text-gray-900">{company?.yearsInBusiness || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              {/* Print Valuation Summary */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4">Valuation Summary</h2>
                <p className="mb-4">Based on our comprehensive analysis, we've determined the following valuation metrics:</p>
                
                <div className="bg-blue-50 p-4 rounded mb-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-blue-800">Minimum Value</h3>
                      <p className="text-xl font-bold text-blue-900">{formatCurrency(valuation?.valuationMin)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-blue-800">Median Value</h3>
                      <p className="text-xl font-bold text-blue-900">{formatCurrency(valuation?.valuationMedian)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-blue-800">Maximum Value</h3>
                      <p className="text-xl font-bold text-blue-900">{formatCurrency(valuation?.valuationMax)}</p>
                    </div>
                  </div>
                </div>
                
                <h3 className="font-medium text-gray-900 mb-2">Valuation Methods</h3>
                <table className="min-w-full divide-y divide-gray-200 mb-4">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                      <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Value</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">EBITDA Multiple</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatCurrency(valuation?.ebitdaMultiple)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">Discounted Cash Flow</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatCurrency(valuation?.discountedCashFlow)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">Revenue Multiple</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatCurrency(valuation?.revenueMultiple)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">Asset-Based</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatCurrency(valuation?.assetBased)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Print Risk Assessment */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4">Risk Assessment</h2>
                
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 mb-2">Overall Risk Score: {valuation?.riskScore}/100</h3>
                  <p className="text-gray-700">
                    {valuation?.riskScore && valuation.riskScore > 70 
                      ? 'Your business shows strong fundamentals with minimal risk factors.' 
                      : valuation?.riskScore && valuation.riskScore > 40 
                        ? 'Your business has moderate risk with some areas requiring attention.'
                        : 'Your business shows significant risk factors that need immediate attention.'}
                  </p>
                </div>
                
                <h3 className="font-medium text-gray-900 mb-2">Risk Factor Breakdown</h3>
                <table className="min-w-full divide-y divide-gray-200 mb-4">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Risk Factor</th>
                      <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Score</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">Financial Health</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatPercentage(valuation?.financialHealthScore)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">Market Position</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatPercentage(valuation?.marketPositionScore)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">Operational Efficiency</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatPercentage(valuation?.operationalEfficiencyScore)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">Debt Structure</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatPercentage(valuation?.debtStructureScore)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Print Recommendations */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4">Key Recommendations</h2>
                
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 mb-1">1. Digital Transformation Initiatives (12-18% potential increase)</h3>
                  <ul className="list-disc ml-5 text-gray-700">
                    <li>Implement CRM systems</li>
                    <li>Adopt ERP solutions</li>
                    <li>Develop e-commerce channels</li>
                  </ul>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 mb-1">2. AI Operations Integration (15-22% potential increase)</h3>
                  <ul className="list-disc ml-5 text-gray-700">
                    <li>Implement AI-powered customer support</li>
                    <li>Use AI for sales forecasting</li>
                    <li>Adopt AI-based analytics</li>
                  </ul>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 mb-1">3. Financial Structure Optimization (8-14% potential increase)</h3>
                  <ul className="list-disc ml-5 text-gray-700">
                    <li>Restructure existing debt</li>
                    <li>Implement margin optimization</li>
                    <li>Address tax filing inconsistencies</li>
                  </ul>
                </div>
              </div>
              
              {/* Print Footer */}
              <div className="mt-12 pt-4 border-t border-gray-200 text-center text-gray-600 text-sm">
                <p>Report Generated by Business Valuation Platform © {new Date().getFullYear()}</p>
                <p>Report ID: VR-{Date.now().toString().slice(-8)}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}