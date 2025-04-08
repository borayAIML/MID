import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

import { Valuation, Company, Document } from "@shared/schema";
import ValuationChart from "@/components/charts/ValuationChart";
import RiskScoreChart from "@/components/charts/RiskScoreChart";
import BenchmarkChart from "@/components/charts/BenchmarkChart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ChevronLeft, Share2, ArrowUpRight, FileBarChart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generatePdf } from "@/lib/pdfGenerator";
import DocumentAnalysis, { ComprehensiveDocumentAnalysis } from "@/components/dataRoom/DocumentAnalysis";
import {
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Ban,
  Activity,
  Shield,
  Users,
  Globe,
  Landmark,
  Briefcase,
  FileText,
  PieChart,
  Cpu,
  Award,
  AlertTriangle,
} from "lucide-react";

type DataRoomProps = {
  companyId: number | null;
};

export default function DataRoom({ companyId: propCompanyId }: DataRoomProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  
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
    queryKey: [`/api/companies/${companyId}`],
    enabled: !!companyId,
  });

  const {
    data: valuation,
    isLoading: isLoadingValuation,
    error: valuationError,
  } = useQuery({
    queryKey: [`/api/companies/${companyId}/valuation`],
    enabled: !!companyId,
  });
  
  const {
    data: documents,
    isLoading: isLoadingDocuments,
    error: documentsError,
  } = useQuery({
    queryKey: [`/api/companies/${companyId}/documents`],
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
    toast({
      title: "Share Link Generated",
      description: "A unique link to this report has been copied to your clipboard.",
    });
  };

  const isLoading = isLoadingCompany || isLoadingValuation || isLoadingDocuments;

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

  // PESTEL factors
  const pestelFactors = {
    political: {
      score: 65,
      factors: [
        { name: "Regulatory stability", impact: "Medium", trend: "Stable" },
        { name: "Trade policies", impact: "High", trend: "Negative" },
        { name: "Government support", impact: "Low", trend: "Positive" },
      ]
    },
    economic: {
      score: 72,
      factors: [
        { name: "Market growth", impact: "High", trend: "Positive" },
        { name: "Interest rates", impact: "Medium", trend: "Negative" },
        { name: "Consumer spending", impact: "High", trend: "Stable" },
      ]
    },
    social: {
      score: 68,
      factors: [
        { name: "Demographic trends", impact: "Medium", trend: "Positive" },
        { name: "Consumer behavior", impact: "High", trend: "Positive" },
        { name: "Work culture", impact: "Low", trend: "Stable" },
      ]
    },
    technological: {
      score: 45,
      factors: [
        { name: "Digital transformation", impact: "High", trend: "Negative" },
        { name: "Tech adoption rate", impact: "High", trend: "Negative" },
        { name: "Innovation capacity", impact: "Medium", trend: "Stable" },
      ]
    },
    environmental: {
      score: 70,
      factors: [
        { name: "Sustainability practices", impact: "Medium", trend: "Positive" },
        { name: "Environmental regulations", impact: "Low", trend: "Stable" },
        { name: "Resource efficiency", impact: "Medium", trend: "Positive" },
      ]
    },
    legal: {
      score: 78,
      factors: [
        { name: "Compliance status", impact: "High", trend: "Positive" },
        { name: "Legal risk exposure", impact: "Low", trend: "Stable" },
        { name: "Contractual obligations", impact: "Medium", trend: "Stable" },
      ]
    }
  };

  // SWOT analysis
  const swotAnalysis = {
    strengths: [
      { title: "Strong market position", description: "Established presence in the main target markets", impact: "High" },
      { title: "Experienced leadership", description: "Management team with industry expertise", impact: "Medium" },
      { title: "Customer loyalty", description: "High retention rates and repeat business", impact: "High" },
      { title: "Financial stability", description: "Healthy cash flow and manageable debt", impact: "High" },
    ],
    weaknesses: [
      { title: "Limited digital presence", description: "Underdeveloped online channels and capabilities", impact: "High" },
      { title: "Manual processes", description: "Insufficient automation of key business processes", impact: "Medium" },
      { title: "Legacy systems", description: "Outdated technology infrastructure", impact: "High" },
      { title: "Talent gaps", description: "Missing key technical and digital marketing skills", impact: "Medium" },
    ],
    opportunities: [
      { title: "Digital transformation", description: "Significant room for operational improvement through technology", impact: "High" },
      { title: "Market expansion", description: "Potential for geographic and demographic growth", impact: "Medium" },
      { title: "Strategic partnerships", description: "Potential for valuable collaborative relationships", impact: "Medium" },
      { title: "Product diversification", description: "Opportunities to expand product/service offerings", impact: "High" },
    ],
    threats: [
      { title: "Increasing competition", description: "New market entrants and evolving competitor landscape", impact: "High" },
      { title: "Technological disruption", description: "Industry changes driven by new technologies", impact: "High" },
      { title: "Regulatory changes", description: "Evolving compliance requirements", impact: "Medium" },
      { title: "Market volatility", description: "Economic uncertainty and fluctuations", impact: "Medium" },
    ]
  };

  // Improvement opportunities
  const improvementOpportunities = [
    {
      category: "Digital Transformation",
      initiatives: [
        { name: "CRM Implementation", valuationImpact: "10-15%", timeframe: "6-12 months", complexity: "Medium" },
        { name: "E-commerce Development", valuationImpact: "12-18%", timeframe: "8-12 months", complexity: "High" },
        { name: "Business Intelligence System", valuationImpact: "8-12%", timeframe: "4-8 months", complexity: "Medium" }
      ]
    },
    {
      category: "Operational Excellence",
      initiatives: [
        { name: "Process Automation", valuationImpact: "7-12%", timeframe: "3-6 months", complexity: "Medium" },
        { name: "Supply Chain Optimization", valuationImpact: "5-10%", timeframe: "6-9 months", complexity: "High" },
        { name: "Quality Management System", valuationImpact: "4-8%", timeframe: "3-6 months", complexity: "Low" }
      ]
    },
    {
      category: "Market Expansion",
      initiatives: [
        { name: "New Target Segments", valuationImpact: "8-15%", timeframe: "6-12 months", complexity: "Medium" },
        { name: "Geographic Expansion", valuationImpact: "10-20%", timeframe: "12-18 months", complexity: "High" },
        { name: "Strategic Partnerships", valuationImpact: "7-14%", timeframe: "6-12 months", complexity: "Medium" }
      ]
    },
    {
      category: "Financial Optimization",
      initiatives: [
        { name: "Debt Restructuring", valuationImpact: "5-10%", timeframe: "3-6 months", complexity: "Medium" },
        { name: "Revenue Diversification", valuationImpact: "8-15%", timeframe: "9-18 months", complexity: "High" },
        { name: "Margin Improvement", valuationImpact: "6-12%", timeframe: "6-12 months", complexity: "Medium" }
      ]
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "text-red-600";
      case "Medium":
        return "text-amber-600";
      case "Low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "Positive":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "Negative":
        return <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />;
      case "Stable":
        return <ArrowUpRight className="h-4 w-4 text-amber-500 transform rotate-90" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
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
              Business Valuation Data Room
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Comprehensive analysis for {company?.name || 'your company'} | 
              Generated on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div className="mt-4 flex space-x-3 md:mt-0">
            <Button onClick={handleDownloadReport} variant="outline" disabled={isLoading}>
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
            <Button onClick={handleShareReport} disabled={isLoading}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p>Loading data room...</p>
          </div>
        ) : (
          <>
            {/* Data Room Content */}
            <Tabs defaultValue="dashboard" onValueChange={setActiveTab}>
              <TabsList className="flex flex-wrap w-full">
                <TabsTrigger className="flex-1 min-w-[110px] py-1.5 whitespace-nowrap text-sm" value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger className="flex-1 min-w-[110px] py-1.5 whitespace-nowrap text-sm" value="pestel">PESTEL Analysis</TabsTrigger>
                <TabsTrigger className="flex-1 min-w-[110px] py-1.5 whitespace-nowrap text-sm" value="swot">SWOT Analysis</TabsTrigger>
                <TabsTrigger className="flex-1 min-w-[110px] py-1.5 whitespace-nowrap text-sm" value="risk">Risk Assessment</TabsTrigger>
                <TabsTrigger className="flex-1 min-w-[110px] py-1.5 whitespace-nowrap text-sm" value="documents">Documents</TabsTrigger>
                <TabsTrigger className="flex-1 min-w-[130px] py-1.5 whitespace-nowrap text-sm" value="improvement">Improvement</TabsTrigger>
                <TabsTrigger className="flex-1 min-w-[110px] py-1.5 whitespace-nowrap text-sm" value="advanced">Advanced</TabsTrigger>
                <TabsTrigger className="flex-1 min-w-[110px] py-1.5 whitespace-nowrap text-sm" value="exit">Exit Strategy</TabsTrigger>
              </TabsList>
              
              {/* Dashboard Tab */}
              <TabsContent value="dashboard" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card className="shadow md:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle>Valuation Summary</CardTitle>
                      <CardDescription>Based on multiple valuation methodologies</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="bg-blue-50 rounded-lg p-4 mb-4">
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
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="text-xs text-gray-500 mb-1">EBITDA</div>
                          <div className="text-lg font-semibold">{formatCurrency(valuation?.ebitdaMultiple)}</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="text-xs text-gray-500 mb-1">DCF</div>
                          <div className="text-lg font-semibold">{formatCurrency(valuation?.discountedCashFlow)}</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="text-xs text-gray-500 mb-1">Revenue Multiple</div>
                          <div className="text-lg font-semibold">{formatCurrency(valuation?.revenueMultiple)}</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="text-xs text-gray-500 mb-1">Asset-Based</div>
                          <div className="text-lg font-semibold">{formatCurrency(valuation?.assetBased)}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <AlertCircle className="h-6 w-6 text-gray-700 mr-2" />
                        <CardTitle>Risk Profile</CardTitle>
                      </div>
                      <CardDescription>Overall risk assessment and factors</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      {valuation && (
                        <>
                          <div className="flex items-center justify-center mb-6">
                            <RiskScoreChart score={valuation.riskScore} />
                          </div>
                          <div className="text-center mb-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-1">
                              {valuation.riskScore > 70 ? 'Low' : valuation.riskScore > 40 ? 'Moderate' : 'High'} Risk
                            </h4>
                            <p className="text-sm text-gray-600 mb-4">
                              {valuation.riskScore > 70 
                                ? 'Your business shows strong fundamentals' 
                                : valuation.riskScore > 40 
                                  ? 'Some improvements needed' 
                                  : 'Significant risk factors identified'}
                            </p>
                            
                            <div className="mt-4">
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Risk Score Breakdown</h5>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="bg-gray-50 p-2 rounded border border-gray-200">
                                  <div className="text-xs text-gray-500">Financial</div>
                                  <div className="text-sm font-medium">{valuation.financialHealthScore}%</div>
                                </div>
                                <div className="bg-gray-50 p-2 rounded border border-gray-200">
                                  <div className="text-xs text-gray-500">Market</div>
                                  <div className="text-sm font-medium">{valuation.marketPositionScore}%</div>
                                </div>
                                <div className="bg-gray-50 p-2 rounded border border-gray-200">
                                  <div className="text-xs text-gray-500">Operational</div>
                                  <div className="text-sm font-medium">{valuation.operationalEfficiencyScore}%</div>
                                </div>
                                <div className="bg-gray-50 p-2 rounded border border-gray-200">
                                  <div className="text-xs text-gray-500">Debt</div>
                                  <div className="text-sm font-medium">{valuation.debtStructureScore}%</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {valuation.redFlags && valuation.redFlags.length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                              <h5 className="text-sm font-medium text-red-800 flex items-center mb-2">
                                <AlertTriangle className="h-4 w-4 mr-1 text-red-700" />
                                Key Risk Factors
                              </h5>
                              <ul className="text-sm text-red-700 space-y-1">
                                {valuation.redFlags.map((flag, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="mr-1">•</span> {flag}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card className="shadow">
                    <CardHeader className="pb-2">
                      <CardTitle>Key Performance Indicators</CardTitle>
                      <CardDescription>Comparison with industry benchmarks</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">Revenue Growth (3yr avg)</span>
                          </div>
                          <div className="flex mb-2 items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                Your Company: 14%
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-semibold inline-block text-gray-600">
                                Industry Average: 18%
                              </span>
                            </div>
                          </div>
                          <BenchmarkChart value={14} average={18} maxValue={30} color="blue" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">Profit Margin</span>
                          </div>
                          <div className="flex mb-2 items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                                Your Company: 22%
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-semibold inline-block text-gray-600">
                                Industry Average: 17%
                              </span>
                            </div>
                          </div>
                          <BenchmarkChart value={22} average={17} maxValue={30} color="green" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">Digital Transformation Index</span>
                          </div>
                          <div className="flex mb-2 items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">
                                Your Company: 42/100
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-semibold inline-block text-gray-600">
                                Industry Average: 68/100
                              </span>
                            </div>
                          </div>
                          <BenchmarkChart value={42} average={68} maxValue={100} color="red" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow">
                    <CardHeader className="pb-2">
                      <CardTitle>Risk Breakdown</CardTitle>
                      <CardDescription>Detailed risk factor analysis</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      {valuation && (
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-gray-700">Financial Health</span>
                              <span className="text-sm font-medium text-gray-700">{valuation.financialHealthScore}%</span>
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
                              <span className="text-sm font-medium text-gray-700">Market Position</span>
                              <span className="text-sm font-medium text-gray-700">{valuation.marketPositionScore}%</span>
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
                              <span className="text-sm font-medium text-gray-700">Operational Efficiency</span>
                              <span className="text-sm font-medium text-gray-700">{valuation.operationalEfficiencyScore}%</span>
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
                              <span className="text-sm font-medium text-gray-700">Debt Structure</span>
                              <span className="text-sm font-medium text-gray-700">{valuation.debtStructureScore}%</span>
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
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="shadow mb-6">
                  <CardHeader className="pb-2">
                    <CardTitle>Improvement Potential</CardTitle>
                    <CardDescription>Estimated valuation increase through improvements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center">
                        <Cpu className="h-8 w-8 text-blue-500 mb-2" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Digital Transformation</h3>
                        <p className="text-2xl font-bold text-blue-600">+15-22%</p>
                        <p className="text-sm text-blue-800">valuation increase</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center">
                        <Activity className="h-8 w-8 text-green-500 mb-2" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Operational Excellence</h3>
                        <p className="text-2xl font-bold text-green-600">+8-14%</p>
                        <p className="text-sm text-green-800">valuation increase</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4 flex flex-col items-center">
                        <Globe className="h-8 w-8 text-purple-500 mb-2" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Market Expansion</h3>
                        <p className="text-2xl font-bold text-purple-600">+10-20%</p>
                        <p className="text-sm text-purple-800">valuation increase</p>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-4 flex flex-col items-center">
                        <Landmark className="h-8 w-8 text-amber-500 mb-2" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Financial Optimization</h3>
                        <p className="text-2xl font-bold text-amber-600">+5-12%</p>
                        <p className="text-sm text-amber-800">valuation increase</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* PESTEL Analysis Tab */}
              <TabsContent value="pestel" className="mt-6">
                <Card className="shadow mb-6">
                  <CardHeader>
                    <CardTitle>PESTEL Analysis</CardTitle>
                    <CardDescription>
                      External factors affecting business value and growth potential
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                        <div className="flex items-center mb-4">
                          <Briefcase className="h-6 w-6 text-gray-700 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-900">Political</h3>
                        </div>
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-sm text-gray-500">Factor Score</span>
                          <span className="text-sm font-medium">{pestelFactors.political.score}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                          <div 
                            className={`${
                              pestelFactors.political.score > 60 ? 'bg-green-500' : 
                              pestelFactors.political.score > 40 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            } h-2 rounded-full`} 
                            style={{ width: `${pestelFactors.political.score}%` }}
                          ></div>
                        </div>
                        <div className="space-y-3">
                          {pestelFactors.political.factors.map((factor, index) => (
                            <div key={index} className="flex items-start justify-between border-b border-gray-200 pb-2">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{factor.name}</p>
                                <p className={`text-xs ${getImpactColor(factor.impact)}`}>Impact: {factor.impact}</p>
                              </div>
                              <div className="flex items-center">
                                {getTrendIcon(factor.trend)}
                                <span className="text-xs ml-1">{factor.trend}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                        <div className="flex items-center mb-4">
                          <Landmark className="h-6 w-6 text-gray-700 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-900">Economic</h3>
                        </div>
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-sm text-gray-500">Factor Score</span>
                          <span className="text-sm font-medium">{pestelFactors.economic.score}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                          <div 
                            className={`${
                              pestelFactors.economic.score > 60 ? 'bg-green-500' : 
                              pestelFactors.economic.score > 40 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            } h-2 rounded-full`} 
                            style={{ width: `${pestelFactors.economic.score}%` }}
                          ></div>
                        </div>
                        <div className="space-y-3">
                          {pestelFactors.economic.factors.map((factor, index) => (
                            <div key={index} className="flex items-start justify-between border-b border-gray-200 pb-2">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{factor.name}</p>
                                <p className={`text-xs ${getImpactColor(factor.impact)}`}>Impact: {factor.impact}</p>
                              </div>
                              <div className="flex items-center">
                                {getTrendIcon(factor.trend)}
                                <span className="text-xs ml-1">{factor.trend}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                        <div className="flex items-center mb-4">
                          <Users className="h-6 w-6 text-gray-700 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-900">Social</h3>
                        </div>
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-sm text-gray-500">Factor Score</span>
                          <span className="text-sm font-medium">{pestelFactors.social.score}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                          <div 
                            className={`${
                              pestelFactors.social.score > 60 ? 'bg-green-500' : 
                              pestelFactors.social.score > 40 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            } h-2 rounded-full`} 
                            style={{ width: `${pestelFactors.social.score}%` }}
                          ></div>
                        </div>
                        <div className="space-y-3">
                          {pestelFactors.social.factors.map((factor, index) => (
                            <div key={index} className="flex items-start justify-between border-b border-gray-200 pb-2">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{factor.name}</p>
                                <p className={`text-xs ${getImpactColor(factor.impact)}`}>Impact: {factor.impact}</p>
                              </div>
                              <div className="flex items-center">
                                {getTrendIcon(factor.trend)}
                                <span className="text-xs ml-1">{factor.trend}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                        <div className="flex items-center mb-4">
                          <Cpu className="h-6 w-6 text-gray-700 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-900">Technological</h3>
                        </div>
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-sm text-gray-500">Factor Score</span>
                          <span className="text-sm font-medium">{pestelFactors.technological.score}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                          <div 
                            className={`${
                              pestelFactors.technological.score > 60 ? 'bg-green-500' : 
                              pestelFactors.technological.score > 40 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            } h-2 rounded-full`} 
                            style={{ width: `${pestelFactors.technological.score}%` }}
                          ></div>
                        </div>
                        <div className="space-y-3">
                          {pestelFactors.technological.factors.map((factor, index) => (
                            <div key={index} className="flex items-start justify-between border-b border-gray-200 pb-2">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{factor.name}</p>
                                <p className={`text-xs ${getImpactColor(factor.impact)}`}>Impact: {factor.impact}</p>
                              </div>
                              <div className="flex items-center">
                                {getTrendIcon(factor.trend)}
                                <span className="text-xs ml-1">{factor.trend}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                        <div className="flex items-center mb-4">
                          <Globe className="h-6 w-6 text-gray-700 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-900">Environmental</h3>
                        </div>
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-sm text-gray-500">Factor Score</span>
                          <span className="text-sm font-medium">{pestelFactors.environmental.score}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                          <div 
                            className={`${
                              pestelFactors.environmental.score > 60 ? 'bg-green-500' : 
                              pestelFactors.environmental.score > 40 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            } h-2 rounded-full`} 
                            style={{ width: `${pestelFactors.environmental.score}%` }}
                          ></div>
                        </div>
                        <div className="space-y-3">
                          {pestelFactors.environmental.factors.map((factor, index) => (
                            <div key={index} className="flex items-start justify-between border-b border-gray-200 pb-2">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{factor.name}</p>
                                <p className={`text-xs ${getImpactColor(factor.impact)}`}>Impact: {factor.impact}</p>
                              </div>
                              <div className="flex items-center">
                                {getTrendIcon(factor.trend)}
                                <span className="text-xs ml-1">{factor.trend}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                        <div className="flex items-center mb-4">
                          <FileText className="h-6 w-6 text-gray-700 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-900">Legal</h3>
                        </div>
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-sm text-gray-500">Factor Score</span>
                          <span className="text-sm font-medium">{pestelFactors.legal.score}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                          <div 
                            className={`${
                              pestelFactors.legal.score > 60 ? 'bg-green-500' : 
                              pestelFactors.legal.score > 40 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            } h-2 rounded-full`} 
                            style={{ width: `${pestelFactors.legal.score}%` }}
                          ></div>
                        </div>
                        <div className="space-y-3">
                          {pestelFactors.legal.factors.map((factor, index) => (
                            <div key={index} className="flex items-start justify-between border-b border-gray-200 pb-2">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{factor.name}</p>
                                <p className={`text-xs ${getImpactColor(factor.impact)}`}>Impact: {factor.impact}</p>
                              </div>
                              <div className="flex items-center">
                                {getTrendIcon(factor.trend)}
                                <span className="text-xs ml-1">{factor.trend}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow mb-6">
                  <CardHeader>
                    <CardTitle>Key PESTEL Insights</CardTitle>
                    <CardDescription>Critical factors affecting business valuation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                        <div>
                          <h4 className="text-base font-medium text-gray-900">Technology Gap</h4>
                          <p className="text-sm text-gray-700">Your technological readiness score (45/100) indicates a significant gap compared to industry standards. This presents both a risk to current valuation and an opportunity for substantial value creation through digital transformation initiatives.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                        <div>
                          <h4 className="text-base font-medium text-gray-900">Favorable Economic Conditions</h4>
                          <p className="text-sm text-gray-700">Strong market growth trends (Economic score: 72/100) create a positive environment for business expansion and valuation increases, particularly if leveraged with the right strategic initiatives.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                        <div>
                          <h4 className="text-base font-medium text-gray-900">Potential Regulatory Changes</h4>
                          <p className="text-sm text-gray-700">While current compliance is strong (Legal score: 78/100), evolving trade policies present a moderate risk factor that should be monitored and incorporated into strategic planning.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                        <div>
                          <h4 className="text-base font-medium text-gray-900">Positive Social Trends</h4>
                          <p className="text-sm text-gray-700">Favorable demographic trends and consumer behavior patterns (Social score: 68/100) align well with business offering, creating opportunities for market expansion and customer base growth.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* SWOT Analysis Tab */}
              <TabsContent value="swot" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card className="shadow bg-green-50">
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <CheckCircle2 className="h-6 w-6 text-green-600 mr-2" />
                        <CardTitle>Strengths</CardTitle>
                      </div>
                      <CardDescription>Internal positive factors</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {swotAnalysis.strengths.map((item, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 border border-green-200">
                            <div className="flex justify-between mb-1">
                              <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${getImpactColor(item.impact)} bg-opacity-20 bg-green-100`}>
                                {item.impact} Impact
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow bg-red-50">
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <Ban className="h-6 w-6 text-red-600 mr-2" />
                        <CardTitle>Weaknesses</CardTitle>
                      </div>
                      <CardDescription>Internal limiting factors</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {swotAnalysis.weaknesses.map((item, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 border border-red-200">
                            <div className="flex justify-between mb-1">
                              <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${getImpactColor(item.impact)} bg-opacity-20 bg-red-100`}>
                                {item.impact} Impact
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card className="shadow bg-blue-50">
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <TrendingUp className="h-6 w-6 text-blue-600 mr-2" />
                        <CardTitle>Opportunities</CardTitle>
                      </div>
                      <CardDescription>External positive factors</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {swotAnalysis.opportunities.map((item, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                            <div className="flex justify-between mb-1">
                              <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${getImpactColor(item.impact)} bg-opacity-20 bg-blue-100`}>
                                {item.impact} Impact
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow bg-amber-50">
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <AlertCircle className="h-6 w-6 text-amber-600 mr-2" />
                        <CardTitle>Threats</CardTitle>
                      </div>
                      <CardDescription>External negative factors</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {swotAnalysis.threats.map((item, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 border border-amber-200">
                            <div className="flex justify-between mb-1">
                              <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${getImpactColor(item.impact)} bg-opacity-20 bg-amber-100`}>
                                {item.impact} Impact
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="shadow mb-6">
                  <CardHeader>
                    <CardTitle>SWOT Insights & Strategic Implications</CardTitle>
                    <CardDescription>Key takeaways for business valuation and strategic planning</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Leverage Strengths to Capture Opportunities</h3>
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <ul className="list-disc ml-5 space-y-2">
                            <li className="text-sm text-gray-700">
                              <span className="font-medium">Strong market position + Market expansion opportunity:</span> Leverage the existing market position to expand into new geographic or demographic segments.
                            </li>
                            <li className="text-sm text-gray-700">
                              <span className="font-medium">Financial stability + Digital transformation opportunity:</span> Use the company's financial resources to invest in digital transformation initiatives for long-term value creation.
                            </li>
                            <li className="text-sm text-gray-700">
                              <span className="font-medium">Customer loyalty + Product diversification opportunity:</span> Build on strong customer relationships to introduce new products or services that meet additional customer needs.
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Address Weaknesses to Mitigate Threats</h3>
                        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                          <ul className="list-disc ml-5 space-y-2">
                            <li className="text-sm text-gray-700">
                              <span className="font-medium">Limited digital presence + Technological disruption threat:</span> Prioritize digital transformation initiatives to avoid falling behind competitors and industry trends.
                            </li>
                            <li className="text-sm text-gray-700">
                              <span className="font-medium">Manual processes + Increasing competition threat:</span> Automate key processes to improve efficiency and maintain competitive pricing and service levels.
                            </li>
                            <li className="text-sm text-gray-700">
                              <span className="font-medium">Talent gaps + Regulatory changes threat:</span> Recruit or develop talent with expertise in compliance and regulatory affairs to stay ahead of changing requirements.
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Valuation Impact Assessment</h3>
                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                          <p className="text-sm text-gray-700 mb-3">
                            Based on the SWOT analysis, the following factors are most likely to impact the company's valuation:
                          </p>
                          <ul className="list-disc ml-5 space-y-2">
                            <li className="text-sm text-gray-700">
                              <span className="font-medium">Most significant positive factors:</span> Strong market position, customer loyalty, market expansion potential
                            </li>
                            <li className="text-sm text-gray-700">
                              <span className="font-medium">Most significant negative factors:</span> Limited digital presence, technological disruption risk, legacy systems
                            </li>
                            <li className="text-sm text-gray-700">
                              <span className="font-medium">Priority improvement areas for valuation increase:</span> Digital transformation, process automation, strategic partnerships
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Risk Assessment Tab */}
              <TabsContent value="risk" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card className="shadow md:col-span-2">
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <Shield className="h-6 w-6 text-gray-700 mr-2" />
                        <CardTitle>Detailed Risk Assessment</CardTitle>
                      </div>
                      <CardDescription>Comprehensive analysis of key risk factors</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      {valuation && (
                        <div className="space-y-6">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="text-base font-medium text-gray-900">Financial Health</h3>
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                valuation.financialHealthScore > 60 ? 'bg-green-100 text-green-800' : 
                                valuation.financialHealthScore > 40 ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'
                              }`}>
                                {valuation.financialHealthScore}% - {
                                  valuation.financialHealthScore > 60 ? 'Strong' : 
                                  valuation.financialHealthScore > 40 ? 'Moderate' : 
                                  'Weak'
                                }
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                              <div 
                                className={`${
                                  valuation.financialHealthScore > 60 ? 'bg-green-500' : 
                                  valuation.financialHealthScore > 40 ? 'bg-yellow-500' : 
                                  'bg-red-500'
                                } h-2 rounded-full`} 
                                style={{ width: `${valuation.financialHealthScore}%` }}
                              ></div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Key Indicators:</h4>
                              <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                                <li>Profit margins trending {valuation.financialHealthScore > 50 ? 'positively' : 'negatively'}</li>
                                <li>Cash flow stability {valuation.financialHealthScore > 60 ? 'strong' : valuation.financialHealthScore > 40 ? 'adequate' : 'concerning'}</li>
                                <li>Debt-to-equity ratio {valuation.financialHealthScore > 60 ? 'healthy' : valuation.financialHealthScore > 40 ? 'moderate' : 'high'}</li>
                                <li>Revenue growth {valuation.financialHealthScore > 60 ? 'exceeding' : valuation.financialHealthScore > 40 ? 'meeting' : 'below'} expectations</li>
                              </ul>
                              <h4 className="text-sm font-medium text-gray-900 mt-4 mb-2">Risk Mitigation Recommendations:</h4>
                              <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                                {valuation.financialHealthScore <= 60 && <li>Implement stronger cash flow management and forecasting</li>}
                                {valuation.financialHealthScore <= 50 && <li>Develop a debt restructuring plan to optimize interest expenses</li>}
                                {valuation.financialHealthScore <= 40 && <li>Conduct comprehensive financial audit and recovery planning</li>}
                                <li>Establish stronger financial controls and reporting mechanisms</li>
                              </ul>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="text-base font-medium text-gray-900">Market Position</h3>
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                valuation.marketPositionScore > 60 ? 'bg-green-100 text-green-800' : 
                                valuation.marketPositionScore > 40 ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'
                              }`}>
                                {valuation.marketPositionScore}% - {
                                  valuation.marketPositionScore > 60 ? 'Strong' : 
                                  valuation.marketPositionScore > 40 ? 'Moderate' : 
                                  'Weak'
                                }
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                              <div 
                                className={`${
                                  valuation.marketPositionScore > 60 ? 'bg-green-500' : 
                                  valuation.marketPositionScore > 40 ? 'bg-yellow-500' : 
                                  'bg-red-500'
                                } h-2 rounded-full`} 
                                style={{ width: `${valuation.marketPositionScore}%` }}
                              ></div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Key Indicators:</h4>
                              <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                                <li>Market share {valuation.marketPositionScore > 60 ? 'growing' : valuation.marketPositionScore > 40 ? 'stable' : 'declining'}</li>
                                <li>Brand recognition {valuation.marketPositionScore > 60 ? 'strong' : valuation.marketPositionScore > 40 ? 'moderate' : 'limited'}</li>
                                <li>Competitive position {valuation.marketPositionScore > 60 ? 'leading' : valuation.marketPositionScore > 40 ? 'competitive' : 'lagging'}</li>
                                <li>Customer satisfaction {valuation.marketPositionScore > 60 ? 'excellent' : valuation.marketPositionScore > 40 ? 'good' : 'needs improvement'}</li>
                              </ul>
                              <h4 className="text-sm font-medium text-gray-900 mt-4 mb-2">Risk Mitigation Recommendations:</h4>
                              <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                                {valuation.marketPositionScore <= 60 && <li>Develop a comprehensive brand strengthening strategy</li>}
                                {valuation.marketPositionScore <= 50 && <li>Implement customer retention and loyalty programs</li>}
                                {valuation.marketPositionScore <= 40 && <li>Conduct market repositioning analysis</li>}
                                <li>Regular competitive analysis and strategic response planning</li>
                              </ul>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="text-base font-medium text-gray-900">Operational Efficiency</h3>
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                valuation.operationalEfficiencyScore > 60 ? 'bg-green-100 text-green-800' : 
                                valuation.operationalEfficiencyScore > 40 ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'
                              }`}>
                                {valuation.operationalEfficiencyScore}% - {
                                  valuation.operationalEfficiencyScore > 60 ? 'Strong' : 
                                  valuation.operationalEfficiencyScore > 40 ? 'Moderate' : 
                                  'Weak'
                                }
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                              <div 
                                className={`${
                                  valuation.operationalEfficiencyScore > 60 ? 'bg-green-500' : 
                                  valuation.operationalEfficiencyScore > 40 ? 'bg-yellow-500' : 
                                  'bg-red-500'
                                } h-2 rounded-full`} 
                                style={{ width: `${valuation.operationalEfficiencyScore}%` }}
                              ></div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Key Indicators:</h4>
                              <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                                <li>Process automation {valuation.operationalEfficiencyScore > 60 ? 'advanced' : valuation.operationalEfficiencyScore > 40 ? 'partial' : 'minimal'}</li>
                                <li>Technology infrastructure {valuation.operationalEfficiencyScore > 60 ? 'modern' : valuation.operationalEfficiencyScore > 40 ? 'adequate' : 'outdated'}</li>
                                <li>Operational costs {valuation.operationalEfficiencyScore > 60 ? 'optimized' : valuation.operationalEfficiencyScore > 40 ? 'manageable' : 'excessive'}</li>
                                <li>Quality control {valuation.operationalEfficiencyScore > 60 ? 'excellent' : valuation.operationalEfficiencyScore > 40 ? 'adequate' : 'inconsistent'}</li>
                              </ul>
                              <h4 className="text-sm font-medium text-gray-900 mt-4 mb-2">Risk Mitigation Recommendations:</h4>
                              <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                                {valuation.operationalEfficiencyScore <= 60 && <li>Implement process automation for key business functions</li>}
                                {valuation.operationalEfficiencyScore <= 50 && <li>Conduct technology infrastructure assessment and upgrade</li>}
                                {valuation.operationalEfficiencyScore <= 40 && <li>Comprehensive operational restructuring</li>}
                                <li>Establish ongoing efficiency improvement programs</li>
                              </ul>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="text-base font-medium text-gray-900">Debt Structure</h3>
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                valuation.debtStructureScore > 60 ? 'bg-green-100 text-green-800' : 
                                valuation.debtStructureScore > 40 ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'
                              }`}>
                                {valuation.debtStructureScore}% - {
                                  valuation.debtStructureScore > 60 ? 'Strong' : 
                                  valuation.debtStructureScore > 40 ? 'Moderate' : 
                                  'Weak'
                                }
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                              <div 
                                className={`${
                                  valuation.debtStructureScore > 60 ? 'bg-green-500' : 
                                  valuation.debtStructureScore > 40 ? 'bg-yellow-500' : 
                                  'bg-red-500'
                                } h-2 rounded-full`} 
                                style={{ width: `${valuation.debtStructureScore}%` }}
                              ></div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Key Indicators:</h4>
                              <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                                <li>Debt to equity ratio {valuation.debtStructureScore > 60 ? 'low' : valuation.debtStructureScore > 40 ? 'moderate' : 'high'}</li>
                                <li>Interest coverage ratio {valuation.debtStructureScore > 60 ? 'strong' : valuation.debtStructureScore > 40 ? 'adequate' : 'weak'}</li>
                                <li>Debt terms {valuation.debtStructureScore > 60 ? 'favorable' : valuation.debtStructureScore > 40 ? 'standard' : 'restrictive'}</li>
                                <li>Debt maturity profile {valuation.debtStructureScore > 60 ? 'well-distributed' : valuation.debtStructureScore > 40 ? 'manageable' : 'concerning'}</li>
                              </ul>
                              <h4 className="text-sm font-medium text-gray-900 mt-4 mb-2">Risk Mitigation Recommendations:</h4>
                              <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                                {valuation.debtStructureScore <= 60 && <li>Refinance existing debt to improve terms and rates</li>}
                                {valuation.debtStructureScore <= 50 && <li>Implement debt reduction strategy</li>}
                                {valuation.debtStructureScore <= 40 && <li>Consider debt restructuring with professional advisory</li>}
                                <li>Establish stronger debt management policies</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <AlertCircle className="h-6 w-6 text-gray-700 mr-2" />
                        <CardTitle>Red Flags & Major Concerns</CardTitle>
                      </div>
                      <CardDescription>Critical issues requiring attention</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="bg-red-50 border-l-4 border-red-400 p-4">
                          <div className="flex items-start">
                            <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                            <div>
                              <h3 className="text-sm font-medium text-red-800">Digital Transformation Gap</h3>
                              <p className="mt-1 text-sm text-red-700">
                                Digital maturity significantly below industry average (42 vs 68), creating competitive vulnerability and limiting growth potential.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                          <div className="flex items-start">
                            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                            <div>
                              <h3 className="text-sm font-medium text-yellow-800">Legacy Systems Dependencies</h3>
                              <p className="mt-1 text-sm text-yellow-700">
                                Critical business operations still dependent on outdated technology infrastructure, creating operational risk and efficiency barriers.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                          <div className="flex items-start">
                            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                            <div>
                              <h3 className="text-sm font-medium text-yellow-800">Market Diversification</h3>
                              <p className="mt-1 text-sm text-yellow-700">
                                Overreliance on core market segments creates vulnerability to market shifts and limits growth opportunities.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                          <div className="flex items-start">
                            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                            <div>
                              <h3 className="text-sm font-medium text-yellow-800">Technical Talent Gaps</h3>
                              <p className="mt-1 text-sm text-yellow-700">
                                Insufficient skilled personnel in key technical areas could hinder implementation of necessary improvement initiatives.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="text-base font-medium text-gray-900 mb-3">Risk Severity Matrix</h3>
                        <div className="overflow-hidden rounded-lg border border-gray-200">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Factor</th>
                                <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                                <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Valuation Impact</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Digital Transformation Gap</td>
                                <td className="px-4 py-3 whitespace-nowrap text-center">
                                  <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">High</span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-700">-15% to -25%</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Legacy Systems</td>
                                <td className="px-4 py-3 whitespace-nowrap text-center">
                                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Medium</span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-700">-10% to -15%</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Market Diversification</td>
                                <td className="px-4 py-3 whitespace-nowrap text-center">
                                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Medium</span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-700">-8% to -12%</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Technical Talent Gaps</td>
                                <td className="px-4 py-3 whitespace-nowrap text-center">
                                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Medium</span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-700">-5% to -10%</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Documents Tab */}
              <TabsContent value="documents" className="mt-6">
                <div className="space-y-6">
                  <Card className="shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <FileBarChart className="h-6 w-6 text-gray-700 mr-2" />
                        <CardTitle>Document Analysis</CardTitle>
                      </div>
                      <CardDescription>
                        Comprehensive analysis of financial and legal documents
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      {companyId ? (
                        <ComprehensiveDocumentAnalysis 
                          companyId={companyId as number}
                        />
                      ) : (
                        <div className="text-center p-8">
                          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No Company Selected</h3>
                          <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
                            Please select a company to view document analysis.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Improvement Opportunities Tab */}
              <TabsContent value="improvement" className="mt-6">
                <Card className="shadow mb-6">
                  <CardHeader>
                    <div className="flex items-center">
                      <TrendingUp className="h-6 w-6 text-gray-700 mr-2" />
                      <CardTitle>Improvement Opportunities</CardTitle>
                    </div>
                    <CardDescription>Strategic initiatives to increase business valuation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {improvementOpportunities.map((category, index) => (
                        <div key={index}>
                          <div className="flex items-center mb-4">
                            <div className={`w-10 h-10 rounded-full ${
                              index === 0 ? 'bg-blue-100' :
                              index === 1 ? 'bg-green-100' :
                              index === 2 ? 'bg-purple-100' :
                              'bg-amber-100'
                            } flex items-center justify-center mr-3`}>
                              <span className={`${
                                index === 0 ? 'text-blue-600' :
                                index === 1 ? 'text-green-600' :
                                index === 2 ? 'text-purple-600' :
                                'text-amber-600'
                              } font-bold`}>{index + 1}</span>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">{category.category}</h3>
                          </div>
                          
                          <div className="overflow-hidden rounded-lg border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Initiative</th>
                                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Valuation Impact</th>
                                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Timeframe</th>
                                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Complexity</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {category.initiatives.map((initiative, idx) => (
                                  <tr key={idx}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{initiative.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                      <span className={`px-2 py-1 text-xs font-medium ${
                                        index === 0 ? 'bg-blue-100 text-blue-800' :
                                        index === 1 ? 'bg-green-100 text-green-800' :
                                        index === 2 ? 'bg-purple-100 text-purple-800' :
                                        'bg-amber-100 text-amber-800'
                                      } rounded-full`}>
                                        {initiative.valuationImpact}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">{initiative.timeframe}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                      <span className={`px-2 py-1 text-xs font-medium ${
                                        initiative.complexity === 'High' ? 'bg-red-100 text-red-800' :
                                        initiative.complexity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-green-100 text-green-800'
                                      } rounded-full`}>
                                        {initiative.complexity}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card className="shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <Award className="h-6 w-6 text-gray-700 mr-2" />
                        <CardTitle>Priority Initiatives</CardTitle>
                      </div>
                      <CardDescription>High-impact, near-term opportunities</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <h3 className="text-base font-medium text-gray-900 mb-1">CRM Implementation</h3>
                          <div className="flex space-x-2 mb-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              +10-15% Valuation Impact
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              6-12 Months
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-3">
                            Implementing a modern customer relationship management system would address several critical weaknesses:
                          </p>
                          <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                            <li>Improve customer data management and insights</li>
                            <li>Enable personalized customer interactions</li>
                            <li>Streamline sales processes and increase conversion rates</li>
                            <li>Create foundation for data-driven decision making</li>
                          </ul>
                        </div>
                        
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <h3 className="text-base font-medium text-gray-900 mb-1">Process Automation</h3>
                          <div className="flex space-x-2 mb-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              +7-12% Valuation Impact
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              3-6 Months
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-3">
                            Automating key business processes would provide significant efficiency improvements:
                          </p>
                          <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                            <li>Reduce operational costs and human error</li>
                            <li>Increase throughput and processing capacity</li>
                            <li>Improve data consistency and reporting accuracy</li>
                            <li>Free up resources for higher-value activities</li>
                          </ul>
                        </div>
                        
                        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                          <h3 className="text-base font-medium text-gray-900 mb-1">Debt Restructuring</h3>
                          <div className="flex space-x-2 mb-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              +5-10% Valuation Impact
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              3-6 Months
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-3">
                            Optimizing the debt structure would strengthen financial position:
                          </p>
                          <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                            <li>Reduce interest expenses and improve cash flow</li>
                            <li>Extend debt maturity profile for greater stability</li>
                            <li>Secure more favorable terms and covenants</li>
                            <li>Improve key financial ratios and credit profile</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <PieChart className="h-6 w-6 text-gray-700 mr-2" />
                        <CardTitle>Valuation Enhancement Scenarios</CardTitle>
                      </div>
                      <CardDescription>Projected outcomes based on implementation levels</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-base font-medium text-gray-900 mb-3">Conservative Scenario (Basic Improvements)</h3>
                          <div className="bg-blue-50 rounded-lg p-4">
                            <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
                              <li>CRM implementation (basic features)</li>
                              <li>Limited process automation (2-3 key processes)</li>
                              <li>Minor debt refinancing</li>
                            </ul>
                            <div className="mt-4 flex justify-between items-center p-3 bg-white rounded border border-blue-200">
                              <span className="text-sm font-medium text-gray-900">Estimated Valuation Increase:</span>
                              <span className="text-lg font-bold text-blue-600">+15-20%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-base font-medium text-gray-900 mb-3">Moderate Scenario (Strategic Improvements)</h3>
                          <div className="bg-green-50 rounded-lg p-4">
                            <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
                              <li>Full CRM implementation with customer analytics</li>
                              <li>Comprehensive process automation program</li>
                              <li>E-commerce channel development</li>
                              <li>Complete debt restructuring</li>
                            </ul>
                            <div className="mt-4 flex justify-between items-center p-3 bg-white rounded border border-green-200">
                              <span className="text-sm font-medium text-gray-900">Estimated Valuation Increase:</span>
                              <span className="text-lg font-bold text-green-600">+25-35%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-base font-medium text-gray-900 mb-3">Aggressive Scenario (Transformational Change)</h3>
                          <div className="bg-purple-50 rounded-lg p-4">
                            <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
                              <li>Comprehensive digital transformation</li>
                              <li>AI/ML implementation for core processes</li>
                              <li>New market expansion</li>
                              <li>Product/service diversification</li>
                              <li>Complete operational restructuring</li>
                            </ul>
                            <div className="mt-4 flex justify-between items-center p-3 bg-white rounded border border-purple-200">
                              <span className="text-sm font-medium text-gray-900">Estimated Valuation Increase:</span>
                              <span className="text-lg font-bold text-purple-600">+40-60%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="shadow mb-6">
                  <CardHeader>
                    <CardTitle>Implementation Roadmap</CardTitle>
                    <CardDescription>Phased approach to value enhancement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="relative">
                        <div className="absolute left-8 top-0 h-full w-0.5 bg-gray-200"></div>
                        
                        <div className="relative flex items-start mb-8">
                          <div className="flex-shrink-0">
                            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center z-10 relative">
                              <span className="text-blue-600 font-bold">1</span>
                            </div>
                          </div>
                          <div className="ml-6 mt-3">
                            <h3 className="text-lg font-semibold text-gray-900">Phase 1: Foundation Building (0-6 months)</h3>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <h4 className="text-base font-medium text-gray-900 mb-2">Key Activities</h4>
                                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                                  <li>Conduct comprehensive digital assessment</li>
                                  <li>Implement CRM system core functionality</li>
                                  <li>Automate 2-3 highest-impact processes</li>
                                  <li>Refinance highest-cost debt</li>
                                  <li>Recruit key technical talent</li>
                                </ul>
                              </div>
                              <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <h4 className="text-base font-medium text-gray-900 mb-2">Expected Outcomes</h4>
                                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                                  <li>Initial efficiency improvements</li>
                                  <li>Improved customer data management</li>
                                  <li>Reduced interest expenses</li>
                                  <li>Technical capabilities to enable further improvements</li>
                                  <li>5-10% valuation improvement</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="relative flex items-start mb-8">
                          <div className="flex-shrink-0">
                            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center z-10 relative">
                              <span className="text-green-600 font-bold">2</span>
                            </div>
                          </div>
                          <div className="ml-6 mt-3">
                            <h3 className="text-lg font-semibold text-gray-900">Phase 2: Process Optimization (6-12 months)</h3>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <h4 className="text-base font-medium text-gray-900 mb-2">Key Activities</h4>
                                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                                  <li>Expand CRM with advanced analytics</li>
                                  <li>Implement comprehensive process automation</li>
                                  <li>Develop e-commerce capabilities</li>
                                  <li>Complete debt restructuring</li>
                                  <li>Enhance data analytics capabilities</li>
                                </ul>
                              </div>
                              <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <h4 className="text-base font-medium text-gray-900 mb-2">Expected Outcomes</h4>
                                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                                  <li>Significant operational efficiency improvements</li>
                                  <li>New digital revenue channels</li>
                                  <li>Enhanced customer relationships</li>
                                  <li>Optimized financial structure</li>
                                  <li>Additional 10-15% valuation improvement</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="relative flex items-start">
                          <div className="flex-shrink-0">
                            <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center z-10 relative">
                              <span className="text-purple-600 font-bold">3</span>
                            </div>
                          </div>
                          <div className="ml-6 mt-3">
                            <h3 className="text-lg font-semibold text-gray-900">Phase 3: Strategic Expansion (12-24 months)</h3>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <h4 className="text-base font-medium text-gray-900 mb-2">Key Activities</h4>
                                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                                  <li>Enter new market segments</li>
                                  <li>Implement AI-powered operations</li>
                                  <li>Develop strategic partnerships</li>
                                  <li>Introduce product/service innovations</li>
                                  <li>Optimize organizational structure</li>
                                </ul>
                              </div>
                              <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <h4 className="text-base font-medium text-gray-900 mb-2">Expected Outcomes</h4>
                                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                                  <li>Diversified revenue streams</li>
                                  <li>Enhanced competitive positioning</li>
                                  <li>Increased market share</li>
                                  <li>Intelligent operations driving efficiency</li>
                                  <li>Additional 15-25% valuation improvement</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Advanced Analysis Tab */}
              <TabsContent value="advanced" className="mt-6">
                <div className="grid grid-cols-1 gap-6 mb-6">
                  <Card className="shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <PieChart className="h-6 w-6 text-gray-700 mr-2" />
                        <CardTitle>Financial Performance & Benchmarking</CardTitle>
                      </div>
                      <CardDescription>Detailed financial analysis compared to industry benchmarks</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Financial Health Assessment</h3>
                          <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <h4 className="text-sm font-medium text-gray-900 mb-2">3-Year Financial Trend Analysis</h4>
                              <div className="space-y-2">
                                <div>
                                  <div className="flex justify-between text-sm">
                                    <span>Revenue Growth Rate</span>
                                    <span className="font-medium text-green-600">+14%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '70%' }}></div>
                                  </div>
                                </div>
                                <div>
                                  <div className="flex justify-between text-sm">
                                    <span>EBITDA Margin</span>
                                    <span className="font-medium text-green-600">22%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                                  </div>
                                </div>
                                <div>
                                  <div className="flex justify-between text-sm">
                                    <span>Working Capital Ratio</span>
                                    <span className="font-medium text-amber-600">1.3</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                    <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '50%' }}></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                              <h4 className="text-sm font-medium text-blue-900 mb-2">Key Insights</h4>
                              <ul className="text-sm text-blue-800 space-y-1 list-disc pl-4">
                                <li>Revenue growth exceeds debt growth, indicating healthy expansion</li>
                                <li>EBITDA margins are 5% above sector average, showing operational efficiency</li>
                                <li>Working capital needs attention to improve liquidity position</li>
                                <li>ROI on marketing spend shows 15% higher efficiency than industry average</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Industry Benchmarking</h3>
                          <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Performance vs. Industry Quartiles</h4>
                              <div className="space-y-3">
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>Revenue Growth</span>
                                    <span className="text-xs text-gray-500">Industry Range: 5-22%</span>
                                  </div>
                                  <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="absolute top-0 bottom-0 left-0 bg-blue-100" style={{ width: '25%' }}></div>
                                    <div className="absolute top-0 bottom-0 left-0 bg-blue-200" style={{ width: '50%' }}></div>
                                    <div className="absolute top-0 bottom-0 left-0 bg-blue-300" style={{ width: '75%' }}></div>
                                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-black" style={{ left: '63%' }}></div>
                                    <div className="absolute top-1 text-xs font-semibold" style={{ left: '63%' }}>You</div>
                                  </div>
                                  <div className="flex justify-between text-xs mt-1">
                                    <span>25th</span>
                                    <span>50th</span>
                                    <span>75th</span>
                                    <span>100th</span>
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>Profit Margin</span>
                                    <span className="text-xs text-gray-500">Industry Range: 8-25%</span>
                                  </div>
                                  <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="absolute top-0 bottom-0 left-0 bg-green-100" style={{ width: '25%' }}></div>
                                    <div className="absolute top-0 bottom-0 left-0 bg-green-200" style={{ width: '50%' }}></div>
                                    <div className="absolute top-0 bottom-0 left-0 bg-green-300" style={{ width: '75%' }}></div>
                                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-black" style={{ left: '82%' }}></div>
                                    <div className="absolute top-1 text-xs font-semibold" style={{ left: '82%' }}>You</div>
                                  </div>
                                  <div className="flex justify-between text-xs mt-1">
                                    <span>25th</span>
                                    <span>50th</span>
                                    <span>75th</span>
                                    <span>100th</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                              <h4 className="text-sm font-medium text-green-900 mb-2">Improvement Recommendations</h4>
                              <ul className="text-sm text-green-800 space-y-1 list-disc pl-4">
                                <li>Optimize inventory management to improve working capital ratio</li>
                                <li>Refinance high-interest debt to reduce financial expenses</li>
                                <li>Implement cash flow forecasting system to better manage seasonal fluctuations</li>
                                <li>Consider factoring or supply chain financing options</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <Users className="h-6 w-6 text-gray-700 mr-2" />
                        <CardTitle>Customer & Market Analysis</CardTitle>
                      </div>
                      <CardDescription>Customer demographics, market positioning, and competitive landscape</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Customer Concentration Analysis</h3>
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                            <div className="flex justify-between mb-1">
                              <h4 className="text-sm font-medium text-gray-900">Revenue Distribution</h4>
                              <span className="text-xs text-gray-500">Risk Level</span>
                            </div>
                            <div className="space-y-3 mt-3">
                              <div>
                                <div className="flex justify-between text-sm">
                                  <span>Top 3 customers</span>
                                  <span className="font-medium text-amber-600">35%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                                </div>
                                <div className="text-right text-xs text-amber-600 mt-0.5">Moderate Risk</div>
                              </div>
                              <div>
                                <div className="flex justify-between text-sm">
                                  <span>Top 10 customers</span>
                                  <span className="font-medium text-green-600">52%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '52%' }}></div>
                                </div>
                                <div className="text-right text-xs text-green-600 mt-0.5">Low Risk</div>
                              </div>
                              <div>
                                <div className="flex justify-between text-sm">
                                  <span>Single industry exposure</span>
                                  <span className="font-medium text-red-600">68%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                                </div>
                                <div className="text-right text-xs text-red-600 mt-0.5">High Risk</div>
                              </div>
                            </div>
                          </div>
                          
                          <h3 className="text-lg font-semibold mb-3">Market Position Analysis</h3>
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                            <h4 className="text-sm font-medium text-blue-900 mb-2">Competitive Analysis</h4>
                            <div className="text-sm text-blue-800">
                              <p className="mb-2">Your business ranks in the top 30% of competitors based on:</p>
                              <ul className="list-disc pl-4 space-y-1">
                                <li>Brand recognition (regional)</li>
                                <li>Customer satisfaction scores</li>
                                <li>Pricing premium sustainability</li>
                                <li>Market share growth rate</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Market Trends & Opportunity</h3>
                          <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Market Growth Analysis</h4>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white p-3 rounded border border-gray-100 text-center">
                                  <div className="text-xs text-gray-500 mb-1">Industry CAGR</div>
                                  <div className="text-2xl font-bold text-gray-800">8.2%</div>
                                  <div className="text-xs text-gray-500 mt-1">5-yr forecast</div>
                                </div>
                                <div className="bg-white p-3 rounded border border-gray-100 text-center">
                                  <div className="text-xs text-gray-500 mb-1">Your Growth</div>
                                  <div className="text-2xl font-bold text-blue-600">14.5%</div>
                                  <div className="text-xs text-gray-500 mt-1">3-yr average</div>
                                </div>
                                <div className="bg-white p-3 rounded border border-gray-100 text-center">
                                  <div className="text-xs text-gray-500 mb-1">Market Share</div>
                                  <div className="text-2xl font-bold text-gray-800">4.8%</div>
                                  <div className="text-xs text-gray-500 mt-1">Current</div>
                                </div>
                                <div className="bg-white p-3 rounded border border-gray-100 text-center">
                                  <div className="text-xs text-gray-500 mb-1">Growth Potential</div>
                                  <div className="text-2xl font-bold text-green-600">High</div>
                                  <div className="text-xs text-gray-500 mt-1">Assessment</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                              <h4 className="text-sm font-medium text-purple-900 mb-2">Market Opportunity & Threats</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h5 className="text-xs font-semibold text-purple-900 mb-1">Opportunities</h5>
                                  <ul className="text-xs text-purple-800 space-y-1 list-disc pl-4">
                                    <li>Emerging segment growing at 22%</li>
                                    <li>Digital channel expansion</li>
                                    <li>Product line extension potential</li>
                                    <li>International market entry</li>
                                  </ul>
                                </div>
                                <div>
                                  <h5 className="text-xs font-semibold text-purple-900 mb-1">Threats</h5>
                                  <ul className="text-xs text-purple-800 space-y-1 list-disc pl-4">
                                    <li>New market entrants</li>
                                    <li>Regulatory changes pending</li>
                                    <li>Price pressure from competitors</li>
                                    <li>Changing consumer preferences</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <Activity className="h-6 w-6 text-gray-700 mr-2" />
                        <CardTitle>Operational Efficiency</CardTitle>
                      </div>
                      <CardDescription>Processes, systems, and productivity analysis</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Process Efficiency Analysis</h3>
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Key Operational Metrics</h4>
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between text-sm">
                                  <span>Production Efficiency</span>
                                  <span className="font-medium text-green-600">84%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '84%' }}></div>
                                </div>
                                <div className="text-right text-xs text-green-600 mt-0.5">Strong (Industry avg: 72%)</div>
                              </div>
                              <div>
                                <div className="flex justify-between text-sm">
                                  <span>Order-to-Delivery Time</span>
                                  <span className="font-medium text-amber-600">10 days</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                                </div>
                                <div className="text-right text-xs text-amber-600 mt-0.5">Average (Industry avg: 9 days)</div>
                              </div>
                              <div>
                                <div className="flex justify-between text-sm">
                                  <span>Quality Control Metrics</span>
                                  <span className="font-medium text-green-600">99.2%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                                </div>
                                <div className="text-right text-xs text-green-600 mt-0.5">Excellent (Industry avg: 98.1%)</div>
                              </div>
                              <div>
                                <div className="flex justify-between text-sm">
                                  <span>Resource Utilization</span>
                                  <span className="font-medium text-red-600">68%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                                </div>
                                <div className="text-right text-xs text-red-600 mt-0.5">Below Average (Industry avg: 80%)</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                            <h4 className="text-sm font-medium text-amber-900 mb-2">Improvement Opportunities</h4>
                            <ul className="text-sm text-amber-800 space-y-1 list-disc pl-4">
                              <li>Implement advanced inventory management system (Est. ROI: 32%)</li>
                              <li>Streamline supply chain with vendor consolidation (Est. ROI: 18%)</li>
                              <li>Automate quality control processes (Est. ROI: 25%)</li>
                              <li>Optimize facility layout for improved workflow (Est. ROI: 15%)</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Management & Human Capital</h3>
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Organizational Effectiveness</h4>
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between text-sm">
                                  <span>Management Experience</span>
                                  <span className="font-medium text-green-600">Strong</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                                </div>
                                <div className="text-right text-xs text-green-600 mt-0.5">Avg. 12+ years industry experience</div>
                              </div>
                              <div>
                                <div className="flex justify-between text-sm">
                                  <span>Employee Retention</span>
                                  <span className="font-medium text-amber-600">Moderate</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                                </div>
                                <div className="text-right text-xs text-amber-600 mt-0.5">Annual turnover: 18% (Industry avg: 15%)</div>
                              </div>
                              <div>
                                <div className="flex justify-between text-sm">
                                  <span>Skill Gaps</span>
                                  <span className="font-medium text-red-600">Significant</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                                </div>
                                <div className="text-right text-xs text-red-600 mt-0.5">Digital skills gap identified</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                            <h4 className="text-sm font-medium text-blue-900 mb-2">Technology & IP Analysis</h4>
                            <div className="space-y-4">
                              <div>
                                <h5 className="text-xs font-semibold text-blue-900 mb-1">Technology Assessment</h5>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="bg-white p-2 rounded border border-blue-100 text-center">
                                    <div className="text-xs text-gray-500 mb-1">Tech Stack Age</div>
                                    <div className="text-sm font-bold text-red-600">5.3 years</div>
                                  </div>
                                  <div className="bg-white p-2 rounded border border-blue-100 text-center">
                                    <div className="text-xs text-gray-500 mb-1">Automation Level</div>
                                    <div className="text-sm font-bold text-amber-600">Medium</div>
                                  </div>
                                  <div className="bg-white p-2 rounded border border-blue-100 text-center">
                                    <div className="text-xs text-gray-500 mb-1">Digital Integration</div>
                                    <div className="text-sm font-bold text-red-600">Low</div>
                                  </div>
                                  <div className="bg-white p-2 rounded border border-blue-100 text-center">
                                    <div className="text-xs text-gray-500 mb-1">Data Utilization</div>
                                    <div className="text-sm font-bold text-red-600">Limited</div>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h5 className="text-xs font-semibold text-blue-900 mb-1">IP Portfolio Value</h5>
                                <div className="grid grid-cols-1 gap-2">
                                  <div className="bg-white p-2 rounded border border-blue-100">
                                    <div className="flex justify-between">
                                      <div className="text-xs">Patents & Trademarks</div>
                                      <div className="text-xs font-semibold">2 registered, 1 pending</div>
                                    </div>
                                  </div>
                                  <div className="bg-white p-2 rounded border border-blue-100">
                                    <div className="flex justify-between">
                                      <div className="text-xs">Proprietary Tech/Methods</div>
                                      <div className="text-xs font-semibold">Estimated Value: $1.2M</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <Globe className="h-6 w-6 text-gray-700 mr-2" />
                        <CardTitle>ESG Analysis</CardTitle>
                      </div>
                      <CardDescription>Environmental, Social & Governance factors</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-green-900">Environmental</h3>
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              Score: 68/100
                            </span>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-green-800">Carbon Footprint</span>
                                <span className="text-green-800 font-medium">Moderate</span>
                              </div>
                              <div className="w-full bg-green-200 rounded-full h-1.5">
                                <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-green-800">Resource Efficiency</span>
                                <span className="text-green-800 font-medium">Good</span>
                              </div>
                              <div className="w-full bg-green-200 rounded-full h-1.5">
                                <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-green-800">Sustainability Initiatives</span>
                                <span className="text-green-800 font-medium">Limited</span>
                              </div>
                              <div className="w-full bg-green-200 rounded-full h-1.5">
                                <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 text-sm text-green-800">
                            <p>Environmental practices represent valuation premium potential of 5-8% for strategic buyers focused on sustainability.</p>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-blue-900">Social</h3>
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                              Score: 72/100
                            </span>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-blue-800">Employee Welfare</span>
                                <span className="text-blue-800 font-medium">Strong</span>
                              </div>
                              <div className="w-full bg-blue-200 rounded-full h-1.5">
                                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '82%' }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-blue-800">Community Engagement</span>
                                <span className="text-blue-800 font-medium">Good</span>
                              </div>
                              <div className="w-full bg-blue-200 rounded-full h-1.5">
                                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '70%' }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-blue-800">Diversity & Inclusion</span>
                                <span className="text-blue-800 font-medium">Moderate</span>
                              </div>
                              <div className="w-full bg-blue-200 rounded-full h-1.5">
                                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 text-sm text-blue-800">
                            <p>Social responsibility practices are aligned with industry standards, supporting company reputation and customer loyalty.</p>
                          </div>
                        </div>
                        
                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-purple-900">Governance</h3>
                            <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                              Score: 81/100
                            </span>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-purple-800">Board Structure</span>
                                <span className="text-purple-800 font-medium">Strong</span>
                              </div>
                              <div className="w-full bg-purple-200 rounded-full h-1.5">
                                <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-purple-800">Compliance</span>
                                <span className="text-purple-800 font-medium">Excellent</span>
                              </div>
                              <div className="w-full bg-purple-200 rounded-full h-1.5">
                                <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '90%' }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-purple-800">Ethical Standards</span>
                                <span className="text-purple-800 font-medium">Good</span>
                              </div>
                              <div className="w-full bg-purple-200 rounded-full h-1.5">
                                <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 text-sm text-purple-800">
                            <p>Strong governance framework reduces risk profile and increases attractiveness to potential acquirers and investors.</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Exit Strategy Tab */}
              <TabsContent value="exit" className="mt-6">
                <div className="grid grid-cols-1 gap-6 mb-6">
                  <Card className="shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <Briefcase className="h-6 w-6 text-gray-700 mr-2" />
                        <CardTitle>Exit Strategy Analysis</CardTitle>
                      </div>
                      <CardDescription>Potential exit scenarios and optimal timing</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <h3 className="text-lg font-semibold mb-3">Exit Readiness Assessment</h3>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium text-gray-700">Overall Exit Readiness</span>
                                  <span className="text-sm font-medium text-amber-600">68/100</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '68%' }}></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>Not Ready</span>
                                  <span>Needs Work</span>
                                  <span>Ready</span>
                                  <span>Optimal</span>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                <div className="bg-white p-3 rounded border border-gray-200">
                                  <div className="text-xs text-gray-500 mb-1">Financial Readiness</div>
                                  <div className="flex items-center">
                                    <span className="text-lg font-semibold text-gray-900 mr-2">75/100</span>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-white p-3 rounded border border-gray-200">
                                  <div className="text-xs text-gray-500 mb-1">Operational Readiness</div>
                                  <div className="flex items-center">
                                    <span className="text-lg font-semibold text-gray-900 mr-2">62/100</span>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                      <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '62%' }}></div>
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-white p-3 rounded border border-gray-200">
                                  <div className="text-xs text-gray-500 mb-1">Market Timing</div>
                                  <div className="flex items-center">
                                    <span className="text-lg font-semibold text-gray-900 mr-2">70/100</span>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '70%' }}></div>
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-white p-3 rounded border border-gray-200">
                                  <div className="text-xs text-gray-500 mb-1">Documentation</div>
                                  <div className="flex items-center">
                                    <span className="text-lg font-semibold text-gray-900 mr-2">55/100</span>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                      <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '55%' }}></div>
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-white p-3 rounded border border-gray-200">
                                  <div className="text-xs text-gray-500 mb-1">Legal Structure</div>
                                  <div className="flex items-center">
                                    <span className="text-lg font-semibold text-gray-900 mr-2">82/100</span>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '82%' }}></div>
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-white p-3 rounded border border-gray-200">
                                  <div className="text-xs text-gray-500 mb-1">Growth Potential</div>
                                  <div className="flex items-center">
                                    <span className="text-lg font-semibold text-gray-900 mr-2">78/100</span>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '78%' }}></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                            <h3 className="text-lg font-semibold mb-3">Exit Scenario Analysis</h3>
                            <div className="space-y-4">
                              <div className="bg-white rounded-lg p-3 border border-blue-200">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-base font-medium text-blue-900">Strategic Acquisition</h4>
                                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                    Highest Valuation
                                  </span>
                                </div>
                                <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                                  <div>
                                    <span className="text-xs text-gray-500 block">Est. Valuation Multiple</span>
                                    <span className="font-medium text-blue-900">5.8-6.5x EBITDA</span>
                                  </div>
                                  <div>
                                    <span className="text-xs text-gray-500 block">Timeline</span>
                                    <span className="font-medium text-blue-900">9-14 months</span>
                                  </div>
                                  <div>
                                    <span className="text-xs text-gray-500 block">Complexity</span>
                                    <span className="font-medium text-blue-900">High</span>
                                  </div>
                                </div>
                                <div className="mt-2 text-xs text-blue-800">
                                  <p>Best fit for companies seeking synergies in your industry. Potential for highest valuation due to strategic value but typically involves more complex integration.</p>
                                </div>
                              </div>
                              
                              <div className="bg-white rounded-lg p-3 border border-blue-200">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-base font-medium text-blue-900">Financial Buyer / PE</h4>
                                  <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                                    Medium Valuation
                                  </span>
                                </div>
                                <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                                  <div>
                                    <span className="text-xs text-gray-500 block">Est. Valuation Multiple</span>
                                    <span className="font-medium text-blue-900">4.8-5.5x EBITDA</span>
                                  </div>
                                  <div>
                                    <span className="text-xs text-gray-500 block">Timeline</span>
                                    <span className="font-medium text-blue-900">6-10 months</span>
                                  </div>
                                  <div>
                                    <span className="text-xs text-gray-500 block">Complexity</span>
                                    <span className="font-medium text-blue-900">Medium</span>
                                  </div>
                                </div>
                                <div className="mt-2 text-xs text-blue-800">
                                  <p>Private equity buyers typically focus on operational improvements and growth potential. May involve partial ownership or staged acquisition.</p>
                                </div>
                              </div>
                              
                              <div className="bg-white rounded-lg p-3 border border-blue-200">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-base font-medium text-blue-900">Management Buyout</h4>
                                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                    Lower Valuation
                                  </span>
                                </div>
                                <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                                  <div>
                                    <span className="text-xs text-gray-500 block">Est. Valuation Multiple</span>
                                    <span className="font-medium text-blue-900">3.8-4.5x EBITDA</span>
                                  </div>
                                  <div>
                                    <span className="text-xs text-gray-500 block">Timeline</span>
                                    <span className="font-medium text-blue-900">4-8 months</span>
                                  </div>
                                  <div>
                                    <span className="text-xs text-gray-500 block">Complexity</span>
                                    <span className="font-medium text-blue-900">Medium</span>
                                  </div>
                                </div>
                                <div className="mt-2 text-xs text-blue-800">
                                  <p>Allows for business continuity with existing management. Typically involves leveraged financing and potentially more favorable terms for owner.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                            <h3 className="text-lg font-semibold text-amber-900 mb-3">Optimal Timing</h3>
                            <div className="space-y-3">
                              <div className="bg-white p-3 rounded border border-amber-200">
                                <h4 className="text-sm font-medium text-amber-900 mb-1">Recommended Window</h4>
                                <div className="text-sm text-amber-800">
                                  <p className="mb-2">Based on your business cycle and market conditions:</p>
                                  <div className="font-medium">12-24 months from now</div>
                                </div>
                              </div>
                              
                              <div className="bg-white p-3 rounded border border-amber-200">
                                <h4 className="text-sm font-medium text-amber-900 mb-1">Key Improvements Needed</h4>
                                <ul className="text-sm text-amber-800 list-disc pl-4 space-y-1">
                                  <li>Strengthen recurring revenue streams</li>
                                  <li>Complete digital transformation initiatives</li>
                                  <li>Improve customer concentration metrics</li>
                                  <li>Formalize operational documentation</li>
                                </ul>
                              </div>
                              
                              <div className="bg-white p-3 rounded border border-amber-200">
                                <h4 className="text-sm font-medium text-amber-900 mb-1">Pre-Exit Checklist</h4>
                                <div className="mt-2 space-y-2 text-sm text-amber-800">
                                  <div className="flex items-center">
                                    <input type="checkbox" className="h-4 w-4 rounded border-amber-300 text-amber-600" />
                                    <span className="ml-2">Audited financial statements (3 years)</span>
                                  </div>
                                  <div className="flex items-center">
                                    <input type="checkbox" className="h-4 w-4 rounded border-amber-300 text-amber-600" />
                                    <span className="ml-2">Customer contracts reviewed</span>
                                  </div>
                                  <div className="flex items-center">
                                    <input type="checkbox" className="h-4 w-4 rounded border-amber-300 text-amber-600" />
                                    <span className="ml-2">IP protection documentation</span>
                                  </div>
                                  <div className="flex items-center">
                                    <input type="checkbox" className="h-4 w-4 rounded border-amber-300 text-amber-600" />
                                    <span className="ml-2">Management succession plan</span>
                                  </div>
                                  <div className="flex items-center">
                                    <input type="checkbox" className="h-4 w-4 rounded border-amber-300 text-amber-600" />
                                    <span className="ml-2">Tax optimization review</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                            <h3 className="text-lg font-semibold text-purple-900 mb-3">Liquidity Analysis</h3>
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-purple-800">Current Ratio</span>
                                  <span className="text-purple-800 font-medium">1.4</span>
                                </div>
                                <div className="w-full bg-purple-200 rounded-full h-1.5">
                                  <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                                </div>
                                <div className="text-right text-xs text-purple-700 mt-0.5">Target: &gt;1.5</div>
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-purple-800">Debt-to-EBITDA</span>
                                  <span className="text-purple-800 font-medium">2.8x</span>
                                </div>
                                <div className="w-full bg-purple-200 rounded-full h-1.5">
                                  <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                                </div>
                                <div className="text-right text-xs text-purple-700 mt-0.5">Target: &lt;2.5x</div>
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-purple-800">Cash Conversion Cycle</span>
                                  <span className="text-purple-800 font-medium">48 days</span>
                                </div>
                                <div className="w-full bg-purple-200 rounded-full h-1.5">
                                  <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '70%' }}></div>
                                </div>
                                <div className="text-right text-xs text-purple-700 mt-0.5">Target: &lt;45 days</div>
                              </div>
                            </div>
                            <div className="mt-4 text-sm text-purple-800">
                              <p>Improving liquidity metrics could increase valuation by 8-12% and attract higher quality buyers.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <Award className="h-6 w-6 text-gray-700 mr-2" />
                        <CardTitle>Synergy & Integration Analysis</CardTitle>
                      </div>
                      <CardDescription>Potential operational, financial, and strategic synergies</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Synergy Potential Assessment</h3>
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Synergy Value Categories</h4>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium text-gray-700">Revenue Synergies</span>
                                  <span className="text-sm font-medium text-green-600">High</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                                </div>
                                <div className="mt-2 text-xs text-gray-600">
                                  <ul className="list-disc pl-4 space-y-1">
                                    <li>Cross-selling opportunities with complementary products</li>
                                    <li>Geographic expansion through existing channels</li>
                                    <li>Enhanced product offerings through combined capabilities</li>
                                  </ul>
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium text-gray-700">Cost Synergies</span>
                                  <span className="text-sm font-medium text-amber-600">Medium</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                                </div>
                                <div className="mt-2 text-xs text-gray-600">
                                  <ul className="list-disc pl-4 space-y-1">
                                    <li>Operational overhead consolidation (est. 12-18% savings)</li>
                                    <li>Supply chain optimization (est. 8-10% savings)</li>
                                    <li>Shared administrative functions (est. 15-20% savings)</li>
                                  </ul>
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium text-gray-700">Financial Synergies</span>
                                  <span className="text-sm font-medium text-green-600">High</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                                </div>
                                <div className="mt-2 text-xs text-gray-600">
                                  <ul className="list-disc pl-4 space-y-1">
                                    <li>Lower cost of capital through improved credit profile</li>
                                    <li>Tax optimization opportunities</li>
                                    <li>Improved working capital management</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Integration Roadmap</h3>
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                            <h4 className="text-sm font-medium text-blue-900 mb-3">Integration Complexity Assessment</h4>
                            
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="bg-white p-3 rounded border border-blue-200">
                                <div className="text-xs text-gray-500 mb-1">Cultural Compatibility</div>
                                <div className="flex items-center">
                                  <span className="text-sm font-semibold text-blue-900 mr-2">Medium</span>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-white p-3 rounded border border-blue-200">
                                <div className="text-xs text-gray-500 mb-1">Systems Integration</div>
                                <div className="flex items-center">
                                  <span className="text-sm font-semibold text-blue-900 mr-2">Easy</span>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '80%' }}></div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-white p-3 rounded border border-blue-200">
                                <div className="text-xs text-gray-500 mb-1">Operational Integration</div>
                                <div className="flex items-center">
                                  <span className="text-sm font-semibold text-blue-900 mr-2">Complex</span>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '40%' }}></div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-white p-3 rounded border border-blue-200">
                                <div className="text-xs text-gray-500 mb-1">Customer Transition</div>
                                <div className="flex items-center">
                                  <span className="text-sm font-semibold text-blue-900 mr-2">Medium</span>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <h4 className="text-sm font-medium text-blue-900 mb-2">Integration Timeline</h4>
                            <div className="relative pb-12">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-full w-1 bg-blue-200 pointer-events-none"></div>
                              </div>
                              <div className="relative flex items-start pb-8">
                                <div className="flex-shrink-0 h-4 w-4 rounded-full bg-blue-500"></div>
                                <div className="ml-3 bg-white p-2 rounded shadow-sm border border-blue-100">
                                  <h5 className="text-xs font-medium text-blue-900">Phase 1: Day 1-90</h5>
                                  <p className="text-xs text-gray-600">Communications, key customer retention, critical systems</p>
                                </div>
                              </div>
                              <div className="relative flex items-start pb-8">
                                <div className="flex-shrink-0 h-4 w-4 rounded-full bg-blue-400"></div>
                                <div className="ml-3 bg-white p-2 rounded shadow-sm border border-blue-100">
                                  <h5 className="text-xs font-medium text-blue-900">Phase 2: Month 3-6</h5>
                                  <p className="text-xs text-gray-600">Systems integration, operational consolidation</p>
                                </div>
                              </div>
                              <div className="relative flex items-start">
                                <div className="flex-shrink-0 h-4 w-4 rounded-full bg-blue-300"></div>
                                <div className="ml-3 bg-white p-2 rounded shadow-sm border border-blue-100">
                                  <h5 className="text-xs font-medium text-blue-900">Phase 3: Month 6-12</h5>
                                  <p className="text-xs text-gray-600">Culture alignment, optimization, growth initiatives</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}